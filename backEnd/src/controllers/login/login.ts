import { RequestHandler } from 'express'
import { UserModel, IUser } from '../../models/User'

import { compare } from 'bcrypt'

import { generateAccessToken, generateRefreshToken } from '../../helpers/auth'

export const login: RequestHandler = async (req, res) => {
    const { username, password } = req.body

    const user = await UserModel.findOne({ username }) as IUser

    if (!user) {
        return res.json({
            error: true,
            message: 'There is no user with the given username.'
        })
    }

    const passwordsAreSame = await compare(password, user.password)

    if (!passwordsAreSame) {
        return res.json({
            error: true,
            message: 'Wrong password.'
        })
    }

    if (user.emailConfirmationURL) {
        return res.json({
            error: true,
            message: 'Your e-mail has not yet been verified. Please check your address at ' + user.email + '.'
        })
    }

    const userData = {
        username: user.username,
        email: user.email
    }

    const accessToken = generateAccessToken(userData)
    const refreshToken = generateRefreshToken(userData)

    return res.json({
        accessToken,
        refreshToken,
        isSetUp: user.isSetUp
    })
}
