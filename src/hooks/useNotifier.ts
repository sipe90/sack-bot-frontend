import { useEffect } from 'react'
import { SnackbarKey, useSnackbar } from 'notistack'
import { useRecoilState } from 'recoil'

import { notificationState } from '@/state/snackbar'

let displayed: SnackbarKey[] = []

const useNotifier = () => {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()
    const [notifications, setNotifications] = useRecoilState(notificationState)

    const storeDisplayed = (id: SnackbarKey) => {
        displayed = [...displayed, id]
    }

    const removeDisplayed = (id: SnackbarKey) => {
        displayed = [...displayed.filter(key => id !== key)]
    }

    useEffect(() => {
        notifications.forEach(({ key, message, options = {}, dismissed = false }) => {
            if (dismissed) {
                closeSnackbar(key)
                return
            }

            if (displayed.includes(key)) return

            enqueueSnackbar(message, {
                key,
                ...options,
                onClose: (event, reason, myKey) => {
                    if (options.onClose) {
                        options.onClose(event, reason, myKey)
                    }
                },
                onExited: (_event, myKey) => {
                    setNotifications(notifications.filter((n) => n.key !== key))
                    removeDisplayed(myKey)
                },
            })

            storeDisplayed(key)
        })
    }, [notifications, setNotifications, closeSnackbar, enqueueSnackbar])
}

export default useNotifier