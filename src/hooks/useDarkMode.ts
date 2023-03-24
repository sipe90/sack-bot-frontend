import { useMediaQuery } from '@mui/material'
import { useEffect, useState } from 'react'

const useDarkMode = () => {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
    const lsSetting = localStorage.getItem('darkMode')

    const [darkMode, setDarkMode] = useState(lsSetting === null ? prefersDarkMode : lsSetting === 'true')

    useEffect(() => localStorage.setItem('darkMode', darkMode ? 'true' : 'false'), [darkMode])

    return [darkMode, setDarkMode] as const
}

export default useDarkMode
