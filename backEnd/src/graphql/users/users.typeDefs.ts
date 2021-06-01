export default /* GraphQL */ `
extend type Query {
    Users: [User]
}

type User {
    id: String!
    username: String!
    email: String!
    password: String!
}
`