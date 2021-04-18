import React from 'react'

import { NavigationContainer } from '@react-navigation/native'

import RootStackScreen from './src/components/RootStackScreen'
import HomeScreen from './src/components/HomeScreen'

import * as SecureStore from 'expo-secure-store'

import { connect, Provider } from 'react-redux'

import rootStore from './src/components/Root/rootStore'

import ActionType from './src/components/Root/ActionType'
import { checkAuthenticated } from './src/assets/auth/auth'

const App = () => {

  React.useEffect(() => {
    const bootstrapAsync = async () => {

      const accessToken = await SecureStore.getItemAsync('accessToken')
      const refreshToken = await SecureStore.getItemAsync('refreshToken')

      return rootStore.dispatch({
          type: ActionType.RESTORE_TOKEN,
          tokens: !(accessToken && refreshToken && await checkAuthenticated()) ? null : {
            accessToken,
            refreshToken
          }
      })
    }

    bootstrapAsync()
}, [])

  return (
    <Provider store = { rootStore }>
      <Root />
    </Provider>
  )
}

const RootNavigation = props => {
  return props.isLoading ? null : (
    <NavigationContainer>
      {
        props.userTokens === null ?
          <RootStackScreen />
        : <HomeScreen />
      }
    </NavigationContainer>
  )
}

const Root = connect(state => state)(RootNavigation)

export default App