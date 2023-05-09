import React, { useCallback, useEffect, useMemo, useState } from 'react'
import * as R from 'ramda'
import {
    Autocomplete,
    Button,
    FormControlLabel,
    FormLabel,
    Unstable_Grid2 as Grid,
    Paper,
    Radio,
    RadioGroup,
    Slider,
    TextField,
} from '@mui/material'
import { useRecoilValue } from 'recoil'

import Divider from '@/components/Divider'
import useSoundsState from '@/hooks/useSoundsState'
import VoiceState from '@/components/board/VoiceState'
import { guildVoiceState } from '@/state/voice'
import useUserState from '@/hooks/useUserState'
import { AudioFile, GroupBy } from '@/types'
import SoundGrid from './SoundGrid'

const MemoedGrid = React.memo(SoundGrid)

const getTags = R.pipe<[AudioFile[]], string[], string[], string[]>(
    R.chain<AudioFile, string>(R.prop('tags')),
    R.uniq,
    R.invoker(0, 'sort')
)

const SoundBoard: React.FC = () => {
    const { sounds, playRandomSound, playUrl, setVolume } = useSoundsState()
    const { isAdmin } = useUserState()
    const { currentVolume } = useRecoilValue(guildVoiceState)

    const volume = currentVolume.value

    const [vol, setVol] = useState<number>(currentVolume.value)
    const [url, setUrl] = useState<string>('')
    const [tagFilter, setTagFilter] = useState<string[]>([])
    const [groupBy, setGroupBy] = useState<GroupBy>('alphabetic')

    const tags = useMemo(() => getTags(sounds), [sounds])

    // Sync remote state
    useEffect(() => {
        setVol(volume)
    }, [volume])

    const onPlayRandomSound = useCallback(async () => playRandomSound(tagFilter), [playRandomSound, tagFilter])
    const onPlayUrl = useCallback(async () => playUrl(url), [playUrl, url])

    const onTagFilterChange = (_event: React.SyntheticEvent<Element, Event>, tags: string[]) => {
        setTagFilter(tags)
    }

    const onUrlFieldChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setUrl(event.target.value)
    }

    const onGroupByChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setGroupBy(event.target.value as GroupBy)
    }

    return (
        <>
            <VoiceState />
            <Paper sx={{ pr: 4, pb: 4, pl: 4, pt: 2 }}>
                <Grid container spacing={4}>
                    <Grid xs={12} sm={6}>
                        <FormLabel component='legend'>Group sounds</FormLabel>
                        <RadioGroup row value={groupBy} onChange={onGroupByChange}>
                            <FormControlLabel
                                value='alphabetic'
                                control={<Radio color='primary' />}
                                label='Alphabetically'
                                labelPlacement='start'
                            />
                            <FormControlLabel
                                value='tag'
                                control={<Radio color='primary' />}
                                label='By Tag'
                                labelPlacement='start'
                            />
                        </RadioGroup>
                    </Grid>
                    <Grid xs={12} sm={6}>
                        {isAdmin &&
                            <>
                                <FormLabel component='legend'>Volume</FormLabel>
                                <Slider
                                    value={vol}
                                    min={1}
                                    max={100}
                                    valueLabelDisplay='auto'
                                    onChange={(_event, v) => setVol(v as number)}
                                    onChangeCommitted={(_event, v) => setVolume(v as number)}
                                />
                            </>
                        }
                    </Grid>
                    <Grid xs={12} sm={6}>
                        <Autocomplete<string, true>
                            multiple
                            size='small'
                            options={tags}
                            value={tagFilter}
                            onChange={onTagFilterChange}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label='Filter by tags'
                                />
                            )}
                        />
                    </Grid>
                    <Grid container xs={12} sm={6} spacing={2} alignItems='flex-end'>
                        <Grid xs={10}>
                            <TextField
                                size='small'
                                value={url}
                                onChange={onUrlFieldChange}
                                fullWidth
                                label='Play from URL'
                            />

                        </Grid>
                        <Grid xs={2}>
                            <Button
                                fullWidth
                                size='medium'
                                variant='contained'
                                color='primary'
                                onClick={onPlayUrl}
                            >
                                Play
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Divider sx={{ my: 4 }} />
                <Grid container justifyContent='center'>
                    <Button
                        variant='contained'
                        color='primary'
                        onClick={() => onPlayRandomSound().catch()}
                    >
                        Random
                    </Button>
                </Grid>
                <MemoedGrid
                    groupBy={groupBy}
                    tagFilter={tagFilter}
                />
            </Paper>
        </>
    )
}

export default SoundBoard