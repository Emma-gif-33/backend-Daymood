import { Router } from 'express';
import { getMyWeeklyStats } from '../controllers/statsController';
import { verifyToken } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/weekly', verifyToken, getMyWeeklyStats);

export default router;