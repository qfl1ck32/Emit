import dotenv from 'dotenv'

dotenv.config()

import jwt from 'jsonwebtoken'

import { Request } from 'express'

import { RedisConnection } from '../Redis'

interface IUser {
    _id: string,
    username: string,
    email: string
}

const   client = RedisConnection.getInstance().getClient(),
        redisAccessTokenExpiration  = 5,
        redisRefreshTokenExpiration = 8,

        accessTokenExpiration = redisAccessTokenExpiration.toString() + 's',
        refreshTokenExpiration = redisRefreshTokenExpiration.toString() + 's'

export const checkBlacklistToken = async (token: string) => {
    return new Promise((resolve, reject) => {
        client.exists(token, (err, ans) => {
            if (err)
                reject(err)
            else
                resolve(!ans)
        })
    })
}

export const generateAccessToken = (user: Object) => {
    return jwt.sign(user, process.env.accessTokenSecret, { expiresIn: accessTokenExpiration })
}

export const generateRefreshToken = (user: Object) => {
    return jwt.sign(user, process.env.refreshTokenSecret, { expiresIn: refreshTokenExpiration })
}

// doesn't handle all cases

export const blacklistTokens = (accessToken: string, refreshToken: string) => {
    jwt.verify(accessToken, process.env.accessTokenSecret, (err: jwt.VerifyErrors) => {
        if (err && err !instanceof jwt.TokenExpiredError || !err) {
            client.setex(accessToken, redisAccessTokenExpiration, accessToken)
        }
    })

    jwt.verify(refreshToken, process.env.refreshTokenSecret, (err: jwt.VerifyErrors) => {
        if (err && err !instanceof jwt.TokenExpiredError || !err) {
            client.setex(refreshToken, redisRefreshTokenExpiration, refreshToken)
        }
    })
}

export const extractUser = (req: Request) => {

    if (!req.headers['authorization'])
        return null

    const authToken = req.headers['authorization'].split(' ')

    if (!authToken[1])
        return null

    const accessToken = authToken[1]

    let user = null

    jwt.verify(accessToken, process.env.accessTokenSecret, (err: jwt.VerifyErrors, data: IUser) => {
        if (!err) {
            user = {
                _id: data._id,
                username: data.username,
                email: data.email
            }
        }
    })

    return user
}

export const extractUserFromRefresh = async (token: string) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.refreshTokenSecret, (err: jwt.VerifyErrors, user: IUser) => {
            if (err)
                return resolve(null)
            
            return resolve({
                _id: user._id,
                email: user.email,
                username: user.username
            })
        })
    })

}
