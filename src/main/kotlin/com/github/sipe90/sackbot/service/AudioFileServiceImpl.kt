package com.github.sipe90.sackbot.service

import com.github.sipe90.sackbot.component.FileWatcher
import com.github.sipe90.sackbot.config.FilesConfig
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.io.IOException
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths

@Service
class AudioFileServiceImpl(private val config: FilesConfig, private val watcher: FileWatcher) : AudioFileService {

    private final val logger = LoggerFactory.getLogger(javaClass)

    private final val audioFolderPath: Path = Paths.get(config.folder)

    init {
        if (Files.notExists(audioFolderPath)) {
            logger.info("Folder path {} not found, attempting to auto-create...", audioFolderPath)
            try {
                Files.createDirectories(audioFolderPath)
            } catch (e: IOException) {
                logger.error("Failed to create folders", e)
            }
            logger.info("Folder successfully created")
        }

        if (!Files.isReadable(audioFolderPath)) {
            throw IllegalArgumentException("Audio folder path " + config.folder + " is not readable")
        }

        if (!Files.isDirectory(audioFolderPath)) {
            throw IllegalArgumentException("Audio folder path " + config.folder + " does not point to a directory")
        }

        if (config.watcher.enabled) {
            watcher.start(audioFolderPath)
        }
    }

    override fun getAudioFilePaths(): Flux<Path> {
        return Flux.fromStream {
            Files.list(audioFolderPath).filter { Files.isRegularFile(it) && Files.isReadable(it) }
        }
    }

    override fun getAudioFilePathByName(name: String): Mono<Path> {
        return getAudioFilePaths().filter { stripExtension(it.fileName.toString()) == name }.next()
    }

    override fun getAudioFiles(): Flux<String> {
        return getAudioFilePaths().map { stripExtension(it.fileName.toString()) }
    }

    fun stripExtension(fileName: String): String {
        val last = fileName.lastIndexOf('.')
        return if (last > 0) fileName.substring(0, last) else fileName
    }
}