import { guildSoundsState } from '@/state/sounds'
import { entrySoundState, exitSoundState, selectedGuildIdState } from '@/state/guild'
import { AudioFile } from '@/types'
import { useRecoilState, useRecoilValue } from 'recoil'
import { useCallback } from 'react'
import useSoundsApi from './useSoundsApi'

const useSoundsState = () => {
    const selectedGuildId = useRecoilValue(selectedGuildIdState)
    const [sounds, setSounds] = useRecoilState(guildSoundsState)
    const [entrySound, setEntrySound] = useRecoilState(entrySoundState)
    const [exitSound, setExitSound] = useRecoilState(exitSoundState)

    const api = useSoundsApi()

    const updateSound = useCallback(async (audioFile: AudioFile) => {
        if (selectedGuildId === null) throw Error("Guild id is null")
        const existing = existsByName(sounds, audioFile.name)
        if (!existing) throw Error("Unknown sound " + audioFile.name)

        const result = await api.updateSound(selectedGuildId, audioFile)
        if (result.ok) {
            setSounds([...excludeSoundByName(sounds, audioFile.name), audioFile])
        }
    }, [selectedGuildId, sounds, api, setSounds])

    const deleteSound = useCallback(async (name: string) => {
        if (selectedGuildId === null) throw Error("Guild id is null")
        const existing = existsByName(sounds, name)
        if (!existing) throw Error("Unknown sound " + name)

        const result = await api.deleteSound(selectedGuildId, name)
        if (result.ok) {
            setSounds(excludeSoundByName(sounds, name))
        }
    }, [api, selectedGuildId, setSounds, sounds])

    const uploadSounds = useCallback(async (files: FileList) => {
        if (selectedGuildId === null) throw Error("Guild id is null")

        const uploadResult = await api.uploadSounds(selectedGuildId, files)
        if (uploadResult.ok) {
            const getResult = await api.getSounds(selectedGuildId)
            if (getResult.ok) {
                setSounds(getResult.safeUnwrap())
            }
        }
    }, [api, selectedGuildId, setSounds])

    const updateEntrySound = useCallback(async (sound?: string) => {
        if (selectedGuildId === null) throw Error("Guild id is null")

        api.updateEntrySound(selectedGuildId, sound)
            .then((result) => result.map(() => setEntrySound(sound ?? null)))
    }, [api, selectedGuildId, setEntrySound])

    const updateExitSound = useCallback(async (sound?: string) => {
        if (selectedGuildId === null) throw Error("Guild id is null")

        const result = await api.updateExitSound(selectedGuildId, sound)
        if (result.ok) {
            setExitSound(sound ?? null)
        }
    }, [api, selectedGuildId, setExitSound])

    const playRandomSound = useCallback(async (volume?: number, tagFilter?: string[]) => {
        if (selectedGuildId === null) throw Error("Guild id is null")

        await api.playRandomSound(selectedGuildId, volume, tagFilter)
    }, [api, selectedGuildId])

    const playSound = useCallback(async (sound: string, volume?: number) => {
        if (selectedGuildId === null) throw Error("Guild id is null")

        await api.playSound(selectedGuildId, sound, volume)
    }, [api, selectedGuildId])

    const playUrl = useCallback(async (url: string, volume?: number) => {
        if (selectedGuildId === null) throw Error("Guild id is null")

        await api.playUrl(selectedGuildId, url, volume)
    }, [api, selectedGuildId])

    const setVolume = useCallback(async (volume: number) => {
        if (selectedGuildId === null) throw Error("Guild id is null")

        await api.setVolume(selectedGuildId, volume)
    }, [api, selectedGuildId])

    return {
        sounds,
        updateSound,
        deleteSound,
        uploadSounds,
        entrySound,
        updateEntrySound,
        exitSound,
        updateExitSound,
        playRandomSound,
        playSound,
        playUrl,
        setVolume
    }
}

const excludeSoundByName = (sounds: AudioFile[], name: string) => sounds.filter((sound) => sound.name !== name)

const existsByName = (sounds: AudioFile[], name: string) => sounds.some((sound) => sound.name === name)

export default useSoundsState