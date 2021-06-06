import { getItemAsync, deleteItemAsync } from 'expo-secure-store'
import rootStore from '../../APIs/Root/store'
import { client, LOGOUT } from '../../graphql'

import { ActionType } from '../../APIs/Root/ActionType'


export const logout = async () => {
    const accessToken = await getItemAsync('accessToken')
    const refreshToken = await getItemAsync('refreshToken')

    await client.mutate({
        mutation: LOGOUT,
        variables: {
            accessToken,
            refreshToken
        }
    })

    await deleteItemAsync('accessToken')
    await deleteItemAsync('refreshToken')
  
    rootStore.dispatch({
      type: ActionType.SIGN_OUT,
      tokens: null
    })
}
