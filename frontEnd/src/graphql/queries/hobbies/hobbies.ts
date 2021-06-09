import { gql } from '@apollo/client'

export const GET_HOBBIES = gql`
    query {
        hobbiesFind {
            category
            hobbies {
                _id
                title
            }
        }
    }
`
