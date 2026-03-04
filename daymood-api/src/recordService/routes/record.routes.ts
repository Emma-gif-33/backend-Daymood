import { Router } from 'express'
import * as recordController from '../controllers/record.controllers'
import { verifyToken } from '../../middlewares/auth.middleware'

const router = Router()

router.get('/month', verifyToken, recordController.getMonthPreview)
router.get('/day', verifyToken, recordController.getByDate)
router.post('/', verifyToken, recordController.create)
router.get('/', verifyToken, recordController.getByMonth)

export default router