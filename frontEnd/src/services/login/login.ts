import { client } from '../../graphql/client'
import { LOGIN } from '../../graphql/mutations'

import { setItemAsync } from 'expo-secure-store'
import rootStore from '../../Root/store'
import { ActionType } from '../../Root/ActionType'

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
    }

    return { err: errors?.[0].message }
}
