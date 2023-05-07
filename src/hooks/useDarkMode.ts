import { darkModeState } from '@/state/settings'
import { useMediaQuery } from '@mui/material'
import { useEffect } from 'react'
import { useRecoilState } from 'recoil'

const useDarkMode = () => {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
    const lsSetting = localStorage.getItem('darkMode')

    const [darkMode, setDarkMode] = useRecoilState(darkModeState)

    useEffect(() => {
        if (darkMode === null) {
            setDarkMode(lsSetting === null ? prefersDarkMode : lsSetting === 'true')
        }
    })

    useEffect(() => localStorage.setItem('darkMode', darkMode ? 'true' : 'false'), [darkMode])

    return [darkMode, setDarkMode] as const
}

export default useDarkMode
