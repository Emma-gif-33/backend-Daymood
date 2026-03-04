import { Router } from 'express';
import { testBigQuery } from './bigquery.controller';

const router = Router();

router.get('/test-bq', testBigQuery);

export default router;