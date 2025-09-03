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
import { createHelloWorld } from '../clients/demo/sdk.gen'

export const CreateIouDialog: React.FC<{
    open: boolean
    onClose: (_: boolean) => void
}> = ({ open, onClose }) => {
    const user = useMe()
    const { demo } = useServices()
    const { api, withAuthorizationHeader } = demo
    const [innovator, setInnovator] = useState<string>('')

    const [valid, setValid] = useState(false)

    const create = async () => {
        await createHelloWorld({
            body: {
                ['@parties']: {
                    innovator: {
                        entity: {
                            email: [innovator || user.email]
                        },
                        access: {}
                    }
                }
            },
            client: api,
            ...withAuthorizationHeader()
        }).then(() => onClose(true))
    }

    const handleInnovatorChange = (input: string) => {
        setInnovator(input)
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
                Create new Hello World
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
                    <FormControl sx={{ m: 1, width: '50%' }}>
                        <TextField
                            id="outlined-basic"
                            focused={true}
                            label={`Innovator Email`}
                            variant="outlined"
                            value={innovator}
                            type={'email'}
                            placeholder={user.email}
                            onChange={(e) =>
                                handleInnovatorChange(e.target.value)
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
                    onClick={create}
                    disabled={!valid}
                >
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    )
}
