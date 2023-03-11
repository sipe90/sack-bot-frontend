import { OptionsObject } from 'notistack'
import { useRecoilState } from 'recoil'

import { notificationState } from '@/state/snackbar'

const useNotification = () => {
    const [notifications, setNotifications] = useRecoilState(notificationState)

    return {
        notification: (message: React.ReactNode, options?: OptionsObject) => setNotifications(notifications.concat(notification(message, options))),
        errorNotification: (message: React.ReactNode, options?: OptionsObject) => setNotifications(notifications.concat(notification(message, { ...options, variant: 'error' })))
    }
}

const notification = (message: React.ReactNode, options?: OptionsObject) => ({
    message,
    options,
    key: options?.key || new Date().getTime() + Math.random(),
})

export default useNotification