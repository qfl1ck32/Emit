import { gql } from '@apollo/client'

export const CHECK_USERNAME_EXISTS = gql`
    query CheckUsernameExists($username: String!) {
        checkUsernameExists(username: $username)
    }
`

export const CHECK_EMAIL_EXISTS = gql`
    query CheckEmailExists($email: String!) {
        checkEmailExists(email: $email)
    }
`
