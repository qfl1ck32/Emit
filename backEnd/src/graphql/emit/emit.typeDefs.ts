export default /* GraphQL */ `
  extend type Mutation {
    emit(users: [ID!]!, message: String!): Boolean!
  }
`;
