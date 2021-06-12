export default /* GraphQL */ `
  extend type Query {
    getUserImage(id: ID!): String!
    getMyImage: String!
    getAllUsers: [User]
  }

  extend type Mutation {
    addToWhitelist(id: ID!): Boolean!
    addToBlacklist(id: ID!): Boolean!
    removeFromWhitelist(id: ID!): Boolean!
    removeFromBlacklist(id: ID!): Boolean!
  }

  type User {
    _id: ID!
    username: String
    email: String
    isSetUp: Boolean
    image: String
    whitelist: [ID]
    blacklist: [ID]
  }
`;
