import React, { useMemo } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import { createTheme, ThemeOptions, ThemeProvider } from '@mui/material/styles'
import { deepmerge } from '@mui/utils'

import NotFound from '@/components/NotFound'
import Login from '@/components/Login'
import MainContent from '@/routes/MainContent'
import useDarkMode from '@/hooks/useDarkMode'
import BoardRoute from '@/routes/BoardRoute'
import AdminRoute from '@/routes/AdminRoute'
import ProtectedRoute from '@/routes/ProtectedRoute'


const baseTheme: ThemeOptions = {
    palette: {
        secondary: {
            200: '#80cbc4',
            800: '#00695c',
            light: '#e0f2f1',
            main: '#009688',
            dark: '#00897b'
        },
        success: {
            200: '#6cc067',
            light: '#edf7ed',
            main: '#6cc067',
            dark: '#64ba5f'
        },
        error: {
            light: '#e48784',
            main: '#d9534f',
            dark: '#d54c48'
        },
        warning: {
            light: '#fdf5ea',
            main: '#f0ad4e',
            dark: '#ec9c3d'
        }
    }
}

const lightTheme: ThemeOptions = {
    palette: {
        mode: 'light',
        background: {
            default: '#e1e1e1',
            paper: '#f5f5f5'
        }
    }
}

const darkTheme: ThemeOptions = {
    palette: {
        mode: 'dark',
        primary: {
            main: '#1f5099'
        },
        background: {
            default: '#1b2635',
            paper: '#233044'
        },
        text: {
            primary: '#dddcd9'
        }
    }
}

const App: React.FC = () => {

    const [darkMode] = useDarkMode()

    const theme = useMemo(
        () => createTheme(deepmerge(baseTheme, darkMode ? darkTheme : lightTheme)),
        [darkMode]
    )

    return (
        <ThemeProvider theme={theme}>
            <Box
                display='flex'
                flexDirection='column'
                margin={0}
                minHeight='100vh'
            >
                <CssBaseline />
                <Routes>
                    <Route path='login' element={<Login />} />
                    <Route element={<ProtectedRoute />}>
                        <Route element={<MainContent />}>
                            <Route index element={<Navigate replace to='board' />} />
                            <Route path='board' element={<BoardRoute />} />
                            <Route path='admin' element={<AdminRoute />} />
                            <Route path='*' element={<NotFound />} />
                        </Route>
                    </Route>
                </Routes>
            </Box>
        </ThemeProvider>
    )
}

export default App