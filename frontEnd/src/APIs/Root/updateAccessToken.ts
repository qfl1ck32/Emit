import rootStore from './store'
import ActionType from './ActionType'

import * as SecureStore from 'expo-secure-store'

const updateAccessToken = async (accessToken: string) => {

    await SecureStore.setItemAsync('accessToken', accessToken)

    rootStore.dispatch({
        type: ActionType.UPDATE_ACCESS_TOKEN,
        tokens: {
            accessToken
        }
    })
}

export default updateAccessToken