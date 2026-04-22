import { Router } from 'express'
import * as userController from '../controllers/user.controllers'
import { verifyToken } from '../../middlewares/auth.middleware'
import { validate } from '../../middlewares/validate.middleware';
import { createUserSchema, loginUserSchema } from '../../schemas/record.schemas';

const router = Router()

router.post('/register',/*validate(createUserSchema),*/ userController.register)
router.post('/login', validate(loginUserSchema), userController.login)
router.get('/me', verifyToken, userController.getMe)

export default router