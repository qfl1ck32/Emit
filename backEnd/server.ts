import dotenv from 'dotenv'

import express from 'express'

dotenv.config()

const 
    app = express(),
    port = 8080

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

import { verifyAccessToken } from './authHelpers'

const error = (message = {}) => {
    return {
        error: true,
        message
    }
}

const success = (message = {}) => {
    return {
        error: false,
        message
    }
}

app.get('/restrictedAPI', verifyAccessToken, async (req, res) => {
    console.log('hehe intru')
    return res.json(success('Nice!'))
})

app.listen(port, () => {
    console.log(`Listening on port ${ port }.`)
})