import { config } from 'dotenv'
import { resolve } from 'path'

import express from 'express'

import { extractUser } from './helpers/auth'
import { confirmEmail } from './controllers'
import { Database } from './Database'

import { ApolloServer } from 'apollo-server-express'
import { schema } from './graphql/schema'
import { addMock } from './services/Hobby'


config({
    path: resolve(__dirname, 'env')
})

const app = express()
const port = 8081
const connection = Database.getInstance().connection()

const apolloServer = new ApolloServer({
    schema,
    context: ({ req }) => {
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

//FIXME too much?
app.use(express.json({
    limit: '10MB'
}))

app.use(express.urlencoded({
    extended: true,
    limit: '10MB'
}))

app.get('/confirmEmail', confirmEmail)

app.listen(port, async () => {
    console.log(`Listening on port ${ port }.`)
    // addMock()
})
