import { getGuildMembersRequest, getGuildsRequest, setEntrySoundRequest, setExitSoundRequest } from '@/api'
import { Guild, GuildMember, Membership } from '@/types'
import { atom, DefaultValue, selector } from 'recoil'
import { userState } from './user'

export const guildsState = atom<Guild[]>({
    key: 'guilds',
    default: selector({
        key: 'guildsStateLoader',
        get: () => getGuildsRequest()
    })
})

export const selectedGuildIdState = atom<string | null>({
    key: 'selectedGuildId',
    default: null
})

export const guildMembersState = selector<GuildMember[]>({
    key: 'guildMembers',
    get: ({ get }) => {
        const guildId = get(selectedGuildIdState)
        if (guildId === null) {
            return []
        }
        return getGuildMembersRequest(guildId)
    }
})

export const selectedGuildState = selector<Guild | null>({
    key: 'selectedGuild',
    get: ({ get }) => {
        const selectedGuildId = get(selectedGuildIdState)
        if (selectedGuildId === null) return null
        const guilds = get(guildsState)
        return guilds.find((g) => g.id === selectedGuildId) || null
    }
})

export const selectedGuildMembershipState = selector<Membership | null>({
    key: 'selectedGuildMembership',
    get: ({ get }) => {
        const userInfo = get(userState)
        const selectedGuildId = get(selectedGuildIdState)
        return userInfo.memberships.find((m) => m.guildId === selectedGuildId) || null
    }
})

export const entrySoundState = selector<string | null>({
    key: 'entrySound',
    get: ({ get }) => {
        const selectedGuildMembership = get(selectedGuildMembershipState)
        return selectedGuildMembership?.entrySound || null
    },
    set: async ({ get, set }, newValue) => {
        if (newValue instanceof DefaultValue) return
        const guildId = get(selectedGuildIdState)
        if (guildId === null) {
            return
        }
        await setEntrySoundRequest(guildId, newValue || undefined)
        const userInfo = get(userState)
        set(userState, {
            ...userInfo,
            memberships: userInfo.memberships.map((m) =>
                m.guildId === guildId ? { ...m, entrySound: newValue } : m)
        })
    }
})

export const exitSoundState = selector<string | null>({
    key: 'exitSound',
    get: ({ get }) => {
        const selectedGuildMembership = get(selectedGuildMembershipState)
        return selectedGuildMembership?.entrySound || null
    },
    set: async ({ get, set }, newValue) => {
        if (newValue instanceof DefaultValue) return
        const guildId = get(selectedGuildIdState)
        if (guildId === null) {
            return
        }
        await setExitSoundRequest(guildId, newValue || undefined)
        const userInfo = get(userState)
        set(userState, {
            ...userInfo,
            memberships: userInfo.memberships.map((m) =>
                m.guildId === guildId ? { ...m, exitSound: newValue } : m)
        })
    }
})