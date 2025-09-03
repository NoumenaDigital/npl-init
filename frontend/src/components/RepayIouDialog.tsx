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
import { getHelloWorldById, helloWorldSayHello } from '../clients/demo/sdk.gen'

export const RepayIouDialog: React.FC<{
    iouId: string
    open: boolean
    onClose: (_: boolean) => void
}> = ({ iouId, open, onClose }) => {
    const { demo } = useServices()
    const { api, withAuthorizationHeader } = demo

    const [helloWorld, setHelloWorld] = useState<HelloWorld>()

    const [valid] = useState(true)

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

    const sayHelloAction = async () => {
        await helloWorldSayHello({
            client: api,
            path: {
                id: iouId
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
                Say Hello to {helloWorld?.['@id']}
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
                        This will trigger the sayHello action for the Hello World protocol.
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
                    onClick={sayHelloAction}
                    disabled={!valid}
                >
                    Say Hello
                </Button>
            </DialogActions>
        </Dialog>
    )
}
