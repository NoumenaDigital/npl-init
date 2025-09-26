import React, { useState } from 'react'
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
import { useMe } from '../UserProvider.tsx'
import { useServices } from '../ServiceProvider.tsx'
import { createDocument } from '../clients/document/sdk.gen'

export const CreateDocumentDialog: React.FC<{
    open: boolean
    onClose: (_: boolean) => void
}> = ({ open, onClose }) => {
    const user = useMe()
    const { document } = useServices()
    const { api, withAuthorizationHeader } = document
    const [content, setContent] = useState<string>('')
    const [approverEmail, setApproverEmail] = useState<string>('')

    const [valid, setValid] = useState(false)

    const create = async () => {
        await createDocument({
            body: {
                content: content,
                ['@parties']: {
                    editor: {
                        claims: {
                            email: [user.email]
                        }
                    },
                    approver: {
                        claims: {
                            email: [approverEmail || user.email]
                        }
                    }
                }
            },
            client: api,
            ...withAuthorizationHeader()
        }).then(() => onClose(true))
    }

    const handleContentChange = (input: string) => {
        setContent(input)
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
                Create New Document
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
                            id="document-content"
                            focused={true}
                            label="Document Content"
                            variant="outlined"
                            value={content}
                            multiline
                            rows={6}
                            placeholder="Enter the content of your document..."
                            onChange={(e) =>
                                handleContentChange(e.target.value)
                            }
                        />
                    </FormControl>
                    <FormControl sx={{ width: '100%' }}>
                        <TextField
                            id="approver-email"
                            label="Approver Email"
                            variant="outlined"
                            value={approverEmail}
                            type={'email'}
                            placeholder={user.email}
                            onChange={(e) => setApproverEmail(e.target.value)}
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
                    onClick={create}
                    disabled={!valid}
                >
                    Create Document
                </Button>
            </DialogActions>
        </Dialog>
    )
}
