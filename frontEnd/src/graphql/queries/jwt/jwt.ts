import { gql } from '@apollo/client'

export const REFRESH_ACCESS_TOKEN = gql`
    query RefreshAccessToken($refreshToken: String!) {
        refreshAccessToken(refreshToken: $refreshToken)
    }
`
