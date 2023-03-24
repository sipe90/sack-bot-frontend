import { ApiError, getUserInfoRequest } from '@/api'
import { useCallback } from 'react'
import { Result } from 'ts-results'
import useNotification from './useNotification'

const useUserApi = () => {
    const { apiErrorNotification } = useNotification()

    const handleErrorResult = useCallback((message: string) => <T>(result: Result<T, ApiError>) =>
        result.mapErr((err) => apiErrorNotification(err, message)), [apiErrorNotification])

    const getUserInfo = useCallback(() =>
        getUserInfoRequest().then(handleErrorResult("Failed to load user info"))
        , [handleErrorResult])


    return {
        getUserInfo,
    }
}

export default useUserApi