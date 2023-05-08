import { useRecoilState } from 'recoil'

import { Message } from '@/types'
import useGuildState from './useGuildState'
import useWebSocket from './useWebSocket'
import { guildVoiceState } from '@/state/voice'
import { useCallback } from 'react'


const useEvents = () => {

    const { selectedGuildId } = useGuildState()

    const [voiceState, setVoiceState] = useRecoilState(guildVoiceState)

    const url = selectedGuildId ? `ws://localhost:3000/ws/events?guildId=${selectedGuildId}` : null

    const messageHandler = useCallback((message: string) => {
        const msg: Message = JSON.parse(message)
        const { initiatorName, initiatorAvatar } = msg

        switch (msg.type) {
            case 'InitialVoiceState':
                setVoiceState({
                    ...voiceState,
                    currentChannel: {
                        initiatorName,
                        initiatorAvatar,
                        name: msg.currentChannel,
                    },
                    currentVolume: {
                        ...voiceState.currentVolume,
                        value: msg.volume
                    }
                })
                break
            case 'TrackStartEvent':
                setVoiceState({
                    ...voiceState,
                    currentTrack: {
                        initiatorName,
                        initiatorAvatar,
                        name: msg.track
                    }
                })
                break
            case 'TrackEndEvent':
                setVoiceState({
                    ...voiceState,
                    currentTrack: {
                        initiatorName,
                        initiatorAvatar,
                        name: null
                    },
                })
                break
            case 'VoiceChannelEvent':
                setVoiceState({
                    ...voiceState,
                    currentChannel: {
                        ...voiceState.currentChannel,
                        initiatorName,
                        initiatorAvatar,
                        name: msg.channelJoined,
                    }
                })
                break
            case 'VolumeChangeEvent':
                setVoiceState({
                    ...voiceState,
                    currentVolume: {
                        initiatorName,
                        initiatorAvatar,
                        value: msg.volume
                    }
                })
                break
            default:
                throw new Error('Unknown message')
        }
    }, [setVoiceState, voiceState])

    useWebSocket({
        url,
        messageHandler
    })
}

export default useEvents
