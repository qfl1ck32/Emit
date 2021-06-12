export default /* GraphQL */ `
  extend type Query {
    hobbiesFind: [Hobby]
  }

  type Hobby {
    _id: ID!
    category: String!
    hobbies: [HobbyActivity]!
  }

  type HobbyActivity {
    _id: ID!
    title: String!
  }
`;
