import { client, LOGIN } from '../../graphql'

import { setItemAsync } from 'expo-secure-store'
import rootStore from '../../APIs/Root/store'
import { ActionType } from '../../APIs/Root/ActionType'

export const login = async(username: string, password: string) => {
    const { errors, data } = await client.mutate({
        mutation: LOGIN,
        variables: {
            username,
            password
        }
    })

    if (!errors) {
        const accessToken = data.login.accessToken
        const refreshToken = data.login.refreshToken

        await setItemAsync('accessToken', accessToken)
        await setItemAsync('refreshToken', refreshToken)

        rootStore.dispatch({
            type: ActionType.SIGN_IN,

            tokens: {
                accessToken,
                refreshToken
            },

            isSetUp: false
        })

        console.log(refreshToken)
    }

    return { err: errors?.[0].message }
}
