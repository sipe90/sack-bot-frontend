import { OptionsObject, SnackbarKey } from 'notistack'

interface Dictionary<A> {
    [index: string]: A
}

type GroupBy = 'alphabetic' | 'tag'

interface Notification {
    key: SnackbarKey
    message: React.ReactNode
    options?: OptionsObject
    dismissed?: boolean
}

interface UserInfo {
    name: string
    avatarUrl?: string
    memberships: Membership[]
}

interface Membership {
    guildId: string
    userId: string
    entrySound: string | null
    exitSound: string | null
    createdBy: string
    created: number
    modifiedBy: string | null
    modified: number | null
}

interface Guild {
    id: string,
    name: string,
    iconUrl: string | null,
    isAdmin: boolean,
    roles: string[]
}

interface GuildMember {
    guildId: string
    id: string
    name: string
}

interface AudioFile {
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

interface VoiceLines {
    [voice: string]: string[]
}

interface Settings {
    upload: {
        sizeLimit: number
        overrideExisting: boolean
    },
    botAvatarUrl: string
}

interface VoiceState {
    currentChannel: {
        initiatorName: string | null
        initiatorAvatar: string | null
        name: string | null
    }
    currentTrack: {
        initiatorName: string | null
        initiatorAvatar: string | null
        name: string | null
    }
    currentVolume: {
        initiatorName: string | null
        initiatorAvatar: string | null
        value: number
    }
}

type MessageType = 'InitialVoiceState' | 'TrackStartEvent' | 'TrackEndEvent' | 'VoiceChannelEvent' | 'VolumeChangeEvent'

interface MessageBase {
    initiatorName: string | null
    initiatorAvatar: string | null
    type: MessageType
}

type Message = InitialVoiceState | TrackStartEvent | TrackEndEvent | VoiceChannelEvent | VolumeChangeEvent

interface InitialVoiceState extends MessageBase {
    type: 'InitialVoiceState'
    currentChannel: string | null
    volume: number
}

interface TrackStartEvent extends MessageBase {
    type: 'TrackStartEvent'
    track: string
}

interface TrackEndEvent extends MessageBase {
    type: 'TrackEndEvent'
    track: string
}

interface VoiceChannelEvent extends MessageBase {
    type: 'VoiceChannelEvent'
    channelJoined: string | null
    channelLeft: string | null
}

interface VolumeChangeEvent extends MessageBase {
    type: 'VolumeChangeEvent'
    volume: number
}