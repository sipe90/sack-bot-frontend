import { Notification } from '@/types'
import { atom } from 'recoil'

export const notificationState = atom<Notification[]>({
    key: 'notificationState',
    default: []
})
