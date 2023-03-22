import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import { createClient } from 'redis';
import docsRoutes from './routes/docs.js'

dotenv.config({ path: './config.env' })

export const redisClient = createClient();
(async () => {
    redisClient.on('error', (error) => console.error('Error: ' + error))
    await redisClient.connect()
})()

const app = express()


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({extended: true}))
app.use(cors())
app.use('/docs', docsRoutes)

const listener = app.listen(process.env.PORT, () => {
    console.log('app listening in port: ' + listener.address().port)
})
    
