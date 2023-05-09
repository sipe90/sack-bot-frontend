import { AppBar, CircularProgress, Typography } from '@mui/material'
import { Container, Box, BoxProps, styled } from '@mui/system'
import React from 'react'
import { Outlet } from 'react-router-dom'

import { Header } from '@/components/layout'
import useEvents from '@/hooks/useEvents'

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
    useEvents()

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
