import express from 'express'
import { getDocs } from '../controllers/docs.js'

const router = express.Router()

router.get('/getdocs', getDocs)

export default router