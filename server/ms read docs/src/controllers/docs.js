import express from 'express'
import { ObjectId, MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import { redisClient } from '../index.js'
dotenv.config({ path: './config.env' })

const router = express.Router()
const client = await MongoClient.connect(process.env.MONGO_URI)

export const readDoc = async (req, res) => {
    // console.log(req.body);
    const { id, session } = req.body

    const logged = await redisClient.get('sess:' + session)
    // console.log(logged );
    if (!logged)
        return res.status(401).json({ error: 'not logged' })

    const doc = await client.db('test').collection('docs').findOne({ _id: new ObjectId(id) })

    if (doc)
        return res.status(200).json(doc)

    return res.status(404).json({ error: 'not found!' })
}

export default router