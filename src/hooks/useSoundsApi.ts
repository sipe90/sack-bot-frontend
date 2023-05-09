import { ApiError, deleteSoundRequest, getSoundsRequest, playRandomSoundRequest, playSoundRequest, playUrlRequest, setEntrySoundRequest, setExitSoundRequest, setVolumeRequest, updateSoundRequest, uploadSoundsRequest } from '@/api'
import { AudioFile } from '@/types'
import { useCallback } from 'react'
import { Result } from 'ts-results'
import useNotification from './useNotification'

const useSoundsApi = () => {
    const { apiErrorNotification } = useNotification()

    const handleErrorResult = useCallback((message: string) => <T>(result: Result<T, ApiError>) =>
        result.mapErr((err) => apiErrorNotification(err, message)), [apiErrorNotification])

    const getSounds = useCallback((guildId: string) =>
        getSoundsRequest(guildId).then(handleErrorResult("Failed to load sounds"))
        , [handleErrorResult])

    const updateSound = useCallback((guildId: string, audioFile: AudioFile) =>
        updateSoundRequest(guildId, audioFile.name, audioFile)
            .then(handleErrorResult("Failed to update sound"))
        , [handleErrorResult])

    const deleteSound = useCallback((guildId: string, name: string) =>
        deleteSoundRequest(guildId, name)
            .then(handleErrorResult("Failed to delete sound"))
        , [handleErrorResult])

    const uploadSounds = useCallback((guildId: string, files: FileList) =>
        uploadSoundsRequest(guildId, files)
            .then(handleErrorResult("Failed to upload sounds"))
        , [handleErrorResult])

    const updateEntrySound = useCallback((guildId: string, sound?: string) =>
        setEntrySoundRequest(guildId, sound)
            .then(handleErrorResult("Failed to set entry sound"))
        , [handleErrorResult])

    const updateExitSound = useCallback((guildId: string, sound?: string) =>
        setExitSoundRequest(guildId, sound)
            .then(handleErrorResult("Failed to set exit sound"))
        , [handleErrorResult])

    const playRandomSound = useCallback((guildId: string, tagFilter?: string[]) =>
        playRandomSoundRequest(guildId, tagFilter)
            .then(handleErrorResult("Failed to play sound"))
        , [handleErrorResult])

    const playSound = useCallback((guildId: string, sound: string) =>
        playSoundRequest(guildId, sound)
            .then(handleErrorResult("Failed to play sound"))
        , [handleErrorResult])

    const playUrl = useCallback((guildId: string, url: string) =>
        playUrlRequest(guildId, url)
            .then(handleErrorResult("Failed to play sound"))
        , [handleErrorResult])

    const setVolume = useCallback((guildId: string, volume: number) =>
        setVolumeRequest(guildId, volume)
            .then(handleErrorResult("Failed to set volume"))
        , [handleErrorResult])

    return {
        getSounds,
        updateSound,
        deleteSound,
        uploadSounds,
        updateEntrySound,
        updateExitSound,
        playRandomSound,
        playSound,
        playUrl,
        setVolume
    }
}

export default useSoundsApi