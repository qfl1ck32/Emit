export default /* GraphQL */ `
extend type Mutation {
    login(username: String!, password: String!): LoginResult
}

type LoginResult {
    accessToken: String!
    refreshToken: String!
}
`