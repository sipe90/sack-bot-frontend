import { VoiceState } from '@/types'
import { atom } from 'recoil'


export const guildVoiceState = atom<VoiceState>({
    key: 'guildVoiceState',
    default: {
        currentChannel: {
            initiatorName: null,
            initiatorAvatar: null,
            name: null
        },
        currentTrack: {
            initiatorName: null,
            initiatorAvatar: null,
            name: null
        },
        currentVolume: {
            initiatorName: null,
            initiatorAvatar: null,
            value: null
        }
    }
})
