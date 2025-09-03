import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRuntimeConfiguration } from './RuntimeConfigurationProvider.tsx'
import { useKeycloak } from '@react-keycloak/web'
import { Box, CircularProgress } from '@mui/material'
import { DemoService } from './services/DemoService.ts'
import { useDirectOidc } from './DirectOidcProvider.tsx'

const ServiceContext = createContext<DemoService | null>(null)

export const useServices = (): DemoService => {
    const configuration = useContext(ServiceContext)
    if (!configuration) {
        throw new Error('Service not initialized')
    }
    return configuration
}

interface ServiceProviderProps {
    children: React.ReactNode
}

export const ServiceProvider: React.FC<ServiceProviderProps> = ({
    children
}) => {
    const { apiBaseUrl, loginMode } = useRuntimeConfiguration()
    const isKeycloak = loginMode === 'KEYCLOAK'
    const isDirectOidc = loginMode === 'CUSTOM_OIDC'
    const { keycloak, initialized } = isKeycloak
        ? useKeycloak()
        : { keycloak: null, initialized: false }
    const { isAuthenticated, user } = isDirectOidc
        ? useDirectOidc()
        : { isAuthenticated: false, user: null }
    const [services, setServices] = useState<DemoService | null>(null)

    useEffect(() => {
        if (isKeycloak && initialized && keycloak!.token) {
            setServices(new DemoService(apiBaseUrl, keycloak!))
        } else if (isDirectOidc && isAuthenticated) {
            setServices(new DemoService(apiBaseUrl, user!))
        }
    }, [apiBaseUrl, keycloak, initialized, isAuthenticated, user])

    return (
        <ServiceContext.Provider value={services}>
            {services ? children : <Loading></Loading>}
        </ServiceContext.Provider>
    )
}

const Loading = () => {
    return (
        <Box
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            height={'100vh'}
        >
            <CircularProgress />
        </Box>
    )
}
