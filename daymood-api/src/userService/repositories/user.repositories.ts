import { prisma } from '../../../prisma/prisma.client'

export const findByFirebaseUid = (firebase_uid: string) => {
    return prisma.users.findUnique({
        where: { firebase_uid }
    })
}

export const findByEmail = (email: string) => {
    return prisma.users.findUnique({
        where: { email }
    })
}

export const createUser = (data: {
    firebase_uid: string
    username: string
    email: string
    birth_day: string
}) => {
    return prisma.users.create({
        data: {
            firebase_uid: data.firebase_uid,
            username: data.username,
            email: data.email,
            birth_day: new Date(data.birth_day)
        }
    })
}