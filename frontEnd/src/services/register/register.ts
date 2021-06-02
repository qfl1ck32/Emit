import { client, REGISTER, CHECK_EMAIL_EXISTS, CHECK_USERNAME_EXISTS } from '../../graphql'

export const register = async (username: string, email: string, password: string) => {
    return await client.mutate({
        mutation: REGISTER,
        variables: {
            input: {
                username,
                email,
                password
            }
        }
    })
}

export const checkUsernameExists = async (username: string) => {
    return client.query({
        query: CHECK_USERNAME_EXISTS,
        variables: {
            username
        }
    })
    .then(response => response.data.checkUsernameExists as boolean)
}

export const checkEmailExists = async (email: string) => {
    return client.query({
        query: CHECK_EMAIL_EXISTS,
        variables: {
            email
        }
    })
    .then(response => response.data.checkEmailExists as boolean)
}
