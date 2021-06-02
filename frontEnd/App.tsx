import React from 'react'

import { Root } from './src/screens/Root'
import { Setup } from './src/screens/InitialSetup/Setup'
import { MainTab } from './src/screens/MainTab'

import * as SecureStore from 'expo-secure-store'

import { connect, Provider } from 'react-redux'
import rootStore, { ReducerState } from './src/APIs/Root/store'

import { ApolloProvider } from '@apollo/client'

import { ActionType } from './src/APIs/Root/ActionType'
import { checkAuthenticated } from './src/APIs/Root/checkAuthenticated'

import { client } from './src/graphql/client'

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
      <ApolloProvider client = { client }>
        <RootX  />
      </ApolloProvider>
    </Provider>
  )
}

const RootNavigation = (props: ReducerState) => {

  if (props.isLoading) {
    return null
  }
  
  if (props.userTokens === null) {
    return <Root />
  }

  if (props.isSetUp === false) {
    return <Setup />
  }
  
  return (
    props.userTokens === null ?
      <Root />
    : 
      <MainTab />
  )
}

const RootX = connect(state => state)(RootNavigation)

export default App
