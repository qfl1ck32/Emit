import dotenv from 'dotenv'
import path from 'path'

dotenv.config({
    path: path.resolve(__dirname, 'env')
})

import express from 'express'

import { v4 as uuid } from 'uuid'
import bcrypt from 'bcrypt'

import mysqlConnection from './MySQLConnection'

import { 
    verifyAccessToken, verifyRefreshToken, logoutToken,
    generateAccessToken, generateRefreshToken
        } from './authHelpers'

const 
    app = express(),
    port = 8081,
    sendQuery = mysqlConnection.getInstance().sendQuery


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

app.listen(port, () => {
    console.log(`Listening on port ${ port }.`)
})