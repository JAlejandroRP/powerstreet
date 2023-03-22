import express from 'express'
import { saveDoc, updateDoc } from '../controllers/docs.js'
const router = express.Router()

router.post('/save', saveDoc)
router.patch('/update', updateDoc)


export default router