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
import { HelloWorld } from '../clients/demo/types.gen'
import { getHelloWorldById } from '../clients/demo/sdk.gen'

export const ConfirmIouPaymentDialog: React.FC<{
    iouId: string
    open: boolean
    onClose: (_: boolean) => void
}> = ({ iouId, open, onClose }) => {
    const { demo } = useServices()
    const { api, withAuthorizationHeader } = demo

    const [helloWorld, setHelloWorld] = useState<HelloWorld>()
    const valid = true

    useEffect(() => {
        if (iouId && iouId !== '') {
            getHelloWorldById({
                client: api,
                path: {
                    id: iouId
                },
                ...withAuthorizationHeader()
            }).then((it) => setHelloWorld(it.data))
        }
    }, [api, withAuthorizationHeader, iouId])

    const closeAction = async () => {
        onClose(true)
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth={'lg'}>
            <DialogTitle
                variant={'h4'}
                fontWeight={'bold'}
                textAlign={'center'}
            >
                {' '}
                Hello World Protocol Details
            </DialogTitle>
            <DialogContent>
                <Divider></Divider>
                <br />
                <Box
                    display={'flex'}
                    flexDirection={'column'}
                    alignItems={'center'}
                >
                    <br />
                    <Typography variant="body1" color="text.secondary">
                        Protocol ID: {helloWorld?.['@id']}
                    </Typography>
                    <br />
                    <Typography variant="body1" color="text.secondary">
                        State: {helloWorld?.['@state']}
                    </Typography>
                    <br />
                    <Typography variant="body1" color="text.secondary">
                        Available Actions: {helloWorld?.['@actions']?.sayHello ? 'Say Hello' : 'None'}
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
                    onClick={closeAction}
                    disabled={!valid}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    )
}
