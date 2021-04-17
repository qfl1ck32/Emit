import dotenv from 'dotenv'

import express from 'express'
import mysql from 'mysql'
import { v4 as uuid } from 'uuid'
import bcrypt from 'bcrypt'

dotenv.config()

const connection = mysql.createConnection(process.env.DATABASE_URL)

const sendQuery = async (query, parametersToBind) => {
    return await new Promise((resolve, reject) => {
        connection.query(query, parametersToBind, (err, results, fields) => {
            if (err)
                return reject(err)

            return resolve(results)
        })
    })
}

const 
    app = express(),
    port = 8080

    
setInterval(() => {
    connection.query('SELECT 1')
}, 5000)


app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

const error = message => {
    return {
        error: true,
        message
    }
}

const success = message => {
    return {
        error: false,
        message
    }
}

const checkUsernameTaken = async username => {
    return !(await sendQuery(`
        SELECT COUNT(ID) AS count
        FROM users
        WHERE username = ?;`, [username]))[0].count
}

const checkEmailTaken = async email => {
    return !(await sendQuery(`
        SELECT COUNT(ID) AS count
        FROM users
        WHERE email = ?;`, [email]))[0].count
}

app.post('/signup', async (req, res) => {

    const { username, email, password, confirmPassword } = req.body

    if (!checkUsernameTaken(username))
        return res.json(error('The username is already taken.'))

    if (!checkEmailTaken(email))
        return res.json(error('The email is already taken.'))

    if (password != confirmPassword)
        return res.json(error('The passwords do not match.'))


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

app.post('/checkUsernameTaken', async (req, res) => {
    res.json(await checkUsernameTaken(req.body.username))
})

app.post('/checkEmailTaken', async (req, res) => {
    res.json(await checkEmailTaken(req.body.email))
})

app.listen(port, () => {
    console.log(`Listening on port ${ port }.`)
})