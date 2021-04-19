import rootStore from './rootStore'
import axios from 'axios'
import ActionType from './ActionType'

import * as SecureStore from 'expo-secure-store'

import IP from '../../assets/authServerIP.json'

const signOut = async () => {
    const tokens = rootStore.getState().userTokens
  
    try {
      await axios.post(`${IP}/logout`, {}, {
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