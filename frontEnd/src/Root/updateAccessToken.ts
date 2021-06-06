import rootStore from './store'
import { ActionType } from './ActionType'
import { setItemAsync } from 'expo-secure-store'

export const updateAccessToken = async (accessToken: string) => {

    await setItemAsync('accessToken', accessToken)

    return rootStore.dispatch({
        type: ActionType.UPDATE_ACCESS_TOKEN,
        tokens: {
            accessToken
        }
    })

}

export default updateAccessToken