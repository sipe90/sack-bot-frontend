import React, { useMemo } from 'react'
import * as R from 'ramda'
import {
    Box,
    CardActionArea,
    Unstable_Grid2 as Grid,
    Menu,
    MenuItem,
} from '@mui/material'

import { AudioFile, Dictionary, GroupBy } from '@/types'
import Divider from '@/components/Divider'
import useSoundsState from '@/hooks/useSoundsState'

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

interface SoundGridProps {
    groupBy: GroupBy
    tagFilter: string[]
}

const SoundGrid: React.FC<SoundGridProps> = ({ groupBy, tagFilter }) => {

    const {
        sounds,
        entrySound,
        exitSound,
        playSound,
        updateEntrySound,
        updateExitSound,
    } = useSoundsState()

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
        updateEntrySound(sound)
    }

    const handleUpdateExitSound = (sound: string) => {
        handleClose()
        updateExitSound(sound)
    }

    const handleClearEntrySound = () => {
        handleClose()
        updateEntrySound()
    }

    const handleClearExitSound = () => {
        handleClose()
        updateExitSound()
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
                                        onClick={() => playSound(name)}
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

export default SoundGrid
