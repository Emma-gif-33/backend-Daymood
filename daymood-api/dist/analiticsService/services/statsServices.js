"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeeklyStats = void 0;
const prisma_client_1 = require("../../../prisma/prisma.client");
const getWeeklyStats = async (userId) => {
    const stats = await prisma_client_1.prisma.weekly_stats.findMany({
        where: { id_user: userId },
        orderBy: { week_start: 'asc' }
    });
    return stats.map(s => ({
        ...s,
        total: Number(s.total)
    }));
};
exports.getWeeklyStats = getWeeklyStats;
//# sourceMappingURL=statsServices.js.map