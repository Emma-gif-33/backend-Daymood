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
