import * as forumRepository from '../repositories/forumRepository';

const getAgeRange = (age: number) => {
    if (age >= 18 && age <= 20) return { min: 18, max: 20 };
    if (age >= 21 && age <= 23) return { min: 21, max: 23 };
    if (age >= 24 && age <= 60) return { min: 24, max: 60 };
    // Rango por defecto
    return { min: 24, max: 60 };
};

export const getForumsByCategory = async (categoryId: number, userAge: number) => {
    const targetRange = getAgeRange(userAge);

    const forums = await forumRepository.findAvailableForums(categoryId);

    return forums.filter((f: any) =>
        f.min_age === targetRange.min && f.max_age === targetRange.max
    );
};

export const getFullForumContent = async (forumId: string) => {
    const forum = await forumRepository.getForumInfo(forumId);
    if (!forum) throw new Error("Foro no encontrado");
    return forum;
};