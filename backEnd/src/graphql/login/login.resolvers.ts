import { UserModel, IUser } from '../../models/User'
import { compare } from 'bcrypt'
import { generateAccessToken, generateRefreshToken } from '../../helpers/auth'

import { UserNotExists, WrongPassword, EmailNotConfirmed } from './errors'


export default {
    Mutation: {
        login: async (_: any, data: { username: string, password: string }, _2: any) => {
            const { username, password } = data

            const user = await UserModel.findOne({ username }) as IUser

            if (!user) {
                throw new UserNotExists()
            }

            const passwordsAreSame = await compare(password, user.password)

            if (!passwordsAreSame) {
                throw new WrongPassword()
            }

            if (user.emailConfirmationURL) {
                throw new (EmailNotConfirmed(user.email))
            }

            const userData = {
                _id: user._id,
                username: user.username,
                email: user.email
            }

            const accessToken = generateAccessToken(userData)
            const refreshToken = generateRefreshToken(userData)

            return {
                accessToken,
                refreshToken
            }
        }
    }
}
