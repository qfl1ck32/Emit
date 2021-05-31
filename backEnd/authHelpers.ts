import dotenv from 'dotenv'

dotenv.config()

import jwt from 'jsonwebtoken'

import express from 'express'

import RedisConnection from './RedisConnection'

const   client = RedisConnection.getInstance().getClient(),
        redisAccessTokenExpiration  = 60,
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

export const logoutToken = async (req: express.Request, res: express.Response) => {

    const authTokens = req.headers['authorization'].split(' ')

    if (authTokens[1] == 'null' || authTokens[2] == 'null')
        return res.sendStatus(403)

    const accessToken = authTokens[1], refreshToken = authTokens[2]

    if (!(accessToken && refreshToken))
        return res.sendStatus(403)

    const validRefreshToken = await checkBlacklistToken(refreshToken), validAccessToken = await checkBlacklistToken(accessToken)

    if (!(validRefreshToken && validAccessToken))
        return res.sendStatus(403)
    
    let done = false

    jwt.verify(accessToken, process.env.accessTokenSecret, (err: jwt.VerifyErrors, user: object) => {
        if (err) {
            done = true
            if (err instanceof jwt.TokenExpiredError)
                return res.sendStatus(401)
            return res.sendStatus(403)
        }
    })

    if (done)
        return

    jwt.verify(refreshToken, process.env.refreshTokenSecret, (err, user) => {
        if (err)
            return res.sendStatus(403)

        client.setex(accessToken, redisAccessTokenExpiration, accessToken)
        client.setex(refreshToken, redisRefreshTokenExpiration, refreshToken)


        // const payLoad = jwt.verify(refreshToken, process.env.refreshTokenSecret, { ignoreExpiration: true })

        // logout(payLoad.id)
    
        return res.sendStatus(200)
    })
}

export const verifyAccessToken = async (req: express.Request, res: express.Response, next: Function) => {
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

export const verifyRefreshToken = async (req: express.Request, res: express.Response) => {

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
                // const payLoad = jwt.verify(refreshToken, process.env.refreshTokenSecret, { ignoreExpiration: true })

                // logout(payLoad.id)
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