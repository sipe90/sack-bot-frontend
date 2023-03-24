import React from 'react'
import { NavLink } from 'react-router-dom'
import {
    Avatar,
    Box,
    Container,
    Divider,
    IconButton,
    Link,
    ListItemAvatar,
    ListItemIcon,
    Menu,
    MenuItem,
    Toolbar,
    Tooltip,
    Typography
} from '@mui/material'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import WbSunnyIcon from '@mui/icons-material/WbSunny'
import NightsStayIcon from '@mui/icons-material/NightsStay'
import useUserState from '@/hooks/useUserState'
import useGuildState from '@/hooks/useGuildState'
import useDarkMode from '@/hooks/useDarkMode'


const Header: React.FC = () => {
    const [darkMode, setDarkMode] = useDarkMode()
    const { userInfo, isAdmin } = useUserState()

    return (<>
        <Toolbar disableGutters>
            <Container sx={{ flexBasis: 0 }}>
                <Avatar
                    alt={userInfo?.name || 'U'}
                    src={userInfo?.avatarUrl || undefined}
                />
            </Container>
            <Container component='nav'>
                {isAdmin &&
                    <>
                        <Link
                            component={NavLink}
                            color='inherit'
                            noWrap
                            variant='h6'
                            underline='hover'
                            sx={{
                                p: 1,
                                flexShrink: 0,
                                '&.active': {
                                    color: 'secondary.main',
                                    textDecoration: 'underline'
                                }
                            }}
                            to='board'
                        >
                            Board
                        </Link>
                        <Link
                            component={NavLink}
                            color='inherit'
                            noWrap
                            variant='h6'
                            underline='hover'
                            sx={{
                                p: 1,
                                flexShrink: 0,
                                '&.active': {
                                    color: 'secondary.main',
                                    textDecoration: 'underline'
                                }
                            }}
                            to='admin'
                        >
                            Admin
                        </Link>
                    </>
                }
            </Container>
            <Container sx={{ flexBasis: 0 }}>
                <Tooltip title='Toggle dark mode'>
                    <IconButton
                        onClick={() => setDarkMode(!darkMode)}
                    >
                        {darkMode ? <NightsStayIcon /> : <WbSunnyIcon />}
                    </IconButton>
                </Tooltip>
            </Container>
            <GuildSelector />
        </Toolbar>
    </>)
}

const GuildSelector: React.FC = () => {
    const { guilds, selectedGuild, setSelectedGuildId } = useGuildState()

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

    const handleClickAvatar = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleSelectGuild = (event: React.MouseEvent<HTMLElement>) => {
        setSelectedGuildId(event.currentTarget.id)
        handleClose()
    }

    return (
        <>
            <Box display='flex' alignItems='center' sx={{
                '& > *': {
                    mr: 1,
                }
            }}>
                <Tooltip title={selectedGuild?.name || ''}>
                    <Avatar
                        alt={selectedGuild?.name || 'G'}
                        src={selectedGuild?.iconUrl || undefined}
                    />
                </Tooltip>
                <IconButton
                    onClick={handleClickAvatar}
                >
                    <MoreVertIcon />
                </IconButton>
            </Box>
            <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {guilds.map(({ id, name, iconUrl }) => (
                    <MenuItem
                        key={id}
                        id={id}
                        onClick={handleSelectGuild}
                        selected={selectedGuild?.id === id}
                    >
                        <ListItemAvatar>
                            <Avatar
                                alt={name}
                                src={iconUrl || undefined}
                                sx={{ width: 32, height: 32 }}
                            />
                        </ListItemAvatar>
                        <Typography variant='inherit'>{name}</Typography>
                    </MenuItem>
                ))}
                <Divider />
                <MenuItem onClick={logOut}>
                    <ListItemIcon>
                        <ExitToAppIcon />
                    </ListItemIcon>
                    <Typography variant='inherit'>Log out</Typography>
                </MenuItem>
            </Menu>
        </>
    )
}

const logOut = async () => {
    const res = await fetch('/logout', { method: 'POST' })
    if (res.redirected) {
        window.location.href = res.url
    }
}

export default Header