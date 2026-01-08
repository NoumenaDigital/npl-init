import React, { createContext, useContext, useEffect, useState } from 'react'

type LoginMode = 'KEYCLOAK' | 'OIDC' | 'DEV_MODE'
type DeploymentTarget = 'LOCAL' | 'NOUMENA_CLOUD'

export interface RuntimeConfiguration {
    apiBaseUrl: string
    authUrl: string
    realm: string | undefined
    clientId: string | undefined
    loginMode: LoginMode
    deploymentTarget: DeploymentTarget
}

const RuntimeConfigurationContext = createContext<RuntimeConfiguration | null>(
    null
)

export const useRuntimeConfiguration = (): RuntimeConfiguration => {
    const configuration = useContext(RuntimeConfigurationContext)
    if (!configuration) {
        throw new Error('Configuration not loaded')
    }
    return configuration
}

interface RuntimeConfigurationProviderProps {
    children: React.ReactNode
}

/**
 * Loads runtime configuration from environment variables.
 */
export const loadRuntimeConfiguration = () => {
    const loginModeEnvVar = import.meta.env.VITE_LOGIN_MODE as LoginMode
    const loginMode = loginModeEnvVar || 'OIDC'
    
    const deploymentTargetEnvVar = import.meta.env.VITE_DEPLOYMENT_TARGET as DeploymentTarget
    const deploymentTarget = deploymentTargetEnvVar || 'LOCAL'

    const appSlug = import.meta.env.VITE_NC_APPLICATION_NAME

    if (deploymentTarget === 'NOUMENA_CLOUD' && loginMode === 'DEV_MODE') {
        throw new Error(
            'DEV_MODE login is not supported for NOUMENA_CLOUD deployment target'
        )
    }

    let config: RuntimeConfiguration = {
        apiBaseUrl: import.meta.env["VITE_" + deploymentTarget + "_API_URL"],
        authUrl: import.meta.env["VITE_" + deploymentTarget + "_" + loginMode + "_AUTH_URL"],
        realm: '',
        clientId: '',
        loginMode,
        deploymentTarget
    }

    if (loginMode === 'OIDC' || loginMode === 'KEYCLOAK') {
        config.realm = appSlug
        config.clientId = appSlug
    }

    console.log('Login Mode:', loginMode)
    console.log('Deployment Target:', deploymentTarget)
    console.log('Configuration:', config)

    return config
}

export const RuntimeConfigurationProvider: React.FC<
    RuntimeConfigurationProviderProps
> = ({ children }) => {
    const [runtimeConfig, setRuntimeConfig] =
        useState<RuntimeConfiguration | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadConfig = async () => {
            try {
                const loadedConfig = loadRuntimeConfiguration()
                setRuntimeConfig(loadedConfig)
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
                console.error('Configuration error:', errorMessage)
                setError(errorMessage)
            }
        }
        loadConfig()
    }, [])

    if (error) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                padding: '20px',
                backgroundColor: '#fee',
                color: '#c00',
                fontFamily: 'monospace',
                fontSize: '16px'
            }}>
                <div>
                    <h2>Configuration Error</h2>
                    <p>{error}</p>
                </div>
            </div>
        )
    }

    return (
        <RuntimeConfigurationContext.Provider value={runtimeConfig}>
            {runtimeConfig ? children : <div>&nbsp;</div>}
        </RuntimeConfigurationContext.Provider>
    )
}
