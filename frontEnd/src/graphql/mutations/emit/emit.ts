import { gql } from "@apollo/client";

export const EMIT = gql`
  mutation Emit($users: [ID!]!, $message: String!) {
    emit(users: $users, message: $message)
  }
`;
