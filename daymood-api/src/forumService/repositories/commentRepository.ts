import { prisma } from "@/prisma/client";

export const create = (data: { content: string, id_post: string, id_user: string }) => {
    return prisma.comments.create({
        data: {
            content: data.content,
            id_post: data.id_post,
            id_user: data.id_user
        }
    });
};

export const findById = (id: string) => {
    return prisma.comments.findUnique({
        where: { id }
    });
};

export const remove = (id: string) => {
    return prisma.comments.delete({
        where: { id }
    });
};