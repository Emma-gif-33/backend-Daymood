"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPreviewByMonth = exports.findRecordByDate = exports.findRecordsByMonth = exports.createRecord = exports.findRecordByUserAndDate = exports.findHabitById = exports.findEmotionById = exports.findUserByFirebaseUid = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const findUserByFirebaseUid = (firebaseUid) => {
    return prisma.users.findUnique({
        where: { firebase_uid: firebaseUid }
    });
};
exports.findUserByFirebaseUid = findUserByFirebaseUid;
const findEmotionById = (id) => {
    return prisma.emotions.findUnique({
        where: { id }
    });
};
exports.findEmotionById = findEmotionById;
const findHabitById = (id) => {
    return prisma.habits.findUnique({
        where: { id }
    });
};
exports.findHabitById = findHabitById;
const findRecordByUserAndDate = (idUser, date) => {
    return prisma.records.findFirst({
        where: {
            id_user: idUser,
            date: date
        }
    });
};
exports.findRecordByUserAndDate = findRecordByUserAndDate;
const createRecord = (data) => {
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
    });
};
exports.createRecord = createRecord;
const findRecordsByMonth = (idUser, year, month) => {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);
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
    });
};
exports.findRecordsByMonth = findRecordsByMonth;
const findRecordByDate = (idUser, date) => {
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
    });
};
exports.findRecordByDate = findRecordByDate;
const findPreviewByMonth = (idUser, year, month) => {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);
    return prisma.records.findMany({
        where: {
            id_user: idUser,
            date: { gte: start, lt: end }
        },
        select: {
            id: true,
            date: true,
            emotions: {
                select: {
                    img_url: true,
                    name: true
                }
            }
        },
        orderBy: { date: 'asc' }
    });
};
exports.findPreviewByMonth = findPreviewByMonth;
//# sourceMappingURL=record.repositories.js.map