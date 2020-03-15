package com.github.sipe90.sackbot.auth

import org.springframework.security.core.GrantedAuthority
import org.springframework.security.oauth2.core.user.DefaultOAuth2User

/**
 * https://discordapp.com/developers/docs/resources/user#user-object
 */
class DiscordUser(
    authorities: Collection<GrantedAuthority>,
    attributes: Map<String, Any>,
    nameAttributeKey: String
) : DefaultOAuth2User(authorities, attributes, nameAttributeKey) {

    object Attributes {
        const val ID = "id"
        const val USERNAME = "username"
        const val DISCRIMINATOR = "discriminator"
        const val AVATAR = "avatar"
        const val BOT = "bot"
        const val SYSTEM = "system"
        const val MFA_ENABLED = "mfa_enabled"
        const val LOCALE = "locale"
        const val FLAGS = "flags"
        const val PREMIUM_TYPE = "premium_type"
        const val VERIFIED = "verified"
        const val EMAIL = "email"

        const val GUILDS = "guilds"

        fun getForScope(scope: String): List<String> =
            when (scope) {
                "identify" -> listOf(
                    ID,
                    USERNAME,
                    DISCRIMINATOR,
                    AVATAR,
                    BOT,
                    SYSTEM,
                    MFA_ENABLED,
                    LOCALE,
                    FLAGS,
                    PREMIUM_TYPE
                )
                "email" -> listOf(VERIFIED, EMAIL)
                "guilds" -> listOf(GUILDS)
                else -> listOf()
            }

        fun getForScopes(vararg scopes: String): List<String> = scopes.flatMap(this::getForScope)
    }

    // Identity scope

    override fun getName() = getUsername()

    fun getId(): String = attributes[Attributes.ID] as String
    fun getUsername(): String = attributes[Attributes.USERNAME] as String
    fun getDiscriminator(): String = attributes[Attributes.DISCRIMINATOR] as String
    fun getAvatar(): String? = attributes[Attributes.AVATAR] as String?
    fun isBot(): Boolean? = attributes[Attributes.BOT] as Boolean?
    fun isSystem(): Boolean? = attributes[Attributes.SYSTEM] as Boolean?
    fun isMfaEnabled(): Boolean? = attributes[Attributes.MFA_ENABLED] as Boolean?
    fun getLocale(): String? = attributes[Attributes.LOCALE] as String?
    fun getFlags(): Int? = attributes[Attributes.FLAGS] as Int?
    fun getPremiumType(): Int? = attributes[Attributes.PREMIUM_TYPE] as Int?

    // Email scope

    fun isVerified(): Boolean? = attributes[Attributes.VERIFIED] as Boolean?
    fun getEmail(): String? = attributes[Attributes.EMAIL] as String?

    // Custom (guilds scope)

    @Suppress("UNCHECKED_CAST")
    fun getGuilds(): List<DiscordGuild> = attributes[Attributes.GUILDS] as List<DiscordGuild>
}