import { Router } from 'express';
import { dailyCutoffController, testBigQuery } from './bigquery.controller';

const router = Router();

router.post('/cutoff', dailyCutoffController);   
router.post('/test-bq', testBigQuery);            

export default router;