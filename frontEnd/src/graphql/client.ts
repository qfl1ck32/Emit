import { ApolloClient, InMemoryCache } from '@apollo/client'
import { links } from './links'

export const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: links,
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
