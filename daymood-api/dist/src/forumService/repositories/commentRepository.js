"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.findById = exports.create = void 0;
const prisma_client_1 = require("../../../prisma/prisma.client");
const create = (data) => {
    return prisma_client_1.prisma.comments.create({
        data: {
            content: data.content,
            id_post: data.id_post,
            id_user: data.id_user
        }
    });
};
exports.create = create;
const findById = (id) => {
    return prisma_client_1.prisma.comments.findUnique({
        where: { id }
    });
};
exports.findById = findById;
const remove = (id) => {
    return prisma_client_1.prisma.comments.delete({
        where: { id }
    });
};
exports.remove = remove;
//# sourceMappingURL=commentRepository.js.map