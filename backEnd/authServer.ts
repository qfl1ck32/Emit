import dotenv from 'dotenv'
import path from 'path'

dotenv.config({
    path: path.resolve(__dirname, 'env')
})

import express from 'express'

import { v4 as uuid } from 'uuid'
import bcrypt from 'bcrypt'

import randomstring from 'randomstring'

import mysqlConnection from './MySQLConnection'

import emailHandler from './EmailHandler'

import { 
    verifyAccessToken, verifyRefreshToken, logoutToken,
    generateAccessToken, generateRefreshToken
        } from './authHelpers'

const 
    app = express(),
    port = 8081,
    sendQuery = mysqlConnection.getInstance().sendQuery,
    sendMail = emailHandler.getInstance().sendMail,

    IP = `http://192.168.100.34:${port}`


app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))


app.post('/verifyAccessToken', verifyAccessToken, async (req, res) => {
    return res.sendStatus(200)
})

app.post('/verifyRefreshToken', verifyRefreshToken, async (req, res) => {
    return res.sendStatus(200)
})

app.post('/logout', logoutToken, async (req, res) => {
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
        const userUUID = uuid()
        const verificationURL = randomstring.generate({
            length: 128,
            charset: 'alphabetic'
        })

        await sendQuery(`
            INSERT INTO users
            VALUES (UNHEX(REPLACE(?, '-', '')), ?, ?, ?);`, [userUUID, username, email, hashedPassword])

        await sendQuery(`
            INSERT INTO email_not_verified
            VALUES (UNHEX(REPLACE(?, '-', '')), ?);`, [userUUID, verificationURL])

        //
        const emailResponse = await sendMail(email, 'Emit - Email confirmation', `
        URL: ${IP}/verifyEmail?url=${verificationURL}`)
    }

    catch (err) {
        return res.json(error('Something unexpected happened. Please try again.'))
    }

    return res.json(success())
})

app.get('/verifyEmail', async (req, res) => {
    const URL = req.query.url

    const response = await sendQuery(`
        SELECT HEX(ID) AS ID
        FROM email_not_verified
        WHERE URL = ?`, [URL])

    if (!response.length) {
        //
        return res.sendStatus(403)
    }

    const remove = await sendQuery(`
        DELETE
        FROM email_not_verified
        WHERE ID = UNHEX(?);`, [response[0].ID])

    //
    return res.sendStatus(200)
})

app.post('/signin', async (req, res) => {
    const { username, password } = req.body

    const response = await sendQuery(`
        SELECT HEX(ID) as ID, password
        FROM users
        WHERE username = ?;
    `, [username])

    if (!response.length)
        return res.json(error('Username not existent.'))

    const emailVerification = await sendQuery(`
        SELECT COUNT(ID) as isNotVerified
        FROM email_not_verified
        WHERE ID = UNHEX(?)`, [response[0].ID])

    if (emailVerification[0].isNotVerified)
        return res.json(error('Your e-mail has not yet been verified. Please check your inbox.'))

    const hashedPassword = response[0].password

    const checkEqualPasswords = await bcrypt.compare(password, hashedPassword)

    if (!checkEqualPasswords)
        return res.json(error('Wrong password.'))

    const userData = {
        username
    }

    const accessToken = generateAccessToken(userData)
    const refreshToken = generateRefreshToken(userData)

    return res.json(success({
        accessToken,
        refreshToken
    }))
})

app.post('/checkUsernameTaken', async (req, res) => {
    res.json(await checkUsernameTaken(req.body.username))
})

app.post('/checkEmailTaken', async (req, res) => {
    res.json(await checkEmailTaken(req.body.email))
})

app.listen(port, async () => {
    console.log(`Listening on port ${ port }.`)
})
