import React from 'react'
import {
    Avatar,
    Button,
    IconButton,
    ListItemAvatar,
    Menu,
    MenuItem,
    Stack,
    Toolbar,
    Tooltip,
    Typography
} from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import SettingsIcon from '@mui/icons-material/Settings'
import WbSunnyIcon from '@mui/icons-material/WbSunny'
import NightsStayIcon from '@mui/icons-material/NightsStay'
import useUserState from '@/hooks/useUserState'
import useGuildState from '@/hooks/useGuildState'
import useDarkMode from '@/hooks/useDarkMode'
import { useNavigate } from 'react-router-dom'
import { settingsState } from '@/state/settings'
import { useRecoilValue } from 'recoil'


const Header: React.FC = () => {
    const navigate = useNavigate()
    const [darkMode, setDarkMode] = useDarkMode()

    const { userInfo, isAdmin } = useUserState()
    const { selectedGuild } = useGuildState()
    const { botAvatarUrl } = useRecoilValue(settingsState)

    return (
        <Toolbar disableGutters variant='regular' sx={{
            justifyContent: 'space-between', px: 2, '@media all': {
                minHeight: 64,
            },
        }}>
            <Stack direction='row' spacing={2} alignItems='center'>
                <IconButton
                    onClick={() => navigate('/board')}
                >
                    <Avatar
                        alt={'Sackbot'}
                        src={botAvatarUrl || undefined}
                    />
                </IconButton>
                <GuildSelector />
            </Stack>
            <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ display: { xs: 'none', sm: 'block' } }}
            >
                {selectedGuild?.name}
            </Typography>
            <Stack direction='row' spacing={1} alignItems='center'>
                {isAdmin &&
                    <Tooltip title='Admin panel'>
                        <IconButton
                            onClick={() => navigate('/admin')}
                            size='medium'
                        >
                            <SettingsIcon />
                        </IconButton>
                    </Tooltip>
                }
                <Tooltip title='Toggle dark mode'>
                    <IconButton
                        size='medium'
                        onClick={() => setDarkMode(!darkMode)}
                    >
                        {darkMode ? <NightsStayIcon /> : <WbSunnyIcon />}
                    </IconButton>
                </Tooltip>
                <Tooltip title='Log out'>
                    <IconButton
                        onClick={logOut}
                        size='medium'
                    >
                        <LogoutIcon />
                    </IconButton>
                </Tooltip>
                <Avatar
                    alt={userInfo?.name || 'U'}
                    src={userInfo?.avatarUrl || undefined}
                />
            </Stack>
        </Toolbar>
    )
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
            {guilds.length > 1 &&
                <Tooltip title='Select guild'>
                    <Button
                        variant='text'
                        color='secondary'
                        onClick={handleClickAvatar}
                        endIcon={<ExpandMoreIcon color='secondary' />}
                    >
                        <Avatar
                            alt={selectedGuild?.name || 'G'}
                            src={selectedGuild?.iconUrl || undefined}
                        />
                    </Button>
                </Tooltip>
            }
            {guilds.length === 1 &&
                <Avatar
                    alt={selectedGuild?.name || 'G'}
                    src={selectedGuild?.iconUrl || undefined}
                />
            }
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