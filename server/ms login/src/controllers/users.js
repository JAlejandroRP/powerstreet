import userSchema from '../models/userSchema.js'
import express from 'express'
import { MongoClient } from 'mongodb'
import { redisClient } from '../index.js'
import dotenv from 'dotenv'
dotenv.config({ path: './config.env' })


const router = express.Router()
const client = await MongoClient.connect(process.env.MONGO_URI)
const expireTime = 1000 * 60 * 5// 5 min de tiempo

export const register = async (req, res) => {
    const { username, password, fullName, type } = req.body
    const exist = await client.db('test').collection('users').findOne({ usuario: username })
    // console.log(exist);

    if (exist)
        return res.status(409).json({ error: 'user already exist' })

    const newUser = {
        usuario: username,
        pass: password,
        nombre: fullName,
        ultimo_inicio_sesion: new Date(),
        tipo: type || 'desarrollo',
        maximo_tiempo_session_inactiva: expireTime
    }
    // console.log(newUser)
    const errors = userSchema.validate(newUser)

    if (errors.length > 0) {
        console.error(errors)
        return res.status(409).json({ error: 'invalid user schema' })
    }

    try {
        // console.log(newUser);
        const doc = await client.db('test').collection('users').insertOne(newUser)

        console.log(doc);
        if (!doc)
            return res.status(409).json({ error: 'error while inserting' })
      
        console.log(newUser);
        req.session.cookie.originalMaxAge = newUser.maximo_tiempo_session_inactiva
        req.session.user = newUser
        // const session = req.session
        // session.username = username

        return res.status(200).json({ sessionID: req.sessionID })
    } catch (error) {
        return res.status(409).send(error)
    }
}

export const login = async (req, res) => {
    const { username, password } = req.body
    console.log('from /login ' + req.sessionID);
    try {
        const doc = await client.db('test').collection('users').findOneAndUpdate({
            usuario: username, pass: password
        }, {
            $set: { ultimo_inicio_sesion: new Date() }
        })
        if (doc === null || !doc)
            return res.status(404).json({ error: 'user not found!' })

        // const session = req.session

        req.session.cookie.originalMaxAge = doc.value.maximo_tiempo_session_inactiva
        req.session.user = doc.value
        // req.cookies['_id'] = 'hehehe'
        console.log(req.session);
        // console.log(req.sessionID);
        // await redisClient.set(username, JSON.stringify(doc))
        // next()


        return res.status(200).json({ sessionID: req.sessionID })
    } catch (error) {
        // console.log(error);
        return res.status(409).send(error)
    }
}

export const logout = async (req, res) => {
    // console.log(req.body.username)
    try {
        // req.session.destroy
        const sessionID = getSessionIdFromReq(req)

        await redisClient.del("sess:" + sessionID)
        console.log("sess:" + sessionID);
        return res.status(200).json({ msg: 'user logged out' })
        // return res.status(200).json({ msg: 'user already logged out' })
    } catch (error) {
        return res.status(409).send(error)
    }
}

export const isUserLogged = async (req, res) => {
    console.log('from /islogged');
    try {
        const sessionID = getSessionIdFromReq(req)
        // let { sessionID } = req.body
        // console.log(sessionID);
        // sessionID = sessionID.replace('sessionId=', '')
        // return req.session && req.session.username !== null
        const user = await redisClient.get("sess:" + sessionID)

        console.log(user);
        // if (user)
        return res.status(200).json(user)

        // return res.status(200).json({})
    } catch (error) {
        return res.status(409).send(error)
    }

}

const getSessionIdFromReq = (req) => req.body.sessionID.replace('sessionId=', '')
export default router