import dotenv from 'dotenv'
import path from 'path'

import express from 'express'

dotenv.config({
    path: path.resolve(__dirname, 'env')
})

const 
    app = express(),
    port = 8082

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
    return res.json(success('Nice!'))
})

app.listen(port, () => {
    console.log(`Listening on port ${ port }.`)
})