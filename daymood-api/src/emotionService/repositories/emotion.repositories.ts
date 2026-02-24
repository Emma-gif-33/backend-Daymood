import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

export const create = (data: Prisma.emotionsCreateInput) => {
    return prisma.emotions.create({ data })
}

export const findById = (id: string) => {
    return prisma.emotions.findUnique({where: { id } })
}

//trae las del repertorio (predeterminadas y favs)
export const findAllForUser = (idUser: string) => {
    return prisma.emotions.findMany({
        where: {
            OR: [
                { id_user: null },
                { id_user: idUser }
            ]
        }
    })   
}

//personalizadas d otros usuarios
export const findCustomByOthers = (idUser: string) => {
    return prisma.emotions.findMany({
        where: {
            AND: [
                { id_user: { not: null } },      // excluye predeterminadas
                { id_user: { not: idUser } }      // excluye las propias
            ]
        },
        include: {
            categories: true
        }
    })
}

export const addFavorite = (idUser: string, idEmotion: string) => {
    return prisma.favorites.create({
        data: {
            id_user: idUser,
            id_emotion: idEmotion
        }
    })
}

export const removeFavorite = (idUser:string, idEmotion: string) => {
    return prisma.favorites.delete({
        where: {
             id_user_id_emotion: { //clave compuesta q definio el schema de Prisma
                id_user: idUser,
                id_emotion: idEmotion
}
        }
    })
}

//favoritos propios
export const findFavoritesByUser = (idUser: string) => {
    return prisma.favorites.findMany({
        where: { id_user: idUser },
        include: { emotions: true }
    })
}

//no se si se va a usar pero ok
export const deleteById = (id: string) => {
    return prisma.emotions.delete({ where: { id } })
}

// findAllForUser(userId) — trae las predeterminadas (donde id_user es null) + las personalizadas del usuario. Piensa en cómo combinar ambas con Prisma usando OR.
// findCustomByOthers(userId) — todas las personalizadas excepto las del usuario actual.
// create(data) — crear una emoción, con el tipo correcto de Prisma.
// findById(id) — buscar por id para validar antes de eliminar.
// addFavorite(userId, emotionId) — insertar en tabla favorites.
// removeFavorite(userId, emotionId) — eliminar de favorites.
// findFavoritesByUser(userId) — listar favoritos con los datos de la emoción.