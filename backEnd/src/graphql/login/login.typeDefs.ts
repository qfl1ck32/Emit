export default /* GraphQL */ `
  extend type Mutation {
    login(username: String!, password: String!): LoginResult
  }

  type LoginResult {
    tokens: Tokens!
    user: User
  }

  type Tokens {
    accessToken: String!
    refreshToken: String!
  }
`;
