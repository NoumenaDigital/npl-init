import React, { useEffect, useState } from 'react'
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    TextField
} from '@mui/material'
import { useServices } from '../ServiceProvider.tsx'
import { Document } from '../clients/document/types.gen'
import { getDocumentById, documentEdit } from '../clients/document/sdk.gen'

export const EditDocumentDialog: React.FC<{
    documentId: string
    open: boolean
    onClose: (_: boolean) => void
}> = ({ documentId, open, onClose }) => {
    const { document } = useServices()
    const { api, withAuthorizationHeader } = document

    const [documentData, setDocumentData] = useState<Document>()
    const [newContent, setNewContent] = useState<string>('')
    const [valid, setValid] = useState(false)

    useEffect(() => {
        if (documentId && documentId !== '') {
            getDocumentById({
                client: api,
                path: {
                    id: documentId
                },
                ...withAuthorizationHeader()
            }).then((it) => {
                setDocumentData(it.data)
                setNewContent(it.data?.content || '')
                setValid((it.data?.content || '').length > 0)
            })
        }
    }, [api, withAuthorizationHeader, documentId])

    const editAction = async () => {
        await documentEdit({
            client: api,
            path: {
                id: documentId
            },
            body: {
                newContent: newContent
            },
            ...withAuthorizationHeader()
        }).then(() => onClose(true))
    }

    const handleContentChange = (input: string) => {
        setNewContent(input)
        setValid(input.length > 0)
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth={'lg'}>
            <DialogTitle
                variant={'h4'}
                fontWeight={'bold'}
                textAlign={'center'}
            >
                {' '}
                Edit Document {documentData?.['@id']}
            </DialogTitle>
            <DialogContent>
                <Divider></Divider>
                <br />
                <Box
                    display={'flex'}
                    flexDirection={'column'}
                    alignItems={'center'}
                    gap={2}
                >
                    <FormControl sx={{ width: '100%' }}>
                        <TextField
                            id="edit-document-content"
                            focused={true}
                            label="Document Content"
                            variant="outlined"
                            value={newContent}
                            multiline
                            rows={8}
                            placeholder="Enter the new content for your document..."
                            onChange={(e) =>
                                handleContentChange(e.target.value)
                            }
                        />
                    </FormControl>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button
                    variant={'contained'}
                    color={'error'}
                    onClick={() => onClose(false)}
                >
                    Cancel
                </Button>
                <Button
                    variant={'contained'}
                    onClick={editAction}
                    disabled={!valid}
                >
                    Save Changes
                </Button>
            </DialogActions>
        </Dialog>
    )
}
