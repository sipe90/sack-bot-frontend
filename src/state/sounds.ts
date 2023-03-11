import { atom, selector } from 'recoil'

import { AudioFile } from '@/types'
import { selectedGuildIdState } from '@/state/guild'
import { getSoundsRequest } from '@/api'

export const guildSoundsState = atom<AudioFile[]>({
    key: 'guildSoundsState',
    default: selector({
        key: 'guildSoundsStateLoader',
        get: ({ get }) => {
            const guildId = get(selectedGuildIdState)
            if (guildId === null) {
                return []
            }
            return getSoundsRequest(guildId)
        }
    })
})
