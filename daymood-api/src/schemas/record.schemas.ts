import { z } from 'zod';

export const createRecordSchema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha debe tener formato YYYY-MM-DD'),
    note: z.string().max(500).optional(),
    emotion_id: z.string().uuid('ID de emoción inválido'),
    habit_ids: z.array(z.string().uuid()).min(1, 'Debes seleccionar al menos un hábito')
});

export const createUserSchema = z.object({
    birth_day: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha debe tener formato YYYY-MM-DD'),
    username: z.string().min(2).max(50).optional()
});


export const loginUserSchema = z.object({
    firebase_uid: z.string().min(1, 'firebase_uid es obligatorio')
});

export const createPostSchema = z.object({
    title: z.string().min(3, 'El título debe tener al menos 3 caracteres').max(150, 'El título no puede superar 150 caracteres'),
    content: z.string().min(10, 'El contenido debe tener al menos 10 caracteres').max(2000, 'El contenido no puede superar 2000 caracteres'),
    id_forum: z.string().uuid('id_forum debe ser un UUID válido')
});

export const updatePostSchema = z.object({
    title: z.string().min(3).max(150).optional(),
    content: z.string().min(10).max(2000).optional()
}).refine(data => data.title !== undefined || data.content !== undefined, {
    message: 'Debes enviar al menos un campo para actualizar (title o content)'
});

export const createCommentSchema = z.object({
    content: z.string().min(1, 'El comentario no puede estar vacío').max(1000, 'El comentario no puede superar 1000 caracteres'),
    id_post: z.string().uuid('id_post debe ser un UUID válido')
});
