import express from 'express'
import { register, login, logout, isUserLogged } from '../controllers/users.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.post('/islogged', isUserLogged)

export default router