import { gql } from "@apollo/client";

export const GET_USER = gql`
  query GetUser($id: ID!) {
    getUser(id: $id) {
      username
      image
      hobbies {
        title
      }
    }
  }
`;
