import React, { useEffect, useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import * as R from 'ramda'
import { Button, Divider, Select } from 'antd'

import { useDispatch, useSelector } from '@/util'
import { fetchSounds, playSound, playRandomSound } from '@/actions/sounds'
import { IAudioFile } from '@/types'

const SoundGrid = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
`

const Sound = styled.div`
    margin: 5px;
    flex: 0 0 0;
`
const isSubset = R.curry((xs: any[], ys: any[]) =>
	R.all(R.contains(R.__, ys), xs))

const filterAndgroup = R.pipe(
    (sounds: IAudioFile[], tagFilter: string[]) => tagFilter.length ? sounds.filter((sound) => isSubset(tagFilter, sound.tags)) : sounds,
    R.groupBy<IAudioFile>(
        R.pipe(
            R.pathOr('', ['name', 0]),
            R.toUpper
        )
    )
)

const getTags = R.pipe<IAudioFile[], string[], string[], string[]>(
    R.chain<IAudioFile, string>(R.prop('tags')),
    R.uniq,
    R.invoker(0, 'sort')
)

const Soundboard: React.FC = () => {

    const { 
        selectedGuild, 
        sounds, 
        playingSound 
    } = useSelector((state) => ({
        selectedGuild: state.user.selectedGuild,
        sounds: state.sounds.sounds,
        playingSound: state.sounds.playingSound
    }))

    const dispatch = useDispatch()

    const [tagFilter, setTagFilter] = useState<string[]>([])

    const onPlayRandomSound = useCallback(() => selectedGuild && dispatch(playRandomSound(selectedGuild, tagFilter)), [selectedGuild, tagFilter])

    useEffect(() => {
        selectedGuild && dispatch(fetchSounds(selectedGuild))
    }, [selectedGuild])

    const groupedSounds = useMemo(() => filterAndgroup(sounds, tagFilter), [sounds, tagFilter])
    const letters = useMemo(() => R.keys(groupedSounds).sort(), [groupedSounds])
    const tags = useMemo(() => getTags(sounds), [sounds])

    return (
        <>
            <div style={{ display: 'flex' }}>
                <div style={{ flexGrow: 1 }}>
                <Select
                    style={{ width: '100%' }}
                    mode='multiple'
                    allowClear
                    placeholder='Filter by tags'
                    value={tagFilter}
                    onChange={setTagFilter}
                >
                    {tags.map((tag) => <Select.Option key={tag} value={tag}>{tag}</Select.Option>)}
                </Select>
                </div>
                <Button
                    block
                    style={{ marginLeft: 8, width: 120 }}
                    disabled={playingSound}
                    type="primary"
                    onClick={onPlayRandomSound}>
                        <div style={{ overflow: "hidden", textOverflow: "ellipsis"}}>Random</div>
                </Button>
            </div>
            {letters.map((letter) => 
                <div key={letter}>
                    <Divider>{letter}</Divider>
                    <SoundGrid>
                        {groupedSounds[letter].map((sound) => 
                            <Sound key={sound.name}>
                                <Button
                                    block
                                    style={{ width: 120 }}
                                    disabled={playingSound}
                                    onClick={() => selectedGuild && dispatch(playSound(selectedGuild, sound.name))}>
                                        <div style={{ overflow: "hidden", textOverflow: "ellipsis"}}>{sound.name}</div>
                                </Button>
                            </Sound>)}
                    </SoundGrid>
                </div>
            )}
        </>
    )
}

export default Soundboard