import { checkBlacklistToken, extractUserFromRefresh, generateAccessToken } from "../../helpers/auth"

export default {
    Query: {
        refreshAccessToken: async (_: any, data: { refreshToken: string }, _3: any) => {
            const { refreshToken } = data

            const validRefreshToken = await checkBlacklistToken(refreshToken)

            // blacklisted.
            if (!validRefreshToken) {
                return null
            }

            const user = await extractUserFromRefresh(refreshToken)

            // invalid / expired
            if (!user) {
                return null
            }

            const accessToken = generateAccessToken(user)

            return accessToken
        }
    }
}
