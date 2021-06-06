import { config } from 'dotenv'
import { resolve } from 'path'

import express from 'express'

import { extractUser } from './helpers/auth'
import { confirmEmail } from './controllers'
import { Database } from './Database'

import { ApolloServer } from 'apollo-server-express'
import { schema } from './graphql/schema'


config({
    path: resolve(__dirname, 'env')
})

const app = express()
const port = 8081
const connection = Database.getInstance().connection()

const apolloServer = new ApolloServer({
    schema,
    context: ({ req }) => {
        console.log('Primesc cerere, req.headers:')
        console.log(req.headers)
        const user = extractUser(req)

        return { user }
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

app.get('/confirmEmail', confirmEmail)

app.listen(port, async () => {
    console.log(`Listening on port ${ port }.`)
})
