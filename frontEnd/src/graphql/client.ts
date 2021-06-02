import { SERVER_IP } from '@env'

import { setContext } from '@apollo/client/link/context'
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { getItemAsync } from 'expo-secure-store'

const authLink = setContext(async () => {

    const accessToken = await getItemAsync('accessToken')

    return {
        headers: {
        Authorization: `Bearer ${accessToken}`
        }
    }
})

const httpLink = createHttpLink({
    uri: `${SERVER_IP}/graphql`
})
  
  
export const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
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