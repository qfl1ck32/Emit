import { client } from '../../graphql/client'
import { LOGIN } from '../../graphql/mutations'

import { setItemAsync } from 'expo-secure-store'
import rootStore from '../../Root/store'
import { ActionType } from '../../Root/ActionType'
import * as Google from 'expo-google-app-auth';
import { register } from '../register'

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

/*
export declare type LogInResult = {
    type: 'cancel';
} | {
    type: 'success';
    accessToken: string | null;
    idToken: string | null;
    refreshToken: string | null;
    user: GoogleUser;
};

*/


export const loginWithGoogle = async () => {
    await Google.logInAsync({
      androidClientId: "",
      iosClientId: "",
      scopes: ['profile', 'email'],
    }).then((response: Google.LogInResult) => {
      if (response.type === 'success') {
        const { user: { email, name }, accessToken, refreshToken } = response
        // register(email, email, )
        console.log(response)
      }
    })
    .catch((err: Error) => {
      console.log(err.message)
    })
}
