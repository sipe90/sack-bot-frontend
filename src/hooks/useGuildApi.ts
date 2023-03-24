import { ApiError, getGuildMembersRequest, getGuildsRequest } from '@/api'
import { useCallback } from 'react'
import { Result } from 'ts-results'
import useNotification from './useNotification'

const useGuildApi = () => {
    const { apiErrorNotification } = useNotification()

    const handleErrorResult = useCallback((message: string) => <T>(result: Result<T, ApiError>) =>
        result.mapErr((err) => apiErrorNotification(err, message)), [apiErrorNotification])

    const getGuilds = useCallback(() =>
        getGuildsRequest().then(handleErrorResult("Failed to load guilds"))
        , [handleErrorResult])

    const getGuildMembers = useCallback((guildId: string) =>
        getGuildMembersRequest(guildId).then(handleErrorResult("Failed to load guild members"))
        , [handleErrorResult])

    return {
        getGuilds,
        getGuildMembers,
    }
}

export default useGuildApi