"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.findByEmail = exports.findByFirebaseUid = void 0;
const prisma_client_1 = require("../../../prisma/prisma.client");
const findByFirebaseUid = (firebase_uid) => {
    return prisma_client_1.prisma.users.findUnique({
        where: { firebase_uid }
    });
};
exports.findByFirebaseUid = findByFirebaseUid;
const findByEmail = (email) => {
    return prisma_client_1.prisma.users.findUnique({
        where: { email }
    });
};
exports.findByEmail = findByEmail;
const createUser = (data) => {
    return prisma_client_1.prisma.users.create({
        data: {
            firebase_uid: data.firebase_uid,
            username: data.username,
            email: data.email,
            birth_day: new Date(data.birth_day)
        }
    });
};
exports.createUser = createUser;
//# sourceMappingURL=user.repositories.js.map