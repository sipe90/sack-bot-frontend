import React, { useEffect, useState } from 'react'
import { Avatar, Box, Unstable_Grid2 as Grid, Typography, Fade } from '@mui/material'
import VolumeUpSharpIcon from '@mui/icons-material/VolumeUpRounded'
import VolumeOffSharpIcon from '@mui/icons-material/VolumeOffRounded'
import { useRecoilValue } from 'recoil'
import { guildVoiceState } from '@/state/voice'
import { settingsState } from '@/state/settings'


const VoiceState: React.FC = () => {
    const { botAvatarUrl } = useRecoilValue(settingsState)
    const { currentChannel, currentTrack } = useRecoilValue(guildVoiceState)

    const [previousTrack, setPreviousTrack] = useState<string | null>(null)

    useEffect(() => {
        if (currentTrack.name != null) {
            setPreviousTrack(currentTrack.name)
        }
    }, [currentTrack])

    return (
        <Box bgcolor={"background.paper"} paddingX={2} position={"sticky"} top={"64px"} zIndex={1000} borderBottom={1} borderRadius={"0px 0px 2px 2px"}>
            <Grid container height={64} justifyContent={"space-between"}>
                <Grid container spacing={1} justifyContent={"flex-start"} alignItems={"center"}>
                    <Grid>
                        <Avatar
                            alt={"sackbot"}
                            src={botAvatarUrl || undefined}
                            sx={{ width: 32, height: 32 }}
                        />
                    </Grid>
                    <Grid>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                        }}>
                            {currentChannel.name && <VolumeUpSharpIcon fontSize='small' />}
                            {!currentChannel.name && <VolumeOffSharpIcon fontSize='small' />}
                        </Box>
                    </Grid>
                    <Grid>
                        <Fade appear in={currentChannel.name != null}>
                            <Typography textAlign={"center"}>{currentChannel.name}</Typography>
                        </Fade>
                    </Grid>
                </Grid>
                <Grid container justifyContent={"center"} alignItems={"center"}>
                    <Grid>
                        <Fade in={currentTrack.name != null} timeout={{ appear: 500, enter: 300, exit: 2000 }}>
                            <Typography textAlign={"center"} fontWeight={"bold"}>
                                {previousTrack}
                            </Typography>
                        </Fade>
                    </Grid>
                </Grid>
                <Grid container justifyContent={"center"} alignItems={"center"}>
                    <Fade in={currentTrack.name != null} timeout={{ appear: 500, enter: 300, exit: 2000 }}>
                        <Grid container spacing={1} justifyContent={"center"} alignItems={"center"}>
                            <Grid>
                                <Avatar
                                    alt={currentTrack.initiatorName || undefined}
                                    src={currentTrack.initiatorAvatar || undefined}
                                    sx={{ width: 32, height: 32 }}
                                />
                            </Grid>
                            <Grid>
                                <Typography textAlign={"center"}>{currentTrack.initiatorName}</Typography>
                            </Grid>
                        </Grid>
                    </Fade>
                </Grid>
            </Grid>
        </Box>
    )
}

export default VoiceState
