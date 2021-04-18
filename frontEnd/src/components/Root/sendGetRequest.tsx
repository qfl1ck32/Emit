import rootStore from './rootStore'
import axios from 'axios'

import signOut from './signOut'
import { checkAuthenticated } from '../../assets/auth/auth'

import IP from '../../assets/serverIP.json'

const sendGetRequest = async (data: any) => {
    if (!await checkAuthenticated())
      return signOut()
  
    let response: object
  
    if (!rootStore.getState().userTokens)
      return -1
  
    const accessToken = rootStore.getState().userTokens?.accessToken
  
    try {
      response = (await axios.get(`${IP}/restrictedAPI`, {
        headers: {
          Authorization: `Bearer ` + accessToken
        }
      })).data
    }
  
    catch (err) {
      return 0
    }
  
    return response
}

export default sendGetRequest