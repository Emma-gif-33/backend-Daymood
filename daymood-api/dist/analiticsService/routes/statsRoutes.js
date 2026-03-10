"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const statsController_1 = require("../controllers/statsController");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get('/weekly', auth_middleware_1.verifyToken, statsController_1.getMyWeeklyStats);
exports.default = router;
//# sourceMappingURL=statsRoutes.js.map