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

    const { updateSound, deleteSound, uploadSounds, updateEntrySound, updateExitSound, playRandomSound, playSound, setVolume, playUrl, getSounds } = useSoundsApi()

    const _updateSound = useCallback(async (audioFile: AudioFile) => {
        if (selectedGuildId === null) throw Error("Guild id is null")
        const existing = existsByName(sounds, audioFile.name)
        if (!existing) throw Error("Unknown sound " + audioFile.name)

        const result = await updateSound(selectedGuildId, audioFile)
        if (result.ok) {
            setSounds([...excludeSoundByName(sounds, audioFile.name), audioFile])
        }
    }, [selectedGuildId, sounds, updateSound, setSounds])

    const _deleteSound = useCallback(async (name: string) => {
        if (selectedGuildId === null) throw Error("Guild id is null")
        const existing = existsByName(sounds, name)
        if (!existing) throw Error("Unknown sound " + name)

        const result = await deleteSound(selectedGuildId, name)
        if (result.ok) {
            setSounds(excludeSoundByName(sounds, name))
        }
    }, [deleteSound, selectedGuildId, setSounds, sounds])

    const _uploadSounds = useCallback(async (files: FileList) => {
        if (selectedGuildId === null) throw Error("Guild id is null")

        const uploadResult = await uploadSounds(selectedGuildId, files)
        if (uploadResult.ok) {
            const getResult = await getSounds(selectedGuildId)
            if (getResult.ok) {
                setSounds(getResult.safeUnwrap())
            }
        }
    }, [getSounds, selectedGuildId, setSounds, uploadSounds])

    const _updateEntrySound = useCallback(async (sound?: string) => {
        if (selectedGuildId === null) throw Error("Guild id is null")

        updateEntrySound(selectedGuildId, sound)
            .then((result) => result.map(() => setEntrySound(sound ?? null)))
    }, [selectedGuildId, setEntrySound, updateEntrySound])

    const _updateExitSound = useCallback(async (sound?: string) => {
        if (selectedGuildId === null) throw Error("Guild id is null")

        const result = await updateExitSound(selectedGuildId, sound)
        if (result.ok) {
            setExitSound(sound ?? null)
        }
    }, [selectedGuildId, setExitSound, updateExitSound])

    const _playRandomSound = useCallback(async (tagFilter?: string[]) => {
        if (selectedGuildId === null) throw Error("Guild id is null")

        await playRandomSound(selectedGuildId, tagFilter)
    }, [playRandomSound, selectedGuildId])

    const _playSound = useCallback(async (sound: string) => {
        if (selectedGuildId === null) throw Error("Guild id is null")

        await playSound(selectedGuildId, sound)
    }, [playSound, selectedGuildId])

    const _playUrl = useCallback(async (url: string) => {
        if (selectedGuildId === null) throw Error("Guild id is null")

        await playUrl(selectedGuildId, url)
    }, [playUrl, selectedGuildId])

    const _setVolume = useCallback(async (volume: number) => {
        if (selectedGuildId === null) throw Error("Guild id is null")

        await setVolume(selectedGuildId, volume)
    }, [selectedGuildId, setVolume])

    return {
        sounds,
        entrySound,
        exitSound,
        updateSound: _updateSound,
        deleteSound: _deleteSound,
        uploadSounds: _uploadSounds,
        updateEntrySound: _updateEntrySound,
        updateExitSound: _updateExitSound,
        playRandomSound: _playRandomSound,
        playSound: _playSound,
        playUrl: _playUrl,
        setVolume: _setVolume
    }
}

const excludeSoundByName = (sounds: AudioFile[], name: string) => sounds.filter((sound) => sound.name !== name)

const existsByName = (sounds: AudioFile[], name: string) => sounds.some((sound) => sound.name === name)

export default useSoundsState