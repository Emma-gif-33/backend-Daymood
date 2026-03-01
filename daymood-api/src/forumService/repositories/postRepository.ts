import { prisma } from "@/prisma/client";

export const create = (data: { title: string, content: string, id_user: string, id_category: number, id_forum: string }) => {
    return prisma.posts.create({
        data: {
            title: data.title,
            content: data.content,
            id_user: data.id_user,
            id_category: data.id_category,
            id_forum: data.id_forum
        }
    });
};

export const findById = (id: string) => {
    return prisma.posts.findUnique({
        where: { id },
        include: { comments: true }
    });
};

export const update = (id: string, data: { title?: string, content?: string }) => {
    return prisma.posts.update({
        where: { id },
        data
    });
};

export const remove = (id: string) => {
    return prisma.posts.delete({
        where: { id }
    });
};