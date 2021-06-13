import { gql } from "@apollo/client";

export const ADD_TO_WHITELIST = gql`
  mutation AddToWhitelist($id: ID!) {
    addToWhitelist(id: $id)
  }
`;

export const REMOVE_FROM_WHITELIST = gql`
  mutation RemoveFromWhitelist($id: ID!) {
    removeFromWhitelist(id: $id)
  }
`;

export const ADD_TO_BLACKLIST = gql`
  mutation AddToBlacklist($id: ID!) {
    addToBlacklist(id: $id)
  }
`;

export const REMOVE_FROM_BLACKLIST = gql`
  mutation RemoveFromBlacklist($id: ID!) {
    removeFromBlacklist(id: $id)
  }
`;
