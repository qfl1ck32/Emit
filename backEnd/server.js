import express from 'express'

const 
    app = express(),
    port = 8080

app.post('/getHello', (_, res) => {
    res.json({
        'message': 'Hello!'
    })
})

app.listen(port, () => {
    console.log(`Listening on port ${ port }.`)
})