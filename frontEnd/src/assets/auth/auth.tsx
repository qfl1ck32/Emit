import * as SecureStore from 'expo-secure-store'

import IP from '../authServerIP.json'

import axios, { AxiosError } from 'axios'

const handle401 = async (): Promise <boolean> => {
    const refreshToken = await SecureStore.getItemAsync('refreshToken')

    if (!refreshToken)
        return false

    try {
        const response = await axios.post(`${IP}/verifyRefreshToken`, {}, {
            headers: {
                Authorization: `Bearer ${refreshToken}`
            }
        })

        await SecureStore.setItemAsync('accessToken', response.data.accessToken)
        return true
    }

    catch (err) {
        const error = err as AxiosError // error.response.status == 403?

        await SecureStore.deleteItemAsync('accessToken')
        await SecureStore.deleteItemAsync('refreshToken')
        return false
    }
}

export const checkAuthenticated = async (): Promise <boolean> => {
    const accessToken = await SecureStore.getItemAsync('accessToken')

    if (!accessToken)
        return false

    try {
        await axios.post(`${IP}/verifyAccessToken`, {}, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })

        return true
    }

    catch (err) {
        const error = err as AxiosError
        
        switch (error?.response?.status) {

            case 401:
                return await handle401()


            case 403: {
                await SecureStore.deleteItemAsync('accessToken')
                await SecureStore.deleteItemAsync('refreshToken')
                return false
            }

            default:
                return false
        }
    }
    
}