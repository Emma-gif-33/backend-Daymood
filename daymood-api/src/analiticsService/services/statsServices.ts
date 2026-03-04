import { prisma } from "../../../prisma/prisma.client";

export const getWeeklyStats = async (userId: string) => {
    const stats = await prisma.weekly_stats.findMany({
        where: { id_user: userId },
        orderBy: { week_start: 'asc' }
    });

    return stats.map(s => ({
        ...s,
        total: Number(s.total)
    }));
};