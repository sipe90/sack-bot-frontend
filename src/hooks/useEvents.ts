import { useRecoilState } from 'recoil'

import { Message } from '@/types'
import useGuildState from './useGuildState'
import WS from '../ws'
import { guildVoiceState } from '@/state/voice'
import { useCallback, useEffect, useRef } from 'react'


const useEvents = () => {

    const { selectedGuildId } = useGuildState()

    const [voiceState, setVoiceState] = useRecoilState(guildVoiceState)

    const ws = useRef<WS | null>(null)

    const protocol = window.location.protocol === "https:" ? "wss://" : "ws://"
    const url = selectedGuildId ? `${protocol}${window.location.host}/ws/events?guildId=${selectedGuildId}` : null

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

    useEffect(() => {
        if (url !== null) {
            ws.current = new WS(url)
        }
    }, [url])

    useEffect(() => {
        if (ws.current !== null) {
            ws.current.setMessageHandler(messageHandler)
            if (!ws.current.connected) {
                ws.current.connect()
            }
        }
    }, [messageHandler])
}

export default useEvents
