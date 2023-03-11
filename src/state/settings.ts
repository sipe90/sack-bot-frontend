import { selector } from 'recoil'

import { Settings } from '@/types'
import { getSettingsRequest } from '@/api'

export const settingsState = selector<Settings>({
    key: 'settings',
    get: () => getSettingsRequest()
})