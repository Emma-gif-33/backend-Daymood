import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const findUserByFirebaseUid = (firebaseUid: string) => {
    return prisma.users.findUnique({
        where: { firebase_uid: firebaseUid }
    })
}

export const findEmotionById = (id: string) => {
    return prisma.emotions.findUnique({
        where: { id }
    })
}

export const findHabitById = (id: string) => {
    return prisma.habits.findUnique({
        where: { id }
    })
}

export const findRecordByUserAndDate = (idUser: string, date: Date) => {
    return prisma.records.findFirst({
        where: {
            id_user: idUser,
            date: date
        }
    })
}

export const createRecord = (data: {
    date: Date
    note?: string
    id_user: string
    id_emotion: string
    habits: string[]
}) => {
    return prisma.records.create({
        data: {
            date: data.date,
            note: data.note,
            users: { connect: { id: data.id_user } },
            emotions: { connect: { id: data.id_emotion } },
            record_habits: {
                create: data.habits.map(id_habit => ({
                    habits: { connect: { id: id_habit } }
                }))
            }
        },
        include: {
            emotions: true,
            record_habits: {
                include: { habits: true }
            }
        }
    })
}

export const findRecordsByMonth = (idUser: string, year: number, month: number) => {
    const start = new Date(year, month - 1, 1)
    const end = new Date(year, month, 1)

    return prisma.records.findMany({
        where: {
            id_user: idUser,
            date: {
                gte: start,
                lt: end
            }
        },
        include: {
            emotions: true,
            record_habits: {
                include: { habits: true }
            }
        },
        orderBy: { date: 'desc' }
    })
}


export const findRecordByDate = (idUser: string, date: Date) => {
    return prisma.records.findFirst({
        where: {
            id_user: idUser,
            date: date
        },
        include: {
            emotions: {
                include: { categories: true }
            },
            record_habits: {
                include: {
                    habits: {
                        include: { categories: true }
                    }
                }
            }
        }
    })
}