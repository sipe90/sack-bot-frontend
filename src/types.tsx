import { OptionsObject, SnackbarKey } from 'notistack'

export interface Dictionary<A> {
    [index: string]: A
}

export interface Notification {
    key: SnackbarKey
    message: React.ReactNode
    options?: OptionsObject
    dismissed?: boolean
}

export interface UserInfo {
    name: string
    avatarUrl?: string
    memberships: Membership[]
}

export interface Membership {
    guildId: string
    userId: string
    entrySound: string | null
    exitSound: string | null
    createdBy: string
    created: number
    modifiedBy: string | null
    modified: number | null
}

export interface Guild {
    id: string,
    name: string,
    iconUrl: string | null,
    isAdmin: boolean,
    roles: string[]
}

export interface GuildMember {
    guildId: string
    id: string
    name: string
}

export interface AudioFile {
    name: string
    extension?: string
    size: number
    guildId: string
    tags: string[]
    createdBy: string
    created: number
    modifiedBy: string | null
    modified: number | null
}

export interface VoiceLines {
    [voice: string]: string[]
}

export interface Settings {
    upload: {
        sizeLimit: number
        overrideExisting: boolean
    }
}