import rootStore from './rootStore'
import ActionType from './ActionType'

import * as SecureStore from 'expo-secure-store'

const updateTokens = async (accessToken: string, refreshToken: string) => {

    if (accessToken)
        await SecureStore.setItemAsync('accessToken', accessToken)

    if (refreshToken)
        await SecureStore.setItemAsync('refreshToken', refreshToken)

    rootStore.dispatch({
        type: ActionType.UPDATE_TOKENS,
        tokens: {
            accessToken,
            refreshToken
        }
    })
}

export default updateTokens