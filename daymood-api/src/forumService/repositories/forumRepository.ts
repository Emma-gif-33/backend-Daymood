import { prisma } from "../../../prisma/prisma.client";

export const findAvailableForums = (categoryId: number) => {
    return prisma.forums.findMany({
        include: {
            _count: {
                select: { users: true }
            },
            posts: true // Para ver si se crearon posts
        }
    });
};

export const getForumInfo = (forumId: string) => {
    return prisma.forums.findUnique({
        where: { id: forumId },
        include: {
            users: true, // Miembros del grupo
            posts: {
                include: {
                    users: true, // Autor del post
                    comments: {
                        include: {
                            users: true // Autor del comentario
                        }
                    }
                }
            }
        }
    });
};