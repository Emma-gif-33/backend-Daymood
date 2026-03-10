"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.findById = exports.create = void 0;
const prisma_client_1 = require("../../../prisma/prisma.client");
const create = (data) => {
    return prisma_client_1.prisma.posts.create({
        data: {
            title: data.title,
            content: data.content,
            id_user: data.id_user,
            id_category: data.id_category,
            id_forum: data.id_forum
        }
    });
};
exports.create = create;
const findById = (id) => {
    return prisma_client_1.prisma.posts.findUnique({
        where: { id },
        include: { comments: true }
    });
};
exports.findById = findById;
const update = (id, data) => {
    return prisma_client_1.prisma.posts.update({
        where: { id },
        data
    });
};
exports.update = update;
const remove = (id) => {
    return prisma_client_1.prisma.posts.delete({
        where: { id }
    });
};
exports.remove = remove;
//# sourceMappingURL=postRepository.js.map