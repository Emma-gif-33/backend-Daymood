import {Router} from "express";
import * as forumController from "../controllers/forumController"

const router = Router();

// URL: /api/forums/category/1
// El controlador usará req.params.categoryId y req.user.age
router.get('/category/:categoryId', forumController.getAvailable);

// URL: /api/forums/detail/550e8400-e29b-41d4-a716-446655440000
router.get('/detail/:id', forumController.getDetails);

export default router;

