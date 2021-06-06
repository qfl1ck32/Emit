export default /* GraphQL */ `
extend type Query {
    refreshAccessToken(refreshToken: String!): String
}
`
