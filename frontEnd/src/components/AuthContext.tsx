import React from 'react'

type SignType = {
    error: boolean,
    message: string
} | void

type ContextType = {
    signIn: (username: string, password: string) => Promise <SignType>,
    signOut: () => Promise <void>,
    signUp: (username: string, email: string, password: string) => Promise <SignType>,

    sendGetRequest: (data: any) => Promise <any>
}

export const AuthContext = React.createContext <ContextType> ({} as ContextType)