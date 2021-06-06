import { blacklistTokens } from '../../helpers/auth'

//FIXME handle all cases

export default {
    Mutation: {
        logout: async (_: any, data: { accessToken: string | null, refreshToken: string }, _2: any) => {
            const { accessToken, refreshToken } = data

            blacklistTokens(accessToken, refreshToken)
            return true
        }
    }
}
