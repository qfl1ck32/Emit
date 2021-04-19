import React from 'react'

import { NavigationContainer } from '@react-navigation/native'

import RootStackScreen from './src/components/RootStackScreen'
import HomeScreen from './src/components/HomeScreen'

import * as SecureStore from 'expo-secure-store'

import { connect, Provider } from 'react-redux'

import rootStore from './src/APIs/Root/store'

import ActionType from './src/APIs/Root/ActionType'

import { checkAuthenticated } from './src/APIs/Root/checkAuthenticated'

const App = () => {

  React.useEffect(() => {
    const bootstrapAsync = async () => {

      await checkAuthenticated()

      const accessToken = await SecureStore.getItemAsync('accessToken')
      const refreshToken = await SecureStore.getItemAsync('refreshToken')

      return rootStore.dispatch({
          type: ActionType.RESTORE_TOKENS,
          tokens: !(accessToken && refreshToken) ? null : {
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

const RootNavigation = (props: any) => {

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