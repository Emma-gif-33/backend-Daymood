import * as forumRepository from '../repositories/forumRepository';

// Función auxiliar para determinar el rango de edad según la edad del usuario
const getAgeRange = (age: number) => {
    if (age >= 18 && age <= 20) return { min: 18, max: 20 };
    if (age >= 21 && age <= 23) return { min: 21, max: 23 };
    if (age >= 24 && age <= 25) return { min: 24, max: 25 };
    throw new Error("Edad fuera de rango permitido");
};

export const getForumsByCategory = async (categoryId: number, userAge: number) => {
    const range = getAgeRange(userAge);
    const forums = await forumRepository.findAvailableForums(categoryId);

    // Filtramos por el rango de edad que calculamos
    return forums.filter((f: any) =>
        f.min_age === range.min && f.max_age === range.max
    );
};

export const getFullForumContent = async (forumId: string) => {
    const forum = await forumRepository.getForumInfo(forumId);
    if (!forum) throw new Error("Foro no encontrado");
    return forum;
};