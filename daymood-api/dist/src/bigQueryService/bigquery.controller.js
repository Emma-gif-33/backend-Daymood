"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testBigQuery = exports.dailyCutoffController = void 0;
const bigquery_service_1 = require("./bigquery.service");
const dailyCutoffController = async (req, res) => {
    try {
        const result = await (0, bigquery_service_1.dailyCutoff)();
        res.status(200).json({
            success: true,
            message: `Corte del día ejecutado correctamente. ${result.rowsSent} filas enviadas a BigQuery.`,
            data: {
                rowsSent: result.rowsSent,
                csvFile: result.csvFile,
                timestamp: new Date().toISOString()
            }
        });
    }
    catch (error) {
        console.error('Error en corte del día:', error.message);
        res.status(500).json({
            success: false,
            message: error.message || 'Error al ejecutar el corte del día',
            data: null
        });
    }
};
exports.dailyCutoffController = dailyCutoffController;
exports.testBigQuery = exports.dailyCutoffController;
//# sourceMappingURL=bigquery.controller.js.map