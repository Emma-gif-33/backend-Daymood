import { Router } from 'express'
import * as recordController from '../controllers/record.controllers'
import { verifyToken } from '../../middlewares/auth.middleware'
import { validate } from '../../middlewares/validate.middleware';
import {createRecordSchema} from "../../schemas/record.schemas";

const router = Router()

router.get('/habits', verifyToken, recordController.getHabits)
router.get('/month', verifyToken, recordController.getMonthPreview)
router.get('/day', verifyToken, recordController.getByDate)
router.post('/', verifyToken, validate(createRecordSchema),recordController.create)
router.get('/', verifyToken, recordController.getByMonth)


export default router