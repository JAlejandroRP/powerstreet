import docSchema from '../models/docSchema.js'
import express from 'express'
import { ObjectId, MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import { redisClient } from '../index.js'
// import { createClient } from 'redis';

dotenv.config({ path: './config.env' })

// const redisClient = createClient();
const router = express.Router()
// console.log(process.env.MONGO_URI)
const client = await MongoClient.connect(process.env.MONGO_URI)

export const uploadDoc = async (req, res) => {
    const { title, doc, autor, createdOn, modifiedOn, session} = req.body

    const logged = await redisClient.get('sess:' + session)
    // console.log(logged );
    if (!logged)
        return res.status(401).json({ error: 'not logged' })

    const dateNow = new Date()

    const newDoc = {
        titulo: title,
        documento: doc,
        autor: { usuario: autor.user, nombre: autor.fullName },
        modificado_por: {
            usuario: autor.user, nombre: autor.fullName
        },
        fecha_creacion: createdOn,
        fecha_modificacion: modifiedOn,
        historial_cambios: [{
            documento: doc,
            fecha: createdOn,
            fecha_server: dateNow,
            autor_cambio: {
                usuario: autor.user,
                nombre: autor.fullName
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

// export const uploadDoc = async (req, res) => {
//     const { id, title, doc, modifiedOn, modifiedBy, autor, session} = req.body

//     const logged = await redisClient.get('sess:' + session)
//     // console.log(logged );
//     if (!logged)
//         return res.status(401).json({ error: 'not logged' })

//     const uploadDoc = await client.db('test').collection('docs').updateOne({ _id: new ObjectId(id) }, {
//         $set: { 
//             fecha_modificacion: modifiedOn,
//             modificado_por: {
//                 usuario: modifiedBy.user,
//                 nombre: modifiedBy.fullName
//             },
//             titulo: title,
//             documento: doc
//         },
//         $push: {
//             historial_cambios: {
//                 documento: doc,
//                 fecha: modifiedOn,
//                 fecha_server: modifiedOn,
//                 autor_cambio: {
//                     usuario: modifiedBy.user,
//                     nombre: modifiedBy.fullName
//                 }
//             }
//         }
//     })

//     console.log(uploadDoc );
//     if(uploadDoc.modifiedCount > 0)
//         return res.status(200).json(uploadDoc)
//     return res.status(404).json({error: 'no se pudo actualizar'})
//     // console.log(updateDoc);
// }

export default router