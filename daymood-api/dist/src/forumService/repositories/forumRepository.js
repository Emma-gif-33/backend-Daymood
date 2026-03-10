"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getForumInfo = exports.findAvailableForums = void 0;
const prisma_client_1 = require("../../../prisma/prisma.client");
const findAvailableForums = (categoryId) => {
    return prisma_client_1.prisma.forums.findMany({
        where: {
            id_category: categoryId // Ahora sí filtramos directo por la columna
        },
        include: {
            _count: { select: { users: true } }
        }
    });
};
exports.findAvailableForums = findAvailableForums;
const getForumInfo = (forumId) => {
    return prisma_client_1.prisma.forums.findUnique({
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
exports.getForumInfo = getForumInfo;
//# sourceMappingURL=forumRepository.js.map