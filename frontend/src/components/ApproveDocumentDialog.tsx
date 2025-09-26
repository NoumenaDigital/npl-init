import React, { useEffect, useState } from 'react'
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Typography
} from '@mui/material'
import { useServices } from '../ServiceProvider.tsx'
import { Document } from '../clients/document/types.gen'
import { getDocumentById, documentApprove } from '../clients/document/sdk.gen'

export const ApproveDocumentDialog: React.FC<{
    documentId: string
    open: boolean
    onClose: (_: boolean) => void
}> = ({ documentId, open, onClose }) => {
    const { document } = useServices()
    const { api, withAuthorizationHeader } = document

    const [documentData, setDocumentData] = useState<Document>()
    const valid = true

    useEffect(() => {
        if (documentId && documentId !== '') {
            getDocumentById({
                client: api,
                path: {
                    id: documentId
                },
                ...withAuthorizationHeader()
            }).then((it) => setDocumentData(it.data))
        }
    }, [api, withAuthorizationHeader, documentId])

    const approveAction = async () => {
        await documentApprove({
            client: api,
            path: {
                id: documentId
            },
            ...withAuthorizationHeader()
        }).then(() => onClose(true))
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth={'lg'}>
            <DialogTitle
                variant={'h4'}
                fontWeight={'bold'}
                textAlign={'center'}
            >
                {' '}
                Approve Document
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
                    <Typography variant="h6" color="text.primary">
                        Document ID: {documentData?.['@id']}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Current State: {documentData?.['@state']}
                    </Typography>
                    <Box
                        sx={{
                            border: '1px solid #e0e0e0',
                            borderRadius: 1,
                            p: 2,
                            width: '100%',
                            backgroundColor: '#f5f5f5'
                        }}
                    >
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1 }}
                        >
                            Document Content:
                        </Typography>
                        <Typography variant="body1">
                            {documentData?.content}
                        </Typography>
                    </Box>
                    <Typography
                        variant="body1"
                        color="warning.main"
                        sx={{ textAlign: 'center', mt: 2 }}
                    >
                        Are you sure you want to approve this document? This
                        action cannot be undone.
                    </Typography>
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
                    color={'success'}
                    onClick={approveAction}
                    disabled={!valid}
                >
                    Approve Document
                </Button>
            </DialogActions>
        </Dialog>
    )
}
