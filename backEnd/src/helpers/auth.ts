import dotenv from 'dotenv'

dotenv.config()

import jwt from 'jsonwebtoken'

import { Request, Response, NextFunction} from 'express'

import { RedisConnection } from '../Redis'

const   client = RedisConnection.getInstance().getClient(),
        redisAccessTokenExpiration  = 600,
        redisRefreshTokenExpiration = 3600,

        accessTokenExpiration = redisAccessTokenExpiration.toString() + 's',
        refreshTokenExpiration = redisRefreshTokenExpiration.toString() + 's'

const checkBlacklistToken = async (token: string) => {
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

    jwt.verify(accessToken, process.env.accessTokenSecret, (err: jwt.VerifyErrors, data: { _id: string, username: string, email: string }) => {
        if (!err)
            user = {
                _id: data._id,
                username: data.username,
                email: data.email
            }
    })

    return user
}

// adapt to graphql

export const verifyAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers['authorization'])
        return res.sendStatus(403)
    
    const authTokens = req.headers['authorization'].split(' ')

    if (authTokens[1] == 'null')
        return res.sendStatus(403)

    const accessToken = authTokens[1]

    if (!accessToken)
        return res.sendStatus(403)

    const validAccessToken = await checkBlacklistToken(accessToken)

    if (!validAccessToken)
        return res.sendStatus(403)

    jwt.verify(accessToken, process.env.accessTokenSecret, (err: jwt.VerifyErrors, user: object) => {
        if (err) {
            if (err instanceof jwt.TokenExpiredError)
                return res.sendStatus(401)
            return res.sendStatus(403)
        }

        delete user['iat']
        delete user['exp']

        if (next)
            return next()

        return res.json({
            user: user
        })
    })
}

export const verifyRefreshToken = async (req: Request, res: Response) => {

    const authTokens = req.headers['authorization'].split(' ')

    if (authTokens[1] == 'null')
        return res.sendStatus(403)

    const refreshToken = authTokens[1]

    if (!refreshToken)
        return res.sendStatus(403)

    const validRefreshToken = await checkBlacklistToken(refreshToken)

    if (!validRefreshToken)
        return res.sendStatus(403)

    jwt.verify(refreshToken, process.env.refreshTokenSecret, (err, user) => {
        if (err) {
            if (err instanceof jwt.TokenExpiredError) {
                // nothing?
            }

            return res.sendStatus(403)  
        }

        delete user['iat']
        delete user['exp']
        
        const accessToken = generateAccessToken(user)

        const userInfo = jwt.verify(accessToken, process.env.accessTokenSecret)

        delete userInfo['iat']
        delete userInfo['exp']

        return res.status(200).json({
            user: userInfo,
            accessToken: accessToken
        })
    })
}
