import * as formRepository from "../repository/form.repository";

export const getAllForms = async () => {
    return await formRepository.findAll()
};

export const getFormById = async (id: string) => {
    const form = await formRepository.findById(id);
    if (!form) {
        throw new Error("Weekly survey not found");
    }
    return form;
};

export const getFormsByWeek = async (dateString: string) => {
    const startDate = new Date(dateString);
    if (isNaN(startDate.getTime())) throw new Error("Fecha inválida");

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 7);

    return await formRepository.findByDateRange(startDate, endDate);
};

/*
export const getFormsByUser = async (userId: string) => {
    return await formService.findByUserId(userId);
};

 */