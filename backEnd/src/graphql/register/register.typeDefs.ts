export default /* GraphQL */ `
extend type Mutation {
    register(input: RegisterInput!): String
}

extend type Query {
    checkUsernameExists(username: String!): Boolean
    checkEmailExists(email: String!): Boolean
}

input RegisterInput {
    username: String!
    email: String!
    password: String!
}
`
