import express from 'express'
import { MongoClient } from 'mongodb'
import { redisClient } from '../index.js'
import dotenv from 'dotenv'
dotenv.config({ path: './config.env' })


const router = express.Router()
const client = await MongoClient.connect(process.env.MONGO_URI)

export const getDocs = async (req, res) => {
    try {
        const allDocs = await client.db('test').collection('docs').find().sort({ fecha_creacion: -1 }).map((d) => {
            // console.log(d)
            return { id: d._id, title: d.titulo }
        }).toArray()

        if (!allDocs)
            return res.status(200).json({ msg: 'no docs found!' })
        console.log(allDocs);
        return res.status(200).json(JSON.stringify(allDocs))
    } catch (error) {
        return res.status(409).send(error)
    }
}

export default router