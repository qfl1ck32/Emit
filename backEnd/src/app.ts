import { config } from 'dotenv'
import { resolve } from 'path'
import { readFileSync } from 'fs'

import express from 'express'

import { verifyAccessToken, verifyRefreshToken, logoutToken, extractUser } from './helpers/auth'
import { login, signup, checkEmailTaken, checkUsernameTaken, confirmEmail } from './controllers'
import { Database } from './Database'

import { ApolloServer } from 'apollo-server-express'

config({
    path: resolve(__dirname, 'env')
})

const 
    app = express(),
    port = 8081,
    connection = Database.getInstance().connection()

import { schema } from './graphql/schema'

const apolloServer = new ApolloServer({
    schema,
    context: ({ req }) => {
        
        const user = extractUser(req)

        return {
            user
        }
    }
})

apolloServer.applyMiddleware({
    app,
    path: '/graphql'
})


connection.once('open', () => {
    console.log('Connected to MongoDB.')
})

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

app.use('/verifyAccessToken', verifyAccessToken)
app.use('/verifyRefreshToken', verifyRefreshToken)
app.use('/logout', logoutToken)

app.post('/login', login)
app.post('/signup', signup)

app.post('/checkEmailTaken', checkEmailTaken)
app.post('/checkUsernameTaken', checkUsernameTaken)

app.get('/confirmEmail', confirmEmail)

app.listen(port, async () => {
    console.log(`Listening on port ${ port }.`)
})
