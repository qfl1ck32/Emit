import { gql } from '@apollo/client'

export const GET_HOBBIES = gql`
    query {
        Hobbies {
            title
            activities
        }
    }
`
