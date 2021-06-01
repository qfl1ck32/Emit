import React from 'react'

import { Root } from './src/screens/Root'
import { Setup } from './src/screens/InitialSetup/Setup'
import { MainTab } from './src/screens/MainTab'

import * as SecureStore from 'expo-secure-store'

import { connect, Provider } from 'react-redux'
import rootStore, { ReducerState, } from './src/APIs/Root/store'

import { ApolloClient, InMemoryCache, ApolloProvider, ApolloLink, HttpLink } from '@apollo/client'
import { SERVER_IP } from '@env'

const httpLink = ApolloLink.from([
  new ApolloLink((operation, forward) => {
    // const token = SecureStore.getItemAsync('accessToken')

    const token = 'missing'

    if (token) {
      operation.setContext({
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    }

    return forward(operation)
  }),

  new HttpLink({
    uri: `${SERVER_IP}/graphql`
  })
])

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: `${SERVER_IP}/graphql`,
  defaultOptions: {
    query: {
      fetchPolicy: 'no-cache'
    }
  }
})

import { ActionType } from './src/APIs/Root/ActionType'

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
    <ApolloProvider client = { client }>
      <Provider store = { rootStore }>
        <RootX  />
      </Provider>
    </ApolloProvider>
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