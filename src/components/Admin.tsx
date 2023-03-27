import React, { useMemo, useState } from 'react'
import * as R from 'ramda'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, TextField } from '@mui/material'
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete'

import { AudioFile } from '@/types'
import SoundsTable from '@/components/SoundsTable'
import useNotification from '@/hooks/useNotification'
import useSoundsState from '@/hooks/useSoundsState'
import useGuildState from '@/hooks/useGuildState'

const getTags = R.pipe<[AudioFile[]], string[], string[], string[]>(
    R.chain<AudioFile, string>(R.prop('tags')),
    R.uniq,
    R.invoker(0, 'sort')
)

const downloadZip = (guildId: string) => downloadFile(`/api/${guildId}/sounds/export`)
const downloadSound = ({ guildId, name }: AudioFile) => downloadFile(`/api/${guildId}/sounds/${name}/download`)

const downloadFile = (url: string) => {
    const a = document.createElement('a')
    a.href = url
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
}

interface DeleteDialogProps {
    open: boolean
    audioFile: AudioFile | null
    onCancel: () => void
    onOk: () => void
}

const DeleteDialog: React.FC<DeleteDialogProps> = (props) => {
    const { open, audioFile, onCancel, onOk } = props
    return (
        <Dialog
            open={open}
        >
            <DialogTitle>{`Delete ${audioFile?.name}`}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {`Are you sure you want to delete sound '${audioFile?.name}'?`}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant='outlined' onClick={onCancel} color='secondary'>
                    Cancel
                </Button>
                <Button variant='contained' onClick={onOk} color='warning' autoFocus>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    )
}

interface EditDialogProps {
    open: boolean
    audioFile: AudioFile | null
    tags: string[]
    onCancel: () => void
    onOk: (values: EditValues) => void
}

type EditValues = Pick<AudioFile, 'name' | 'tags'>
interface TagOption {
    title: string
    inputValue: string
}

const filter = createFilterOptions<TagOption>()

const EditDialog: React.FC<EditDialogProps> = (props) => {
    const { open, audioFile, tags, onCancel, onOk } = props

    const [values, setValues] = useState<EditValues | null>(null)

    const tagOptions: TagOption[] = useMemo(() => tags.map((t) => ({ title: t, inputValue: t })), [tags])

    return (
        <Dialog
            fullWidth
            maxWidth='sm'
            open={open}
            TransitionProps={{
                onEnter: () => {
                    audioFile && setValues({ name: audioFile.name, tags: audioFile.tags })
                },
                onExited: () => {
                    setValues(null)
                }
            }}
        >
            <DialogTitle>{`Edit sound '${audioFile?.name}'`}</DialogTitle>
            <DialogContent>
                <TextField
                    size='small'
                    label='Name'
                    error={!values?.name.length}
                    value={values?.name || ''}
                    onChange={(event) => values && setValues({ ...values, name: event.target.value })}
                    variant='outlined'
                    margin='normal'
                />
                <Autocomplete<TagOption, true, false, true>
                    multiple
                    freeSolo
                    size='small'
                    options={tagOptions}
                    filterOptions={(options, params) => {
                        const { inputValue } = params

                        const filtered = filter(options, params)
                        const isExisting = options.some((option) => inputValue === option.inputValue)

                        if (inputValue !== '' && !isExisting) {
                            filtered.push({
                                inputValue,
                                title: `Add "${inputValue}"`,
                            })
                        }

                        return filtered
                    }}
                    value={values?.tags || []}
                    onChange={(_event, tagOptions) => {
                        const tags = tagOptions.map((t) => (typeof t === 'string') ? t : t.inputValue)
                        values && setValues({ ...values, tags })
                    }}
                    getOptionLabel={(option) => {
                        if (typeof option === 'string') {
                            return option
                        }
                        if (option.inputValue) {
                            return option.inputValue
                        }
                        return option.title
                    }}
                    renderOption={(props, option) => <li {...props}>{option.title}</li>}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label='Tags'
                            variant='outlined'
                        />
                    )}
                />
            </DialogContent>
            <DialogActions>
                <Button variant='outlined' onClick={onCancel} color='secondary'>
                    Cancel
                </Button>
                <Button variant='contained' onClick={() => values && onOk(values)} color='primary' autoFocus>
                    Update
                </Button>
            </DialogActions>
        </Dialog>)
}

const Admin: React.FC = () => {
    const { sounds, deleteSound, updateSound, uploadSounds, playSound } = useSoundsState()
    const { selectedGuildId, guildMembers } = useGuildState()

    const { notification } = useNotification()

    const [deleteModalVisible, setDeleteModalVisible] = useState(false)
    const [editModalVisible, setEditModalVisible] = useState(false)
    const [selectedAudioFile, setSelectedAudioFile] = useState<AudioFile | null>(null)

    const onEditAudioFile = (audioFile: AudioFile) => {
        setSelectedAudioFile(audioFile)
        setEditModalVisible(true)
    }

    const onDeleteAudioFile = (audioFile: AudioFile) => {
        setSelectedAudioFile(audioFile)
        setDeleteModalVisible(true)
    }

    const membersById = R.indexBy(R.prop('id'), guildMembers || [])
    const tags = useMemo(() => getTags(sounds), [sounds])

    return (
        <>
            <DeleteDialog
                open={deleteModalVisible}
                audioFile={selectedAudioFile}
                onCancel={() => setDeleteModalVisible(false)}
                onOk={() => {
                    selectedAudioFile && deleteSound(selectedAudioFile.name)
                        .then(() => setDeleteModalVisible(false))
                }}
            />
            <EditDialog
                open={editModalVisible}
                audioFile={selectedAudioFile}
                tags={tags}
                onCancel={() => setEditModalVisible(false)}
                onOk={({ name, tags }) => {
                    if (!selectedAudioFile) {
                        return
                    }
                    const updated = { ...selectedAudioFile, name, tags }
                    updateSound(updated)
                        .then(() => setEditModalVisible(false))
                }}
            />
            <Paper>
                <SoundsTable
                    rows={sounds}
                    members={membersById}
                    onUploadSounds={(files) => {
                        uploadSounds(files)
                            .then(() => notification(`Successfully uploaded ${files.length} sounds`))
                    }}
                    onDownloadSounds={() => selectedGuildId && downloadZip(selectedGuildId)}
                    onPlaySound={(audioFile) => playSound(audioFile.name)}
                    onDownloadSound={(audioFile) => downloadSound(audioFile)}
                    onEditSound={onEditAudioFile}
                    onDeleteSound={onDeleteAudioFile}
                />
            </Paper>
        </>
    )
}

export default Admin