import rootStore from './store'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import { ActionType } from './ActionType'

import { SERVER_IP } from '@env'

interface IResponse {
  error?: boolean,
  message?: string,
  accessToken: string,
  refreshToken: string,
  isSetUp: boolean
}

export const login = async (username: string, password: string) => {
  const response = await axios.post(`${SERVER_IP}/login`, { username, password })

  const data = response.data as IResponse

  if (data.error)
    return data

  const accessToken = data.accessToken
  const refreshToken = data.refreshToken

  console.log(accessToken)

  await SecureStore.setItemAsync('accessToken', accessToken)
  await SecureStore.setItemAsync('refreshToken', refreshToken)

  rootStore.dispatch({
      type: ActionType.SIGN_IN,

      tokens: {
        accessToken,
        refreshToken
      },

      isSetUp: data.isSetUp
  })
}

export default login