import * as forumRepository from '../repositories/forumRepository';

// Función auxiliar para determinar el rango de edad según la edad del usuario
// 1. Esta función define los límites del "saquito"
const getAgeRange = (age: number) => {
    if (age >= 18 && age <= 20) return { min: 18, max: 20 };
    if (age >= 21 && age <= 23) return { min: 21, max: 23 };
    if (age >= 24 && age <= 25) return { min: 24, max: 25 };
    // Rango por defecto o para mayores
    return { min: 26, max: 99 };
};

export const getForumsByCategory = async (categoryId: number, userAge: number) => {
    // Calculamos el rango ideal para el usuario
    const targetRange = getAgeRange(userAge);

    const forums = await forumRepository.findAvailableForums(categoryId);

    // FILTRO INTELIGENTE:
    // Buscamos foros que coincidan EXACTAMENTE con ese rango de clasificación
    return forums.filter((f: any) =>
        f.min_age === targetRange.min && f.max_age === targetRange.max
    );
};

export const getFullForumContent = async (forumId: string) => {
    const forum = await forumRepository.getForumInfo(forumId);
    if (!forum) throw new Error("Foro no encontrado");
    return forum;
};