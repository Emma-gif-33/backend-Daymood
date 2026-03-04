import { Router } from 'express'
import * as userController from '../controllers/user.controllers'
import { verifyToken } from '../../middlewares/auth.middleware'

const router = Router()

router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/me', verifyToken, userController.getMe)

export default router