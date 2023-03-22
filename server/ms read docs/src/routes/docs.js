import express from 'express'
import { readDoc } from '../controllers/docs.js'
const router = express.Router()

router.post('/read', readDoc)


export default router