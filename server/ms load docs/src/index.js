import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import docsRoutes from './routes/docs.js'
import http from 'http'
import { Server } from 'socket.io'
import { createClient } from 'redis';
import { log } from 'console'

dotenv.config({ path: './config.env' })

export const redisClient = createClient();
(async () => {
    redisClient.on('error', (error) => console.error('Error: ' + error))
    await redisClient.connect()
})()

const app = express()
const server = http.createServer(app).listen(process.env.PORT, () => {
    // console.log(process.env.PORT);
    console.log('listeninig on ' + server);
})

const io = new Server(server, {
    cors: {
        origin: '*'
    }
})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ extended: true }))
app.use(cors())
app.use('/docs', docsRoutes)


io.on('connection', (socket) => {
    console.log('user connected ' + socket
        .id)
    socket.on('message', (message, user) => {
        console.log(message)
        socket.broadcast.emit('message', {
            body: message,
            from: user
        })
    })
})

// const listener = server.listen(process.env.PORT, () => {
//     console.log('app listening in port: ' + listener.address().port)
// })
