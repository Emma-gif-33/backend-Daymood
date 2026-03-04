import * as recordRepository from '../repositories/record.repositories'

const getUserId = async (firebaseUid: string): Promise<string> => {
    const user = await recordRepository.findUserByFirebaseUid(firebaseUid)
    if (!user) throw new Error('Usuario no encontrado en la BD')
    return user.id
}

export const createRecord = async (
        firebaseUid: string,
        data: {
            date: string
            id_emotion: string
            habits: string[]
            note?: string
        }) => {
        // campos obligatorios
        if (!data.date) throw new Error('La fecha es obligatoria')
        if (!data.id_emotion) throw new Error('La emoción es obligatoria')
        if (!data.habits || data.habits.length === 0) {
            throw new Error('Debes seleccionar al menos un hábito')
        }

        // validar q la fecha no sea futura
        const recordDate = new Date(data.date)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        if (recordDate > today) {
            throw new Error('No puedes registrar una fecha futura')
        }

        const userId = await getUserId(firebaseUid)

        // Validar que no exista ya un registro para esa fecha
        const existing = await recordRepository.findRecordByUserAndDate(userId, recordDate)
        if (existing) throw new Error('Ya tienes un registro para esta fecha')

        //emoción existe
        const emotion = await recordRepository.findEmotionById(data.id_emotion)
        if (!emotion) throw new Error('Emoción no encontrada')

        //los hábitos existen
        for (const habitId of data.habits) {
            const habit = await recordRepository.findHabitById(habitId)
            if (!habit) throw new Error(`Hábito no encontrado: ${habitId}`)
        }

        //no habitos de la misma categoria (o sea no dos habitos)
        const categoriesUsed = new Set<number>()
        for (const habitId of data.habits) {
            const habit = await recordRepository.findHabitById(habitId)
            if (!habit) throw new Error(`Hábito no encontrado: ${habitId}`)
            if (categoriesUsed.has(habit.id_category)) {
                throw new Error('No puedes seleccionar dos hábitos de la misma categoría')
            }
            categoriesUsed.add(habit.id_category)
        }

        return recordRepository.createRecord({
            date: recordDate,
            note: data.note,
            id_user: userId,
            id_emotion: data.id_emotion,
            habits: data.habits
        })
    }

    export const getRecordsByMonth = async (
            firebaseUid: string,
            year: number,
            month: number
        ) => {
            if (!year || !month) throw new Error('Año y mes son obligatorios')
            if (month < 1 || month > 12) throw new Error('Mes inválido')

            const userId = await getUserId(firebaseUid)
            return recordRepository.findRecordsByMonth(userId, year, month)
    }

    export const getRecordByDate = async (firebaseUid: string, date: string) => {
        if (!date) throw new Error('La fecha es obligatoria')

        const recordDate = new Date(date)
        if (isNaN(recordDate.getTime())) throw new Error('Fecha inválida')

        const userId = await getUserId(firebaseUid)
        const record = await recordRepository.findRecordByDate(userId, recordDate)

        if (!record) return null  // el controller maneja el mensaje

        return record
    }
    
    export const getMonthPreview = async (firebaseUid: string, year: number, month: number) => {
    if (!year || !month) throw new Error('Año y mes son obligatorios')
    if (month < 1 || month > 12) throw new Error('Mes inválido')

    const userId = await getUserId(firebaseUid)
    return recordRepository.findPreviewByMonth(userId, year, month)
}