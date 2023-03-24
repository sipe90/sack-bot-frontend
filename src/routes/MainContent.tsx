import { AppBar, CircularProgress, Typography } from '@mui/material'
import { Container, Box, BoxProps } from '@mui/system'
import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { styled } from '@mui/system'

import { Header } from '@/components/layout'
import { pingRequest } from '@/api'
import useLoginState from '@/hooks/useLoginState'

const Layout = styled(Box)<BoxProps>(({ theme }) => ({
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(1200)]: {
        width: 1200,
        marginLeft: 'auto',
        marginRight: 'auto',
    }
}))

const MainContent: React.FC = () => {
    const navigate = useNavigate()

    const { loggedIn, loginPending } = useLoginState()

    useEffect(() => {
        if (!loginPending && !loggedIn) {
            navigate('/login')
        }
    }, [loggedIn, loginPending, navigate])

    useEffect(() => {
        setInterval(() => pingRequest(), 5 * 60 * 1000)
    })

    if (!loggedIn && !loginPending) return null

    return (
        <>
            <AppBar position='sticky' color='default' elevation={2}>
                <Container maxWidth='lg' disableGutters>
                    <Header />
                </Container>
            </AppBar>
            <Layout component='main' flex={1}>
                <React.Suspense fallback={
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mt: 4,
                        '& > *': {
                            m: 1,
                        }
                    }}>
                        <CircularProgress />
                        <Typography>
                            Loading...
                        </Typography>
                    </Box>
                }>
                    <Outlet />
                </React.Suspense>
            </Layout>
            <Layout component='footer'>
                <Typography variant='body2' color='textSecondary' align='center' sx={(theme) => ({
                    borderTop: `1px solid ${theme.palette.divider}`,
                    mt: 8,
                    py: 3
                })}>
                    Sackbot {__APP_VERSION__ ? `v${__APP_VERSION__}` : ''}
                </Typography>
            </Layout>
        </>
    )
}

export default MainContent
