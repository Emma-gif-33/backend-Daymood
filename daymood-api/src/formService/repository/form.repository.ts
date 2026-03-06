import { prisma } from "../../../prisma/prisma.client";

export const findAll = () => {
    return prisma.weekly_form.findMany({
        include: { users: true }
    });
};

export const findById = (id: string) => {
    return prisma.weekly_form.findUnique({
        where: { id }
    });
};

export const findByDateRange = (startDate: Date, endDate: Date) => {
    return prisma.weekly_form.findMany({
        where: {
            date: {
                gte: startDate,
                lte: endDate
            }
        },
        orderBy: { date: 'asc' }
    });
};

export const create = (data: { id_user: string, answers: any, date: Date }) => {
    return prisma.weekly_form.create({
        data
    });
};
