import React, { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Avatar, Box, Button, Grid, Paper, Typography } from '@mui/material'

import useNotification from '@/hooks/useNotification'

const sackbotImg = '/img/Sackbot_V3.jpg'
const sackbotImg_alt = '/img/Sackbot_V9001.png'
const sackbotAvatar = '/img/Sackbot_V3_cropped.jpg'

const errorMessages: { [key: string]: string } = {
    'access_denied': 'Login failed because you are not a member of any SackBot enabled Discord guild.'
}

const backgroundImg = (Math.random() * 100) > 5 ? sackbotImg : sackbotImg_alt

const Login: React.FC = () => {
    const { notification, errorNotification } = useNotification()

    const [searchParams] = useSearchParams()

    useEffect(() => {
        if (searchParams.has('logout')) {
            notification('Logout successful.')
        }

        const errorParam = searchParams.get('error')

        if (errorParam !== null) {
            if (errorParam in errorMessages) {
                errorNotification(errorMessages[errorParam])
            } else {
                errorNotification('An error occurred while logging in. Please try again later.')
            }
        }
    }, [errorNotification, notification, searchParams])

    return (
        <Grid component='main' container sx={{ height: '100vh' }}>
            <Grid item xs={false} sm={4} md={7} sx={(theme) => ({
                backgroundImage: `url(${backgroundImg})`,
                backgroundRepeat: 'no-repeat',
                backgroundColor:
                    theme.palette.mode === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
                backgroundSize: 'cover',
                backgroundPosition: 'top',
            })} />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <Box sx={{
                    mx: 8,
                    my: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                    <Avatar src={sackbotAvatar} sx={{ m: 1 }} />
                    <Typography component='h1' variant='h5'>
                        Welcome to SackBot!
                    </Typography>
                    <Typography component='h2' variant='body2'>
                        Please log in via Discord to use SackBot.
                    </Typography>
                    <Button
                        fullWidth
                        variant='contained'
                        color='primary'
                        href='/oauth2/authorization/discord'
                        startIcon={<img src='/img/discord.svg' />}
                        sx={{ mt: 3, mr: 0, mb: 2 }}
                    >
                        Sign In
                    </Button>
                </Box>
            </Grid>
        </Grid>
    )
}

export default Login
