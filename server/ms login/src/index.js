import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import usersRoutes from "./routes/users.js"
import session from 'express-session'
import RedisStore from 'connect-redis'
import dotenv from 'dotenv'
import { createClient } from 'redis';

dotenv.config({ path: './config.env' })

export const redisClient = createClient();
(async () => {
    redisClient.on('error', (error) => console.error('Error: ' + error))
    await redisClient.connect()
})()

const app = express()
console.log(session.Session);
const redisStore = new RedisStore({
    client: redisClient
})

// session middleware
app.use(session({
    store: redisStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // if true only transmit cookie over https
        httpOnly: false, // if true prevent client side JS from reading the cookie 
        maxAge: 1000 // session max age in miliseconds
    }
}))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({extended: true}))
app.use(cors())
app.use('/users', usersRoutes)

const listener = app.listen(process.env.PORT, () => {
    console.log('app listening in port: ' + listener.address().port)
})
    
