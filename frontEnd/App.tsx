import React from 'react'

import { NavigationContainer } from '@react-navigation/native'

import RootStackScreen from './src/components/RootStackScreen'
import { AuthContext } from './src/components/AuthContext'

import HomeScreen from './src/components/HomeScreen'

import * as SecureStore from 'expo-secure-store'
import IP from './src/assets/authServerIP.json'

import { checkAuthenticated } from './src/assets/auth/auth'

import axios from 'axios'

type ReducerState = {
  isLoading: boolean,
  isSignout: boolean,
  userTokens: null | {
    accessToken: string,
    refreshToken: string
  }
}

enum ActionType {
  SIGN_IN = 0,
  SIGN_UP = 1,
  SIGN_OUT = 2,
  
  RESTORE_TOKEN = 3
}

type ReducerAction = {
  type: ActionType,
  tokens: null | {
    accessToken: string,
    refreshToken: string
  }
}

export default function App() {
  
  const initialLoginState: ReducerState = {
    isLoading: true,
    isSignout: false,
    userTokens: null
  }

  const loginReducer = (prevState: ReducerState, action: ReducerAction): ReducerState => {
      switch(action.type) {
        case ActionType.RESTORE_TOKEN:
          return {
              ...prevState,
              userTokens: action.tokens,
              isLoading: false
          }
        
        case ActionType.SIGN_IN:
          return {
              ...prevState,
              isSignout: false,
              userTokens: action.tokens,
          }

        case ActionType.SIGN_OUT:
          return {
              ...prevState,
              isSignout: true,
              userTokens: null
          }

        default:
          return prevState
      }
  }

  const authContextFunc = () => ({
    signIn: async (username: string, password: string) => {

      const response = await axios.post(`${IP}/signin`, { username, password })

      if (response.data.error)
        return response.data

      const accessToken = response.data.message.accessToken
      const refreshToken = response.data.message.refreshToken

      await SecureStore.setItemAsync('accessToken', accessToken)
      await SecureStore.setItemAsync('refreshToken', refreshToken)

      return dispatch({
          type: ActionType.SIGN_IN,
          tokens: {
            accessToken,
            refreshToken
          }
      })
    },

    signOut: () => dispatch({ type: ActionType.SIGN_OUT, tokens: null }),

    signUp: async (username: string, email: string, password: string) => {

        const response = await axios.post(`${IP}/signup`, { username, email, password })

        if (response.data.error)
          return response.data

        return {
          error: false
        }
    }
  })

  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState)

  React.useEffect(() => {
      const bootstrapAsync = async () => {

        const accessToken = await SecureStore.getItemAsync('accessToken')
        const refreshToken = await SecureStore.getItemAsync('refreshToken')

        return dispatch({
            type: ActionType.RESTORE_TOKEN,
            tokens: !(accessToken && refreshToken && await checkAuthenticated()) ? null : {
              accessToken: accessToken,
              refreshToken: refreshToken
            }
        })
      }

      bootstrapAsync()
  }, [])

  const authContext = React.useMemo(authContextFunc, [])

  console.log(initialLoginState)
  return loginState.isLoading ? null : (
    <AuthContext.Provider value = { authContext }>

      <NavigationContainer>
        {
          loginState.userTokens === null ?
            <RootStackScreen />
          :
            <>
              <HomeScreen />
            </>
        }
      </NavigationContainer>

    </AuthContext.Provider>
  )
}