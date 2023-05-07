import React, { useCallback, useMemo, useState } from 'react'
import * as R from 'ramda'
import {
    Autocomplete,
    Box,
    Button,
    CardActionArea,
    FormControlLabel,
    FormLabel,
    Unstable_Grid2 as Grid,
    Menu,
    MenuItem,
    Paper,
    Radio,
    RadioGroup,
    Slider,
    TextField,
} from '@mui/material'

import { AudioFile, Dictionary } from '@/types'
import Divider from '@/components/Divider'
import useSoundsState from '@/hooks/useSoundsState'
import VoiceState from '@/components/VoiceState'
type GroupBy = 'alphabetic' | 'tag'

const isSubset = R.curry((xs: unknown[], ys: unknown[]) =>
    R.all(R.includes(R.__, ys), xs))

const filterSounds = (tagFilter: string[]) => (sounds: AudioFile[]) => tagFilter.length ? sounds.filter((sound) => isSubset(tagFilter, sound.tags)) : sounds

const groupByFirstLetter = R.groupBy<AudioFile>(
    R.pipe(
        R.pathOr('', ['name', 0]),
        R.toUpper
    )
)

const groupByTags = (sounds: AudioFile[]) => sounds.reduce<Dictionary<AudioFile[]>>((acc, val) => {
    val.tags.forEach((tag) => {
        acc[tag] = R.append(val, R.propOr([], tag, acc))
    })
    return acc
}, {})

const filterAndGroup = (tagFilter: string[], groupBy: GroupBy, sounds: AudioFile[]) => R.pipe<[AudioFile[]], AudioFile[], Dictionary<AudioFile[]>>(
    filterSounds(tagFilter),
    R.ifElse(
        R.always(R.equals('alphabetic', groupBy)),
        groupByFirstLetter,
        groupByTags
    )
)(sounds)

const getTags = R.pipe<[AudioFile[]], string[], string[], string[]>(
    R.chain<AudioFile, string>(R.prop('tags')),
    R.uniq,
    R.invoker(0, 'sort')
)

const defVolume = 75

const Soundboard: React.FC = () => {
    const { sounds, entrySound, exitSound, updateEntrySound, updateExitSound, playRandomSound, playSound, playUrl } = useSoundsState()

    const [volume, setVolume] = useState<number>(defVolume)
    const [url, setUrl] = useState<string>('')
    const [tagFilter, setTagFilter] = useState<string[]>([])
    const [groupBy, setGroupBy] = useState<GroupBy>('alphabetic')

    const onPlayRandomSound = useCallback(async () => playRandomSound(volume, tagFilter), [playRandomSound, volume, tagFilter])
    const onPlaySound = useCallback(async (sound: string) => playSound(sound, volume), [playSound, volume])
    const onPlayUrl = useCallback(async () => playUrl(url, volume), [playUrl, url, volume])
    const onUpdateEntrySound = useCallback((sound: string) => updateEntrySound(sound), [updateEntrySound])
    const onUpdateExitSound = useCallback((sound: string) => updateExitSound(sound), [updateExitSound])
    const onClearEntrySound = useCallback(() => updateEntrySound(), [updateEntrySound])
    const onClearExitSound = useCallback(() => updateExitSound(), [updateExitSound])

    const tags = useMemo(() => getTags(sounds), [sounds])

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
                <Grid container>
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
                    <Grid xs={12} sm={6}>
                        <FormLabel component='legend'>Volume</FormLabel>
                        <Slider
                            defaultValue={defVolume}
                            min={1}
                            max={100}
                            valueLabelDisplay='auto'
                            onChangeCommitted={(_event, vol) => setVolume(vol as number)}
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
                <Board
                    sounds={sounds}
                    groupBy={groupBy}
                    tagFilter={tagFilter}
                    entrySound={entrySound}
                    exitSound={exitSound}
                    onPlaySound={onPlaySound}
                    onUpdateEntrySound={onUpdateEntrySound}
                    onUpdateExitSound={onUpdateExitSound}
                    onClearEntrySound={onClearEntrySound}
                    onClearExitSound={onClearExitSound}
                />
            </Paper>
        </>
    )
}

interface BoardProps {
    sounds: AudioFile[]
    groupBy: GroupBy
    tagFilter: string[]
    entrySound: string | null
    exitSound: string | null
    onPlaySound: (sound: string) => void
    onUpdateEntrySound: (sound: string) => void
    onUpdateExitSound: (sound: string) => void
    onClearEntrySound: () => void
    onClearExitSound: () => void
}

const Board: React.FC<BoardProps> = (props) => {
    const {
        sounds,
        groupBy,
        tagFilter,
        entrySound,
        exitSound,
        onPlaySound,
        onUpdateEntrySound,
        onUpdateExitSound,
        onClearEntrySound,
        onClearExitSound
    } = props

    const groupedSounds = useMemo(() => filterAndGroup(tagFilter, groupBy, sounds), [sounds, groupBy, tagFilter])
    const keys = useMemo(() => R.keys(groupedSounds).sort(), [groupedSounds])

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const [sound, setSound] = React.useState<null | string>(null)

    const handleContextClick = (sound: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        setAnchorEl(event.currentTarget)
        setSound(sound)
    }

    const handleClose = () => setAnchorEl(null)

    const handleUpdateEntrySound = (sound: string) => {
        handleClose()
        onUpdateEntrySound(sound)
    }

    const handleUpdateExitSound = (sound: string) => {
        handleClose()
        onUpdateExitSound(sound)
    }

    const handleClearEntrySound = () => {
        handleClose()
        onClearEntrySound()
    }

    const handleClearExitSound = () => {
        handleClose()
        onClearExitSound()
    }

    return (
        <>
            {keys.map((key) =>
                <React.Fragment key={key}>
                    <Divider>{key}</Divider>
                    <Grid container>
                        {groupedSounds[key].map(({ name }) =>
                            <Grid key={name} xs={4} sm={3} md={2} >
                                <Box mr={1} mt={1}>
                                    <CardActionArea
                                        onContextMenu={handleContextClick(name)}
                                        sx={{
                                            boxShadow: 2,
                                            color: 'white',
                                            backgroundColor: 'primary.main',
                                            borderRadius: 1,
                                            textAlign: 'center',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            padding: '8px'
                                        }}
                                        onClick={() => onPlaySound(name)}
                                    >
                                        {name}
                                    </CardActionArea>
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                </React.Fragment>
            )}
            <Menu
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorEl={anchorEl}
            >
                <MenuItem onClick={() => sound && handleUpdateEntrySound(sound)}>Set as entry sound</MenuItem>
                <MenuItem onClick={() => sound && handleUpdateExitSound(sound)}>Set as exit sound</MenuItem>
                <MenuItem disabled={!entrySound} onClick={handleClearEntrySound}>Clear entry sound {entrySound ? ` (${entrySound})` : ''}</MenuItem>
                <MenuItem disabled={!exitSound} onClick={handleClearExitSound}>Clear exit sound {exitSound ? ` (${exitSound})` : ''}</MenuItem>
            </Menu>
        </>
    )
}

export default Soundboard