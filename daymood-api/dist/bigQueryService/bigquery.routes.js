"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bigquery_controller_1 = require("./bigquery.controller");
const router = (0, express_1.Router)();
router.post('/cutoff', bigquery_controller_1.dailyCutoffController);
router.post('/test-bq', bigquery_controller_1.testBigQuery);
exports.default = router;
//# sourceMappingURL=bigquery.routes.js.map