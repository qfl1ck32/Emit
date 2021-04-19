import rootStore from './rootStore'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import ActionType from './ActionType'

import IP from '../../assets/authServerIP.json'

const signIn = async (username: string, password: string) => {
    const response = await axios.post(`${IP}/signin`, { username, password })
  
    if (response.data.error)
      return response.data
  
    const accessToken = response.data.message.accessToken
    const refreshToken = response.data.message.refreshToken
  
    await SecureStore.setItemAsync('accessToken', accessToken)
    await SecureStore.setItemAsync('refreshToken', refreshToken)
  
    rootStore.dispatch({
        type: ActionType.SIGN_IN,
        tokens: response.data.message
    })
}

export default signIn