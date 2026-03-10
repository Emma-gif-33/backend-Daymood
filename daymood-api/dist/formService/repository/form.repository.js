"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = exports.findByDateRange = exports.findById = exports.findAll = void 0;
const prisma_client_1 = require("../../../prisma/prisma.client");
const findAll = () => {
    return prisma_client_1.prisma.weekly_form.findMany({
        include: { users: true }
    });
};
exports.findAll = findAll;
const findById = (id) => {
    return prisma_client_1.prisma.weekly_form.findUnique({
        where: { id }
    });
};
exports.findById = findById;
const findByDateRange = (startDate, endDate) => {
    return prisma_client_1.prisma.weekly_form.findMany({
        where: {
            date: {
                gte: startDate,
                lte: endDate
            }
        },
        orderBy: { date: 'asc' }
    });
};
exports.findByDateRange = findByDateRange;
const create = (data) => {
    return prisma_client_1.prisma.weekly_form.create({
        data
    });
};
exports.create = create;
//# sourceMappingURL=form.repository.js.map