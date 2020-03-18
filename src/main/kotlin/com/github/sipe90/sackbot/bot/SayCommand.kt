package com.github.sipe90.sackbot.bot

import club.minnced.jda.reactor.toMono
import com.github.sipe90.sackbot.config.BotConfig
import com.github.sipe90.sackbot.service.AudioPlayerService
import com.github.sipe90.sackbot.util.getVoiceChannel
import net.dv8tion.jda.api.events.Event
import org.springframework.stereotype.Component
import reactor.core.publisher.Mono

@Component
class SayCommand(private val config: BotConfig, private val playerService: AudioPlayerService) : BotCommand {

    override val commandPrefix = "say"

    override fun process(initiator: Event, vararg command: String): Mono<String> = Mono.defer {
        val voiceChannel = getVoiceChannel(initiator)
            ?: return@defer "Could not find guild or voice channel to perform the action".toMono()
        if (command.size < 2) {
            return@defer playerService.playRandomTtsInChannel(voiceChannel)
                .map { "Playing random text to speech phrase in voice channel `#${voiceChannel.name}`" }
                .switchIfEmpty("Invalid say command. Correct format is `${config.chat.commandPrefix}say <text>`".toMono())
        }

        val text = command.slice(1 until command.size).joinToString(" ")

        playerService.playTtsInChannel(text, voiceChannel)
            .flatMap { "Playing text to speech in voice channel `#${voiceChannel.name}`".toMono() }
    }
}