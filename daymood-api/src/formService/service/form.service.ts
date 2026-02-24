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

/*
export const getFormsByUser = async (userId: string) => {
    return await formService.findByUserId(userId);
};

 */