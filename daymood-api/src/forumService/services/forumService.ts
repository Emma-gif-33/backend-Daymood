import * as forumRepository from '../repositories/forumRepository';

// Función auxiliar para determinar el rango de edad según la edad del usuario
const getAgeRange = (age: number) => {
    if (age >= 18 && age <= 20) return { min: 18, max: 20 };
    if (age >= 21 && age <= 23) return { min: 21, max: 23 };
    if (age >= 24 && age <= 25) return { min: 24, max: 25 };
    throw new Error("Edad fuera de rango permitido");
};

export const getForumsByCategory = async (categoryId: number, userAge: number) => {
    // 1. Traemos los foros de la DB
    const forums = await forumRepository.findAvailableForums(categoryId);

    console.log(`DEBUG: Buscando foros para edad ${userAge} en foros de DB...`);

    // 2. Filtramos: ¿La edad del usuario está entre el min y el max del foro?
    return forums.filter((f: any) => {
        const min = f.min_age ?? 0;   // Si es null, usamos 0
        const max = f.max_age ?? 150; // Si es null, usamos 150

        // REGLA DE ORO: ¿El usuario cabe aquí?
        return userAge >= min && userAge <= max;
    });
};

export const getFullForumContent = async (forumId: string) => {
    const forum = await forumRepository.getForumInfo(forumId);
    if (!forum) throw new Error("Foro no encontrado");
    return forum;
};