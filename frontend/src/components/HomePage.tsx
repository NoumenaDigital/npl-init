import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useServices } from '../ServiceProvider'
import { Document } from '../clients/document/types.gen'
import { CreateDocumentDialog } from './CreateDocumentDialog'
import { EditDocumentDialog } from './EditDocumentDialog'
import { ApproveDocumentDialog } from './ApproveDocumentDialog'
import { getDocumentList } from '../clients/document/sdk.gen'

interface ViewDialog {
    open: boolean
    documentId: string
}

export const HomePage = () => {
    const [createDocumentDialogOpen, setCreateDocumentDialogOpen] =
        useState<boolean>(false)
    const [editDocumentDialogOpen, setEditDocumentDialogOpen] =
        useState<ViewDialog>({
            open: false,
            documentId: ''
        })
    const [approveDocumentDialogOpen, setApproveDocumentDialogOpen] =
        useState<ViewDialog>({
            open: false,
            documentId: ''
        })

    const { document } = useServices()
    const { api, withAuthorizationHeader, useStateStream } = document

    const [documentList, setDocumentList] = useState<Document[]>()
    const active = useStateStream(() =>
        getDocumentList({
            client: api,
            ...withAuthorizationHeader()
        }).then((it) => setDocumentList(it.data?.items))
    )

    useEffect(() => {
        if (!createDocumentDialogOpen && !editDocumentDialogOpen.open) {
            getDocumentList({
                client: api,
                ...withAuthorizationHeader()
            }).then((it) => setDocumentList(it.data?.items))
        }
    }, [
        createDocumentDialogOpen,
        editDocumentDialogOpen.open,
        approveDocumentDialogOpen.open,
        active,
        api,
        withAuthorizationHeader
    ])

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
                    Document Review Dashboard
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Manage document review and approval workflow
                </Typography>
            </Box>

            <Box
                display="grid"
                gridTemplateColumns="repeat(auto-fit, minmax(350px, 1fr))"
                gap={3}
                sx={{ mb: 4 }}
            >
                <Card sx={{ p: 3, textAlign: 'center' }}>
                    <Typography
                        variant="h3"
                        sx={{ color: 'primary.main', fontWeight: 700, mb: 1 }}
                    >
                        {documentList?.length || 0}
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{ color: 'text.secondary', fontWeight: 500 }}
                    >
                        Total Documents
                    </Typography>
                </Card>

                <Card sx={{ p: 3, textAlign: 'center' }}>
                    <Typography
                        variant="h3"
                        sx={{ color: 'success.main', fontWeight: 700, mb: 1 }}
                    >
                        {documentList?.filter(
                            (it) => it['@state'] === 'approved'
                        ).length || 0}
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{ color: 'text.secondary', fontWeight: 500 }}
                    >
                        Approved Documents
                    </Typography>
                </Card>

                <Card sx={{ p: 3, textAlign: 'center' }}>
                    <Typography
                        variant="h3"
                        sx={{ color: 'warning.main', fontWeight: 700, mb: 1 }}
                    >
                        {documentList?.filter(
                            (it) => it['@state'] === 'drafted'
                        ).length || 0}
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{ color: 'text.secondary', fontWeight: 500 }}
                    >
                        Pending Review
                    </Typography>
                </Card>
            </Box>

            <Card>
                <CardContent sx={{ p: 0 }}>
                    <Box
                        sx={{
                            p: 3,
                            pb: 2,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Document Management
                        </Typography>
                        <Button
                            onClick={() => setCreateDocumentDialogOpen(true)}
                            variant="contained"
                            sx={{
                                background:
                                    'linear-gradient(135deg, #6D4C93 0%, #E91E63 100%)',
                                '&:hover': {
                                    background:
                                        'linear-gradient(135deg, #5D3C83 0%, #D91153 100%)'
                                }
                            }}
                        >
                            Create Document
                        </Button>
                    </Box>

                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Document ID</TableCell>
                                    <TableCell>Content Preview</TableCell>
                                    <TableCell align="center">Status</TableCell>
                                    <TableCell align="center">
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {documentList && documentList.length > 0 ? (
                                    documentList.map((it, index) => (
                                        <TableRow
                                            key={index}
                                            hover
                                            sx={{
                                                '&:last-child td, &:last-child th':
                                                    { border: 0 },
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <TableCell>
                                                <Typography
                                                    variant="body2"
                                                    sx={{ fontWeight: 500 }}
                                                >
                                                    {it['@id']}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        maxWidth: '200px',
                                                        overflow: 'hidden',
                                                        textOverflow:
                                                            'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    {it.content}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={it['@state']}
                                                    size="small"
                                                    color={
                                                        it['@state'] ===
                                                        'approved'
                                                            ? 'success'
                                                            : it['@state'] ===
                                                                'drafted'
                                                              ? 'warning'
                                                              : 'default'
                                                    }
                                                    sx={{
                                                        textTransform:
                                                            'capitalize',
                                                        fontWeight: 500
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        gap: 1,
                                                        justifyContent: 'center'
                                                    }}
                                                >
                                                    {it['@state'] ===
                                                        'drafted' &&
                                                        it['@actions']
                                                            ?.edit && (
                                                            <Button
                                                                size="small"
                                                                variant="outlined"
                                                                onClick={() =>
                                                                    setEditDocumentDialogOpen(
                                                                        {
                                                                            open: true,
                                                                            documentId:
                                                                                it[
                                                                                    '@id'
                                                                                ]
                                                                        }
                                                                    )
                                                                }
                                                            >
                                                                Edit
                                                            </Button>
                                                        )}
                                                    {it['@state'] ===
                                                        'drafted' &&
                                                        it['@actions']
                                                            ?.approve && (
                                                            <Button
                                                                size="small"
                                                                variant="contained"
                                                                color="success"
                                                                onClick={() =>
                                                                    setApproveDocumentDialogOpen(
                                                                        {
                                                                            open: true,
                                                                            documentId:
                                                                                it[
                                                                                    '@id'
                                                                                ]
                                                                        }
                                                                    )
                                                                }
                                                            >
                                                                Approve
                                                            </Button>
                                                        )}
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            align="center"
                                            sx={{ py: 8 }}
                                        >
                                            <Typography
                                                variant="body1"
                                                color="text.secondary"
                                            >
                                                No documents found. Create your
                                                first document to get started.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
            <CreateDocumentDialog
                open={createDocumentDialogOpen}
                onClose={() => {
                    setCreateDocumentDialogOpen(false)
                }}
            />
            <EditDocumentDialog
                open={editDocumentDialogOpen.open}
                documentId={editDocumentDialogOpen.documentId}
                onClose={() => {
                    setEditDocumentDialogOpen({
                        open: false,
                        documentId: ''
                    })
                }}
            />
            <ApproveDocumentDialog
                open={approveDocumentDialogOpen.open}
                documentId={approveDocumentDialogOpen.documentId}
                onClose={() => {
                    setApproveDocumentDialogOpen({
                        open: false,
                        documentId: ''
                    })
                }}
            />
        </Container>
    )
}
