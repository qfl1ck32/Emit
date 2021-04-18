import rootStore from './rootStore'
import axios from 'axios'
import ActionType from './ActionType'

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
  
    rootStore.dispatch({
      type: ActionType.SIGN_OUT,
      tokens: null
    })
}

export default signOut