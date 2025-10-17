import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRuntimeConfiguration } from './RuntimeConfigurationProvider.tsx'
import { useKeycloak } from '@react-keycloak/web'
import { Box, CircularProgress } from '@mui/material'
import { DocumentService } from './services/DocumentService.ts'
import { useDirectOidc } from './DirectOidcProvider.tsx'

interface Services {
    document: DocumentService
}

const ServiceContext = createContext<Services | null>(null)

export const useServices = (): Services => {
    const services = useContext(ServiceContext)
    if (!services) {
        throw new Error('Services not initialized')
    }
    return services
}

interface ServiceProviderProps {
    children: React.ReactNode
}

export const ServiceProvider: React.FC<ServiceProviderProps> = ({
    children
}) => {
    const { apiBaseUrl, loginMode } = useRuntimeConfiguration()
    const isKeycloak = loginMode === 'KEYCLOAK'
    const isDirectOidc = loginMode === 'OIDC' || loginMode === 'DEV_MODE'
    const { keycloak, initialized } = isKeycloak
        ? useKeycloak()
        : { keycloak: null, initialized: false }
    const { isAuthenticated, user } = isDirectOidc
        ? useDirectOidc()
        : { isAuthenticated: false, user: null }
    const [services, setServices] = useState<Services | null>(null)

    useEffect(() => {
        if (isKeycloak && initialized && keycloak!.token) {
            setServices({
                document: new DocumentService(apiBaseUrl, keycloak!)
            })
        } else if (isDirectOidc && isAuthenticated) {
            setServices({
                document: new DocumentService(apiBaseUrl, user!)
            })
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
