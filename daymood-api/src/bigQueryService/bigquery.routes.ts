import { Router } from 'express';
import { testBigQuery } from './bigquery.controller';

const router = Router();

router.post('/test-bq', testBigQuery);

export default router;