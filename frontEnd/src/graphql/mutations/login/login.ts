import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      tokens {
        accessToken
        refreshToken
      }
      user {
        email
        isSetUp
        whitelist
        blacklist
      }
    }
  }
`;
