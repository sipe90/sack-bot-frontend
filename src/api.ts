import { Ok, Err, Result } from 'ts-results'

import { AudioFile, Guild, GuildMember, Settings, UserInfo } from '@/types'
import { buildQueryString, ErrorResponse, fetchJson, JsonResponse } from '@/util'

export class ApiError extends Error {

    status: number
    statusText: string

    field: string | undefined
    serverStack: string | undefined

    constructor(response: ErrorResponse) {
        super(response.json?.message ?? response.statusText)

        this.status = response.status
        this.statusText = response.statusText

        this.serverStack = response.json?.stack
        this.field = response.json?.field
    }
}

// User

export const getUserInfoRequest = () =>
    getRequest<UserInfo>('/api/me')

// Guild

export const getGuildsRequest = () =>
    getRequest<Guild[]>('/api/guilds')

export const getGuildMembersRequest = (guildId: string) =>
    getRequest<GuildMember[]>(`/api/${guildId}/members`)

// Settings

export const getSettingsRequest = () =>
    getRequest<Settings>('/api/settings')

// Sounds

export const getSoundsRequest = (guildId: string) =>
    getRequest<AudioFile[]>(`/api/${guildId}/sounds`)

export const playSoundRequest = (guildId: string, name: string, vol?: number) =>
    postRequest(`/api/${guildId}/sounds/${name}/play?${buildQueryString({ vol })}`)

export const playRandomSoundRequest = (guildId: string, vol?: number, tags: string[] = []) =>
    postRequest(`/api/${guildId}/sounds/rnd?${buildQueryString({ tags, vol })}`)

export const playUrlRequest = (guildId: string, url: string, vol?: number) =>
    postRequest(`/api/${guildId}/sounds/url?${buildQueryString({ url, vol })}`)

export const updateSoundRequest = (guildId: string, name: string, audioFile: AudioFile) =>
    postRequest(`/api/${guildId}/sounds/${name}`, { body: audioFile })

export const deleteSoundRequest = (guildId: string, name: string) =>
    deleteRequest(`/api/${guildId}/sounds/${name}`)

export const setEntrySoundRequest = (guildId: string, name?: string) =>
    putRequest(`/api/${guildId}/sounds/entry?${buildQueryString({ name })}`)

export const setExitSoundRequest = (guildId: string, name?: string) =>
    putRequest(`/api/${guildId}/sounds/exit?${buildQueryString({ name })}`)

export const setVolumeRequest = (guildId: string, volume: number) =>
    putRequest(`/api/${guildId}/volume?${buildQueryString({ volume })}`)

export const uploadSoundsRequest = (guildId: string, files: FileList) => {
    const formData = new FormData()
    for (const file of files) {
        formData.append(file.name, file, file.name)
    }

    return apiRequest(() => fetchJson(`/api/${guildId}/sounds`, {
        body: formData
    }))
}

// Other

export const pingRequest = () => getRequest('api/ping')


const apiRequest = async <T>(call: () => Promise<JsonResponse<T>>): Promise<Result<T, ApiError>> => {
    const res = await call()
    if (res.ok) {
        return Ok(res.json)
    }
    return Err(new ApiError(res))
}

const getRequest = <E = void>(url: string) => apiRequest(() => fetchJson<E>(url))

interface PostRequestOpts {
    body?: object | string
}

const postRequest = <E = void>(url: string, opts?: PostRequestOpts) => apiRequest(() => fetchJson<E>(url, {
    body: typeof opts?.body === 'string' ? opts.body : JSON.stringify(opts?.body),
    headers: typeof opts?.body === 'undefined' ? undefined : { 'content-type': 'application/json' },
    method: 'POST'
}))

interface PutRequestOpts {
    body?: object | string
}

const putRequest = <E = void>(url: string, opts?: PutRequestOpts) => apiRequest(() => fetchJson<E>(url, {
    body: typeof opts?.body === 'string' ? opts.body : JSON.stringify(opts?.body),
    headers: typeof opts?.body === 'undefined' ? undefined : { 'content-type': 'application/json' },
    method: 'PUT'
}))

const deleteRequest = <E = void>(url: string) => apiRequest(() => fetchJson<E>(url, { method: 'DELETE' }))
