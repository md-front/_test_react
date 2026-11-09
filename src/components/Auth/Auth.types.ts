export interface AuthProps {
    authError: string,
    closeAuth: () => void,
}

export interface AppProps {
    app: {
        authError: string,
    }
}
