import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'

import rootStore from './rootStore'
import signOut from './signOut'

import authServerIP from '../../assets/authServerIP.json'
import updateAccessToken from './updateAccessToken'

export enum RequestType {
    GET = 0,
    PUT = 1,
    POST = 2,
    DELETE = 4
}

const axiosRequest = (type: RequestType) => {
    switch(type) {
        case RequestType.GET:
            return axios.get
        case RequestType.POST:
            return axios.post
        case RequestType.PUT:
            return axios.put
        case RequestType.DELETE:
            return axios.delete
    }
}

const withAutoResend = async (type: RequestType, url: string, data?: any, config?: AxiosRequestConfig | undefined): Promise <AxiosResponse <any> | void>  => {
    const state = rootStore.getState()

    const accessToken = state.userTokens?.accessToken

    if (!accessToken)
        return signOut()

    if (config)
        config.headers.Authorization = `Bearer ${accessToken}`
    
    else
        config = { headers: {
                Authorization: `Bearer ${accessToken}`
                }}

    try {
        return await (type == RequestType.POST ? axios.post(url, data, config) : axiosRequest(type)(url, config))
    }

    catch (err) {
        const error = err as AxiosError

        switch (error.response?.status) {
            case 401: {
                const refreshToken = state.userTokens?.refreshToken

                try {
                    const response = await axios.post(`${authServerIP}/verifyRefreshToken`, {}, {
                        headers: {
                            Authorization: `Bearer ${refreshToken}`
                        }
                    })

                    await updateAccessToken(response.data.accessToken)
                    return withAutoResend(type, url, data, config)
                }

                catch (err) {
                    return signOut()
                }
            }

            case 403:
                return signOut()
        }
    }
}

export default withAutoResend