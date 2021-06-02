export default /* GraphQL */ `
extend type Mutation {
    logout(accessToken: String, refreshToken: String): Boolean
}
`
