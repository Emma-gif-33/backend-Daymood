import { Router } from 'express'
import multer from 'multer'
import * as emotionController from '../controllers/emotion.controllers'
import { verifyToken } from '../../middlewares/auth.middleware'

const router = Router()

const upload = multer({ storage: multer.memoryStorage() })

router.get('/favorites', verifyToken, emotionController.getFavorites)
router.post('/favorites/:id', verifyToken, emotionController.addFavorite)
router.delete('/favorites/:id', verifyToken, emotionController.removeFavorite)

router.get('/explore', verifyToken, emotionController.explore)
router.get('/', verifyToken, emotionController.getAll)
router.post('/', verifyToken, upload.single('image'), emotionController.create)
router.delete('/:id', verifyToken, emotionController.deleteEmotion)

export default router