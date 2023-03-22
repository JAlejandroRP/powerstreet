import docSchema from '../models/docSchema.js'
import express from 'express'
import { ObjectId, MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import { redisClient } from '../index.js'

dotenv.config({ path: './config.env' })
const router = express.Router()
const client = await MongoClient.connect(process.env.MONGO_URI)

export const saveDoc = async (req, res) => {
    const { titulo, documento, autor, fecha_creacion, fecha_modificacion, sessionID} = req.body

    const logged = await redisClient.get('sess:' + sessionID)
    // console.log(logged );
    if (!logged)
        return res.status(401).json({ error: 'not logged' })

    const dateNow = new Date()

    const newDoc = {
        titulo: titulo,
        documento: documento,
        autor: { usuario: autor.usuario, nombre: autor.nombre },
        modificado_por: {
            usuario: autor.usuario, nombre: autor.nombre
        },
        fecha_creacion: fecha_creacion,
        fecha_modificacion: fecha_modificacion,
        historial_cambios: [{
            documento: documento,
            fecha: fecha_creacion,
            fecha_server: dateNow,
            autor_cambio: {
                usuario: autor.usuario,
                nombre: autor.nombre
            }
        }]
    }
    console.log(newDoc);
    const errors = docSchema.validate(newDoc)

    if (errors.length > 0) {
        console.error(errors)
        return res.status(409).json({ error: 'invalid doc schema' })
    }

    const insertedDoc = await client.db('test').collection('docs').insertOne(newDoc)

    if (!insertedDoc)
        return res.status(409).json({ error: 'error while inserting' })

    return res.status(200).json(insertedDoc)
}

export const updateDoc = async (req, res) => {
    const { _id, titulo, documento, fecha_modificacion, modificado_por, autor, sessionID} = req.body

    const logged = await redisClient.get('sess:' + sessionID)
    // console.log(logged );
    if (!logged)
        return res.status(401).json({ error: 'not logged' })

    if(! _id || !titulo || ! documento || !fecha_modificacion || !modificado_por)
            return res.status(409).json({error: 'not enough parameters'})

    const updateDoc = await client.db('test').collection('docs').updateOne({ _id: new ObjectId(_id) }, {
        $set: { 
            fecha_modificacion: fecha_modificacion,
            modificado_por: {
                usuario: modificado_por.usuario,
                nombre: modificado_por.nombre
            },
            titulo: titulo,
            documento: documento
        },
        $push: {
            historial_cambios: {
                documento: documento,
                fecha: fecha_modificacion,
                fecha_server: new Date(),
                autor_cambio: {
                    usuario: modificado_por.usuario,
                    nombre: modificado_por.nombre
                }
            }
        }
    })

    console.log(updateDoc );
    if(updateDoc.modifiedCount > 0)
        return res.status(200).json(updateDoc)
    return res.status(404).json({error: 'no se pudo actualizar'})
    // console.log(updateDoc);
}

export default router