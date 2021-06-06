import { gql } from '@apollo/client'

export const SETUP =  gql`
    mutation Setup($input: SetupInput!) {
        setup(input: $input)
    }
`