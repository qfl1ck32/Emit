import rootStore from './store'
import axios from 'axios'
import ActionType from './ActionType'

import * as SecureStore from 'expo-secure-store'

import authServerIP from '../IPs/authServerIP.json'

const signOut = async () => {
    const tokens = rootStore.getState().userTokens
  
    try {
      await axios.post(`${authServerIP}/logout`, {}, {
        headers: {
          Authorization: `Bearer ${tokens?.accessToken} ${tokens?.refreshToken}`
        }
      })
    }
  
    catch (err) { }

    await SecureStore.deleteItemAsync('accessToken')
    await SecureStore.deleteItemAsync('refreshToken')
  
    rootStore.dispatch({
      type: ActionType.SIGN_OUT,
      tokens: null
    })
}

export default signOut