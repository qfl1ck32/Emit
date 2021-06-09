import { SERVER_IP } from '@env'

import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { createHttpLink, ApolloLink, fromPromise } from '@apollo/client'
import { deleteItemAsync, getItemAsync } from 'expo-secure-store'
import { refreshAccessToken } from '../services/jwt'
import { ActionType, rootStore, updateAccessToken } from '../Root'
// import { logout } from '../services/logout'

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
// should refreshAccessToken be a REST API request? (solve require cycle)
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
      // no reason for sending a mutation, because both tokens are expired, right?
      if (accessToken === "null") {
        deleteItemAsync('accessToken')
        deleteItemAsync('refreshToken')

        rootStore.dispatch({
          type: ActionType.SIGN_OUT,
          tokens: null
        })
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

export const links = ApolloLink.from([errorLink, authLink, httpLink])
