import React, { useMemo, useState } from 'react'
import * as R from 'ramda'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, TextField } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'

import { AudioFile } from '@/types'
import SoundsTable from '@/components/SoundsTable'
import useNotification from '@/hooks/useNotification'
import useSoundsState from '@/hooks/useSoundsState'
import { playSoundRequest } from '@/api'
import useGuildState from '@/hooks/useGuildState'

const getTags = R.pipe<[AudioFile[]], string[], string[], string[]>(
    R.chain<AudioFile, string>(R.prop('tags')),
    R.uniq,
    R.invoker(0, 'sort')
)

const downloadZip = (guildId: string) => downloadFile(`/api/${guildId}/sounds/export`)
const downloadSound = (guildId: string, name: string) => downloadFile(`/api/${guildId}/sounds/${name}/download`)

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

const EditDialog: React.FC<EditDialogProps> = (props) => {
    const { open, audioFile, tags, onCancel, onOk } = props

    const [values, setValues] = useState<EditValues | null>(null)

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
                <Autocomplete<string, true>
                    multiple
                    size='small'
                    options={tags}
                    value={values?.tags || []}
                    onChange={(_event, tags) => values && setValues({ ...values, tags })}
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
    const { sounds, deleteSound, updateSound, uploadSounds } = useSoundsState()
    const { selectedGuildId, guildMembers } = useGuildState()

    const { notification, errorNotification } = useNotification()

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
                            .catch((err) => errorNotification(`Failed to upload files: ${err.message}`))
                    }}
                    onDownloadSounds={() => selectedGuildId && downloadZip(selectedGuildId)}
                    onPlaySound={(audioFile) => playSoundRequest(audioFile.guildId, audioFile.name)
                        .catch((err) => errorNotification(`Failed to play sound: ${err.message}`))}
                    onDownloadSound={(audioFile) => downloadSound(audioFile.guildId, audioFile.name)}
                    onEditSound={onEditAudioFile}
                    onDeleteSound={onDeleteAudioFile}
                />
            </Paper>
        </>
    )
}

export default Admin