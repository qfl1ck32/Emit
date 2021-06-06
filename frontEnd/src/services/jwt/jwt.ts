import { client } from '../../graphql/client'
import { REFRESH_ACCESS_TOKEN } from '../../graphql/queries'

export const refreshAccessToken = async (refreshToken: string | null) => {
    if (!refreshToken) {
        return null
    }

    const { data } = await client.query({
        query: REFRESH_ACCESS_TOKEN,
        variables: { refreshToken }
    })

    return data.refreshAccessToken as string | null
}
