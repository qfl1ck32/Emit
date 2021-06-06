export default /* GraphQL */ `
extend type Mutation {
    setup(input: SetupInput!): Boolean
}

input SetupInput {
    name: String!
    hobbies: [String]!
    image: String
}
`