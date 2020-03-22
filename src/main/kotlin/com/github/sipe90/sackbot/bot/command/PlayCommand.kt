package com.github.sipe90.sackbot.bot.command

import com.github.sipe90.sackbot.config.BotConfig
import com.github.sipe90.sackbot.service.AudioFileService
import com.github.sipe90.sackbot.service.AudioPlayerService
import com.github.sipe90.sackbot.util.getGuild
import com.github.sipe90.sackbot.util.getVoiceChannel
import net.dv8tion.jda.api.events.Event
import org.springframework.stereotype.Component
import reactor.core.publisher.Flux
import reactor.core.publisher.toMono

@Component
class PlayCommand(
    private val config: BotConfig,
    private val fileService: AudioFileService,
    private val playerService: AudioPlayerService
) : BotCommand {

    override val commandPrefix = ""

    override fun canProcess(vararg command: String) = true

    override fun process(initiator: Event, vararg command: String): Flux<String> = Flux.defer {
        val guild = getGuild(initiator)
        val voiceChannel = getVoiceChannel(initiator)

        if (guild == null || voiceChannel == null) return@defer "Could not find guild or voice channel to perform the action".toMono()

        if (command.size != 1) {
            return@defer "Invalid play command. Correct format is `${config.chat.commandPrefix}<soundName>`".toMono()
        }

        val audioFileName = command[0]

        fileService.findAudioFile(guild.id, audioFileName)
            .flatMap {
                playerService.playAudioInChannel(it.name, voiceChannel)
                    .then("Playing sound file `$audioFileName` in voice channel `#${voiceChannel.name}`".toMono())
            }
            .switchIfEmpty("Could not find any sounds with given name".toMono())
    }
}