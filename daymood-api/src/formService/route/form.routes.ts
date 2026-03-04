import { Router } from 'express';
import * as formController from "../controller/form.controller";
const router = Router();

// GET /api/weekly-forms
router.get('/', formController.getAll);

router.get('/filter', formController.getByWeek);

// GET /api/weekly-forms/550e8400-e29b-41d4-a716-446655440000 ej.
router.get('/:id', formController.getById);

export default router;