import {Router} from "express";
import * as forumController from "../controllers/forumController"
import {verifyToken} from "../../middlewares/auth.middleware";


const router = Router();

// URL: /api/forums/category/1
router.get('/category/:categoryId', verifyToken, forumController.getAvailable);

// URL: /api/forums/detail/550e8400-e29b-41d4-a716-446655440000
router.get('/detail/:id', forumController.getDetails);

export default router;