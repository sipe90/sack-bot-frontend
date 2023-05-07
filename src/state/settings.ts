import { atom, selector } from 'recoil'

import { Settings } from '@/types'
import { getSettingsRequest } from '@/api'

export const settingsState = selector<Settings>({
    key: 'settings',
    get: () => getSettingsRequest().then((result) => result.unwrap())
})

export const darkModeState = atom<boolean | null>({
    key: 'darkMode',
    default: null
})
