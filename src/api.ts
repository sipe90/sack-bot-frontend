import { AudioFile, Guild, GuildMember, Settings, UserInfo } from '@/types'
import { buildQueryString, fetchJson, JsonResponse } from '@/util'

// User

export const getUserInfoRequest = () =>
    getRequest<UserInfo>('/api/me')

export const getGuildsRequest = () =>
    getRequest<Guild[]>('/api/guilds')

export const getGuildMembersRequest = (guildId: string) =>
    getRequest<GuildMember[]>(`/api/${guildId}/members`)

export const setEntrySoundRequest = (guildId: string, name?: string) =>
    putRequest(`/api/${guildId}/sounds/entry?${buildQueryString({ name })}`)

export const setExitSoundRequest = (guildId: string, name?: string) =>
    putRequest(`/api/${guildId}/sounds/exit?${buildQueryString({ name })}`)

// Settings

export const getSettingsRequest = () =>
    getRequest<Settings>('/api/settings')

// Sounds

export const getSoundsRequest = (guildId: string) =>
    getRequest<AudioFile[]>(`/api/${guildId}/sounds`)

export const playSoundRequest = (guildId: string, name: string, vol?: number) =>
    postRequest(`/api/${guildId}/sounds/${name}/play?${buildQueryString({ vol })}`)

export const playRandomSoundRequest = (guildId: string, vol: number, tags: string[] = []) =>
    postRequest(`/api/${guildId}/sounds/rnd?${buildQueryString({ tags, vol })}`)

export const playUrlRequest = (guildId: string, url: string, vol: number) =>
    postRequest(`/api/${guildId}/sounds/url?${buildQueryString({ url, vol })}`)

export const updateSoundRequest = (guildId: string, name: string, audioFile: AudioFile) =>
    postRequest(`/api/${guildId}/sounds/${name}`, { body: audioFile })

export const deleteSoundRequest = (guildId: string, name: string) =>
    deleteRequest(`/api/${guildId}/sounds/${name}`)

export const uploadSoundsRequest = (guildId: string, files: FileList) => {
    const formData = new FormData()

    for (let i = 0; i < files.length; i++) {
        const file = files[i]
        formData.append(file.name, file, file.name)
    }

    return fetch(`/api/${guildId}/sounds`, {
        method: 'POST',
        body: formData
    })
}

// Other

export const pingRequest = () => getRequest('api/ping')


const apiRequest = async <T = void>(call: () => Promise<JsonResponse<T>>, opts?: ApiRequestOpts) => {
    const res = await call()
    if (res.ok) {
        return res.json
    } else {
        const error = new Error(res.json?.message || res.statusText)
        if (res.status !== 401) {
            opts?.onError && opts?.onError(error)
        }
        throw error
    }
}

interface ApiRequestOpts {
    onError?: (err: Error) => void
}

const getRequest = <E = void>(url: string, opts?: ApiRequestOpts) => apiRequest(() => fetchJson<E>(url), opts)

interface PostRequestOpts extends ApiRequestOpts {
    body?: object | string
}

const postRequest = <E = void>(url: string, opts?: PostRequestOpts) => apiRequest(() => fetchJson<E>(url, {
    body: typeof opts?.body === 'string' ? opts.body : JSON.stringify(opts?.body),
    headers: typeof opts?.body === 'undefined' ? undefined : { 'content-type': 'application/json' },
    method: 'POST'
}))

interface PutRequestOpts extends ApiRequestOpts {
    body?: object | string
}

const putRequest = <E = void>(url: string, opts?: PutRequestOpts) => apiRequest(() => fetchJson<E>(url, {
    body: typeof opts?.body === 'string' ? opts.body : JSON.stringify(opts?.body),
    headers: typeof opts?.body === 'undefined' ? undefined : { 'content-type': 'application/json' },
    method: 'PUT'
}))

const deleteRequest = <E = void>(url: string, opts?: ApiRequestOpts) => apiRequest(() => fetchJson<E>(url, { method: 'DELETE' }), opts)

