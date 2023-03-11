import { getUserInfoRequest } from '@/api'
import { UserInfo } from '@/types'
import { atom, selector } from 'recoil'

export const userState = atom<UserInfo>({
    key: 'user',
    default: selector({
        key: 'userStateLoader',
        get: () => getUserInfoRequest()
    })
})
