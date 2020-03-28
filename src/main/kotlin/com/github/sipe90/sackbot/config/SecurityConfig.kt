package com.github.sipe90.sackbot.config

import com.github.sipe90.sackbot.auth.DiscordAuthority
import com.github.sipe90.sackbot.auth.DiscordUser
import com.github.sipe90.sackbot.persistence.MemberRepository
import com.github.sipe90.sackbot.service.JDAService
import net.dv8tion.jda.api.entities.Guild
import net.dv8tion.jda.api.entities.Role
import org.springframework.context.annotation.Bean
import org.springframework.http.HttpStatus
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity
import org.springframework.security.config.web.server.ServerHttpSecurity
import org.springframework.security.oauth2.client.registration.ReactiveClientRegistrationRepository
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest
import org.springframework.security.oauth2.client.userinfo.ReactiveOAuth2UserService
import org.springframework.security.oauth2.client.web.reactive.function.client.ServerOAuth2AuthorizedClientExchangeFilterFunction
import org.springframework.security.oauth2.client.web.server.ServerOAuth2AuthorizedClientRepository
import org.springframework.security.oauth2.core.user.OAuth2User
import org.springframework.security.web.server.SecurityWebFilterChain
import org.springframework.security.web.server.authentication.HttpStatusServerEntryPoint
import org.springframework.web.reactive.function.client.WebClient
import reactor.core.publisher.Mono

@EnableWebFluxSecurity
class SecurityConfig {

    @Bean
    fun springSecurityFilterChain(http: ServerHttpSecurity): SecurityWebFilterChain {
        return http

            .authorizeExchange()
            .pathMatchers("/api/**").authenticated()
            .anyExchange().permitAll()
            .and().exceptionHandling().authenticationEntryPoint(HttpStatusServerEntryPoint(HttpStatus.UNAUTHORIZED))
            .and().httpBasic().disable()
            .csrf().disable()
            .oauth2Client()
            .and()
            .oauth2Login()
            .and()
            .build()
    }

    @Bean
    fun rest(
        clientRegistrations: ReactiveClientRegistrationRepository,
        authorizedClients: ServerOAuth2AuthorizedClientRepository
    ): WebClient {
        return WebClient.builder()
            .filter(ServerOAuth2AuthorizedClientExchangeFilterFunction(clientRegistrations, authorizedClients)).build()
    }

    @Bean
    fun oauth2UserService(
        rest: WebClient,
        jdaService: JDAService,
        memberRepository: MemberRepository
    ): ReactiveOAuth2UserService<OAuth2UserRequest, OAuth2User> {
        val delegate = DefaultOAuth2UserService()
        return ReactiveOAuth2UserService { request ->
            Mono.fromCallable {
                val attributes = DiscordUser.Attributes.getForScopes(*request.accessToken.scopes.toTypedArray())

                val user = delegate.loadUser(request)
                val userId = user.attributes[DiscordUser.Attributes.ID] as String
                val mutualGuilds = jdaService.getMutualGuilds(userId)

                DiscordUser(
                    buildAuthorities(userId, mutualGuilds),
                    user.attributes.filterKeys(attributes::contains)
                )
            }
        }
    }

    private fun buildAuthorities(userId: String, guilds: List<Guild>): List<DiscordAuthority> {
        return guilds.map {
            val member = it.getMemberById(userId) ?: throw RuntimeException("Member not found")
            val roles = member.roles.map(Role::getName).toSet()
            DiscordAuthority(it.id, roles, member.isOwner)
        }
    }
}