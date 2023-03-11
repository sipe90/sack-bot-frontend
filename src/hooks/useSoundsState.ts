import { deleteSoundRequest, getSoundsRequest, updateSoundRequest, uploadSoundsRequest } from '@/api'
import { guildSoundsState } from '@/state/sounds'
import { selectedGuildIdState } from '@/state/guild'
import { AudioFile } from '@/types'
import { useRecoilStateLoadable, useRecoilValue } from 'recoil'

const useSoundsState = () => {
    const guildId = useRecoilValue(selectedGuildIdState)
    const [soundsLoadable, setSounds] = useRecoilStateLoadable(guildSoundsState)

    const sounds = soundsLoadable.valueMaybe() || []
    const soundsLoading = soundsLoadable.state === 'loading'

    const updateSound = async (audioFile: AudioFile) => {
        if (guildId === null) throw Error("Guild id is null")
        const existing = existsByName(soundsLoadable.valueOrThrow(), audioFile.name)
        if (!existing) throw Error("Unknown sound " + audioFile.name)

        await updateSoundRequest(guildId, audioFile.name, audioFile)
        setSounds([...excludeSoundByName(soundsLoadable.valueOrThrow(), audioFile.name), audioFile])
    }

    const deleteSound = async (name: string) => {
        if (guildId === null) throw Error("Guild id is null")
        const existing = existsByName(soundsLoadable.valueOrThrow(), name)
        if (!existing) throw Error("Unknown sound " + name)

        await deleteSoundRequest(guildId, name)
        setSounds(excludeSoundByName(soundsLoadable.valueOrThrow(), name))
    }

    const uploadSounds = async (files: FileList) => {
        if (guildId === null) throw Error("Guild id is null")
        await uploadSoundsRequest(guildId, files)
        const sounds = await getSoundsRequest(guildId)
        setSounds(sounds)
    }

    return {
        sounds,
        soundsLoading,
        updateSound,
        deleteSound,
        uploadSounds
    }
}

const excludeSoundByName = (sounds: AudioFile[], name: string) => sounds.filter((sound) => sound.name !== name)

const existsByName = (sounds: AudioFile[], name: string) => sounds.some((sound) => sound.name === name)

export default useSoundsState