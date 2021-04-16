import dotenv from 'dotenv'

import express from 'express'
import mysql from 'mysql'

dotenv.config()

const connection = mysql.createConnection(process.env.DATABASE_URL)

const sendQuery = async (query, parametersToBind) => {
    return await new Promise((resolve, reject) => {
        connection.query(query, parametersToBind, (err, results, fields) => {
            if (err)
                return reject(err)
            
            const answer = results.map(rowDataPacket => {
                return Object.assign({}, rowDataPacket)
            })

            return resolve(answer)
        })
    })
}

const 
    app = express(),
    port = 8080

    
setInterval(() => {
    connection.query('SELECT 1')
}, 5000)


app.listen(port, () => {
    console.log(`Listening on port ${ port }.`)
})