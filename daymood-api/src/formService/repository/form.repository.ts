import {prisma} from "@/prisma.client";

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

