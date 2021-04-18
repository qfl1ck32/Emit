import React from 'react'

type SignType = {
    error: boolean,
    message: string
} | void

type ContextType = {
    signIn: (username: string, password: string) => Promise <SignType>,
    signOut: () => void,
    signUp: (username: string, email: string, password: string) => Promise <SignType>
}

export const AuthContext = React.createContext <ContextType> ({} as ContextType)