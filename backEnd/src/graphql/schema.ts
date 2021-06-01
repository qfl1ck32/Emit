import { makeExecutableSchema } from 'graphql-tools'
import { merge } from 'lodash'

import { extract } from './extract'

const [typeDefs, resolvers] = extract()

const Query = /* GraphQL */ `
    type Query {
        _empty: String
    }
`

export const schema = makeExecutableSchema({
    typeDefs: [Query, ...typeDefs],
    resolvers: merge(resolvers)
})
