import { gql } from '@apollo/client'

export const LOGOUT = gql`
mutation Logout($accessToken: String, $refreshToken: String) {
    logout(accessToken: $accessToken, refreshToken: $refreshToken)
}
`
