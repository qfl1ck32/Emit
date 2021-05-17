import rootStore from './store'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import ActionType from './ActionType'

import authServerIP from '../IPs/authServerIP.json'

const signIn = async (username: string, password: string) => {
    const response = await axios.post(`${authServerIP}/signin`, { username, password })

    if (response.data.error)
      return response.data
  
    const accessToken = response.data.message.accessToken
    const refreshToken = response.data.message.refreshToken
  
    await SecureStore.setItemAsync('accessToken', accessToken)
    await SecureStore.setItemAsync('refreshToken', refreshToken)
  
    rootStore.dispatch({
        type: ActionType.SIGN_IN,

        tokens: {
          accessToken,
          refreshToken
        },

        isSetUp: response.data.message.isSetUp
    })
}

export default signIn