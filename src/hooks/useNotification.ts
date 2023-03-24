import { ApiError } from '@/api'
import { OptionsObject, useSnackbar } from 'notistack'
import { useCallback } from 'react'

const buildApiErrorMessage = (error: ApiError, message?: React.ReactNode) =>
    typeof message === 'string' ? `${message}: ${error.message}` : error.message

const useNotification = () => {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()

    const notification = useCallback((message: React.ReactNode, options?: OptionsObject) => enqueueSnackbar(message, options), [enqueueSnackbar])
    const errorNotification = useCallback((message: React.ReactNode, options?: OptionsObject) => enqueueSnackbar(message, { ...options, variant: 'error', }), [enqueueSnackbar])
    const apiErrorNotification = useCallback((error: ApiError, message?: React.ReactNode, options?: OptionsObject) => {
        enqueueSnackbar(buildApiErrorMessage(error, message), { ...options, variant: 'error', })
        if (error.serverStack) {
            enqueueSnackbar(error.serverStack, { ...options, variant: 'error', })
        }
    }, [enqueueSnackbar])


    return {
        notification,
        errorNotification,
        apiErrorNotification,
        closeNotification: closeSnackbar
    }
}

export default useNotification