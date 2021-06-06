import { SERVER_IP } from '@env'

import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink, fromPromise } from '@apollo/client'
import { getItemAsync } from 'expo-secure-store'
import { refreshAccessToken } from '../services/jwt'
import { rootStore, updateAccessToken } from '../APIs/Root'
import { logout } from '../services'

const generateHeaders = (accessToken: string | null) => {
  if (!accessToken) {
    return {}
  }

  return {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  }
}

const authLink = setContext(async () => {

  const accessToken = await getItemAsync('accessToken')

  return generateHeaders(accessToken)
})

//FIXME clean-up the work-around caused by fromPromise(refreshAccess()).filter when returning null
const refreshAccess = async () => {
  const refreshToken = rootStore.getState().userTokens?.refreshToken

  if (refreshToken) {
    const newAccessToken = await refreshAccessToken(refreshToken)

    if (newAccessToken) {
      await updateAccessToken(newAccessToken)
    }

    return newAccessToken || "null"
  }

  return "null"
}

const errorLink = onError(({ graphQLErrors, operation, forward }) => {

  if (graphQLErrors?.[0]?.extensions?.exception?.name === 'NotAuthenticated') {
    return fromPromise(refreshAccess()).filter(value => Boolean(value)).flatMap(accessToken => {

      //FIXME show some message that the user was logged out due to security reasons (refreshToken expired).
      if (accessToken === "null") {
        logout()
      }

      else {
        operation.setContext(generateHeaders(accessToken))
      }

      return forward(operation)
    })
  }
})

const httpLink = createHttpLink({
    uri: `${SERVER_IP}/graphql`
})
  

export const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([errorLink, authLink, httpLink]),
    defaultOptions: {
      query: {
        errorPolicy: 'all',
        fetchPolicy: 'no-cache'
      },
  
      watchQuery: {
        fetchPolicy: 'no-cache'
      },

      mutate: {
          errorPolicy: 'all'
      },
    }
})
