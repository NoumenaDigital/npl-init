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
import { HelloWorld } from '../clients/demo/types.gen'
import { CreateIouDialog } from './CreateIouDialog'
import { RepayIouDialog } from './RepayIouDialog'
import { ConfirmIouPaymentDialog } from './ConfirmIouPaymentDialog'
import { getHelloWorldList } from '../clients/demo/sdk.gen'

interface ViewDialog {
    open: boolean
    iouId: string
}

export const HomePage = () => {
    const [createIouDialogOpen, setCreateIouDialogOpen] =
        useState<boolean>(false)
    const [repayIouDialogOpen, setRepayIouDialogOpen] = useState<ViewDialog>({
        open: false,
        iouId: ''
    })
    const [confirmIouPaymentDialogOpen, setConfirmIouDialogOpen] =
        useState<ViewDialog>({
            open: false,
            iouId: ''
        })

    const { demo } = useServices()
    const { api, withAuthorizationHeader, useStateStream } = demo

    const [iouList, setIouList] = useState<HelloWorld[]>()
    const active = useStateStream(() =>
        getHelloWorldList({
            client: api,
            ...withAuthorizationHeader()
        }).then((it) => setIouList(it.data?.items))
    )

    useEffect(() => {
        if (!createIouDialogOpen && !repayIouDialogOpen.open) {
            getHelloWorldList({
                client: api,
                ...withAuthorizationHeader()
            }).then((it) => setIouList(it.data?.items))
        }
    }, [
        createIouDialogOpen,
        repayIouDialogOpen.open,
        confirmIouPaymentDialogOpen.open,
        active,
        api,
        withAuthorizationHeader
    ])

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
                    Overview
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Manage your Hello World protocols
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
                        {iouList?.length || 0}
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{ color: 'text.secondary', fontWeight: 500 }}
                    >
                        Total Protocols
                    </Typography>
                </Card>

                <Card sx={{ p: 3, textAlign: 'center' }}>
                    <Typography
                        variant="h3"
                        sx={{ color: 'success.main', fontWeight: 700, mb: 1 }}
                    >
                        {iouList?.filter((it) => it['@state'] === 'greeted')
                            .length || 0}
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{ color: 'text.secondary', fontWeight: 500 }}
                    >
                        Greeted Protocols
                    </Typography>
                </Card>

                <Card sx={{ p: 3, textAlign: 'center' }}>
                    <Typography
                        variant="h3"
                        sx={{ color: 'warning.main', fontWeight: 700, mb: 1 }}
                    >
                        {iouList?.filter((it) => it['@state'] === 'greeting')
                            .length || 0}
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{ color: 'text.secondary', fontWeight: 500 }}
                    >
                        Pending Greetings
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
                            Hello World Management
                        </Typography>
                        <Button
                            onClick={() => setCreateIouDialogOpen(true)}
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
                            Create Hello World
                        </Button>
                    </Box>

                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Protocol ID</TableCell>
                                    <TableCell align="center">Status</TableCell>
                                    <TableCell align="center">
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {iouList && iouList.length > 0 ? (
                                    iouList.map((it, index) => (
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
                                            <TableCell align="center">
                                                <Chip
                                                    label={it['@state']}
                                                    size="small"
                                                    color={
                                                        it['@state'] ===
                                                        'greeted'
                                                            ? 'success'
                                                            : it['@state'] ===
                                                                'greeting'
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
                                                {it['@state'] === 'greeting' &&
                                                    it['@actions']?.sayHello && (
                                                        <Button
                                                            size="small"
                                                            variant="contained"
                                                            onClick={() =>
                                                                setRepayIouDialogOpen(
                                                                    {
                                                                        open: true,
                                                                        iouId: it[
                                                                            '@id'
                                                                        ]
                                                                    }
                                                                )
                                                            }
                                                        >
                                                            Say Hello
                                                        </Button>
                                                    )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={3}
                                            align="center"
                                            sx={{ py: 8 }}
                                        >
                                            <Typography
                                                variant="body1"
                                                color="text.secondary"
                                            >
                                                No Hello World protocols found. Create your first
                                                protocol to get started.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
            <CreateIouDialog
                open={createIouDialogOpen}
                onClose={() => {
                    setCreateIouDialogOpen(false)
                }}
            />
            <RepayIouDialog
                open={repayIouDialogOpen.open}
                iouId={repayIouDialogOpen.iouId}
                onClose={() => {
                    setRepayIouDialogOpen({
                        open: false,
                        iouId: ''
                    })
                }}
            />
            <ConfirmIouPaymentDialog
                open={confirmIouPaymentDialogOpen.open}
                iouId={confirmIouPaymentDialogOpen.iouId}
                onClose={() => {
                    setConfirmIouDialogOpen({
                        open: false,
                        iouId: ''
                    })
                }}
            />
        </Container>
    )
}
