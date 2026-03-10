"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteById = exports.findFavoritesByUser = exports.removeFavorite = exports.addFavorite = exports.findCustomByOthers = exports.findAllForUser = exports.findById = exports.create = exports.findUserByFirebaseUid = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const findUserByFirebaseUid = (firebaseUid) => {
    return prisma.users.findUnique({
        where: { firebase_uid: firebaseUid }
    });
};
exports.findUserByFirebaseUid = findUserByFirebaseUid;
const create = (data) => {
    return prisma.emotions.create({ data });
};
exports.create = create;
const findById = (id) => {
    return prisma.emotions.findUnique({ where: { id } });
};
exports.findById = findById;
//trae las del repertorio (predeterminadas y favs)
const findAllForUser = (idUser) => {
    return prisma.emotions.findMany({
        where: {
            OR: [
                { id_user: null },
                { id_user: idUser }
            ]
        }
    });
};
exports.findAllForUser = findAllForUser;
//personalizadas d otros usuarios
const findCustomByOthers = (idUser) => {
    return prisma.emotions.findMany({
        where: {
            AND: [
                { id_user: { not: null } }, // excluye predeterminadas
                { id_user: { not: idUser } } // excluye las propias
            ]
        },
        include: {
            categories: true
        }
    });
};
exports.findCustomByOthers = findCustomByOthers;
const addFavorite = (idUser, idEmotion) => {
    return prisma.favorites.create({
        data: {
            id_user: idUser,
            id_emotion: idEmotion
        }
    });
};
exports.addFavorite = addFavorite;
const removeFavorite = (idUser, idEmotion) => {
    return prisma.favorites.delete({
        where: {
            id_user_id_emotion: {
                id_user: idUser,
                id_emotion: idEmotion
            }
        }
    });
};
exports.removeFavorite = removeFavorite;
//favoritos propios
const findFavoritesByUser = (idUser) => {
    return prisma.favorites.findMany({
        where: { id_user: idUser },
        include: { emotions: true }
    });
};
exports.findFavoritesByUser = findFavoritesByUser;
//no se si se va a usar pero ok
const deleteById = (id) => {
    return prisma.emotions.delete({ where: { id } });
};
exports.deleteById = deleteById;
// findAllForUser(userId) — trae las predeterminadas (donde id_user es null) + las personalizadas del usuario. Piensa en cómo combinar ambas con Prisma usando OR.
// findCustomByOthers(userId) — todas las personalizadas excepto las del usuario actual.
// create(data) — crear una emoción, con el tipo correcto de Prisma.
// findById(id) — buscar por id para validar antes de eliminar.
// addFavorite(userId, emotionId) — insertar en tabla favorites.
// removeFavorite(userId, emotionId) — eliminar de favorites.
// findFavoritesByUser(userId) — listar favoritos con los datos de la emoción.
//# sourceMappingURL=emotion.repositories.js.map