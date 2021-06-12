import { gql } from "@apollo/client";

export const ADD_TO_WHITELIST = gql`
  mutation AddToWhitelist($id: ID!) {
    addToWhitelist(id: $id)
  }
`;
