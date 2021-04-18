import dotenv from 'dotenv'
dotenv.config()

import redis from 'redis'
import jwt from 'jsonwebtoken'
import express from 'express'

import { v4 as uuid } from 'uuid'
import bcrypt from 'bcrypt'

import mysqlConnection from './mysqlConnection'

const 
    app = express(),
    port = 8082,
    client = redis.createClient(6379),
    sendQuery = mysqlConnection.getInstance().sendQuery,

    redisAccessTokenExpiration  = 5,
    redisRefreshTokenExpiration = 20,

    accessTokenExpiration = redisAccessTokenExpiration.toString() + 's',
    refreshTokenExpiration = redisRefreshTokenExpiration.toString() + 's'


app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))


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

const generateAccessToken = (user: Object) => {
    return jwt.sign(user, process.env.accessTokenSecret, { expiresIn: accessTokenExpiration })
}

const generateRefreshToken = (user: Object) => {
    return jwt.sign(user, process.env.refreshTokenSecret, { expiresIn: refreshTokenExpiration })
}

const verifyAccessToken = async (req: express.Request, res: express.Response, next: Function) => {

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

const verifyRefreshToken = async (req: express.Request, res: express.Response) => {

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

const logoutToken = async (req: express.Request, res: express.Response) => {

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


app.post('/verifyAccessToken', verifyAccessToken, async (req, res) => {
    return res.sendStatus(200)
})

app.post('/verifyRefreshToken', verifyRefreshToken, async (req, res) => {
    return res.sendStatus(200)
})


// -----------------------------------------------------------

const error = (message: any = {}) => {
    return {
        error: true,
        message
    }
}

const success = (message: any = {}) => {
    return {
        error: false,
        message
    }
}

// --------------------------------------------

const checkUsernameTaken = async (username: string) => {
    return !(await sendQuery(`
        SELECT COUNT(ID) AS count
        FROM users
        WHERE username = ?;`, [username]))[0].count
}

const checkEmailTaken = async (email: string) => {
    return !(await sendQuery(`
        SELECT COUNT(ID) AS count
        FROM users
        WHERE email = ?;`, [email]))[0].count
}



app.post('/signup', async (req, res) => {

    const { username, email, password } = req.body

    if (!checkUsernameTaken(username))
        return res.json(error('The username is already taken.'))

    if (!checkEmailTaken(email))
        return res.json(error('The email is already taken.'))

    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        await sendQuery(`
            INSERT INTO users
            VALUES (UNHEX(REPLACE(?, '-', '')), ?, ?, ?);`, [uuid(), username, email, hashedPassword])
    }

    catch (err) {
        return res.json(error('Something unexpected happened. Please try again.'))
    }

    return res.json(success())
})

app.post('/signin', async (req, res) => {
    const { username, password } = req.body

    const response = await sendQuery(`
        SELECT password
        FROM users
        WHERE username = ?;
    `, [username])

    if (!response.length)
        return res.json(error('Username not existent.'))

    const hashedPassword = response[0].password

    const checkEqualPasswords = await bcrypt.compare(password, hashedPassword)

    if (!checkEqualPasswords)
        return res.json(error('Wrong password.'))

    const userData = {
        username,
        message: 'esti super tare'
    }

    const accessToken = generateAccessToken(userData)
    const refreshToken = generateRefreshToken(userData)

    return res.json(success({
        accessToken,
        refreshToken
    }))

    return res.json(success())
})

app.post('/checkUsernameTaken', async (req, res) => {
    res.json(await checkUsernameTaken(req.body.username))
})

app.post('/checkEmailTaken', async (req, res) => {
    res.json(await checkEmailTaken(req.body.email))
})

app.listen(port, () => {
    console.log(`Listening on port ${ port }.`)
})