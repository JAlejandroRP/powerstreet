import express from 'express'
import { uploadDoc } from '../controllers/docs.js'
const router = express.Router()

// router.post('/save', saveDoc)
// router.patch('/update', updateDoc)
router.patch('/upload', uploadDoc)


export default router