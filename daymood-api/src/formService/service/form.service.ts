import * as formRepository from "../repository/form.repository";

const questions: Record<string, string> = { //esto lo cambio después con las preguntas reales xd
    q1: "Normalmente dedico tiempo a mis emociones.",
    q2: "Pienso que debo prestar atención a mis emociones y sentimientos.",
    q3: "Frecuentemente tengo claros mis pensamientos",
    q4: "Pienso en mi estado de ánimo constantemente",
    q5: "Casi siempre sé cómo me siento",
    q6: "Normalmente conozco mis sentimientos sobre las personas.",
    q7: "A menudo me doy cuenta de mis sentimientos en diferentes situaciones.",
    q8: "Puedo llegar a comprender mis sentimientos.",
    q9: "Si doy demasiadas vueltas a las cosas, complicándolas, trato de calmarme.",
    q10: "Me preocupo por tener un buen estado de ánimo."
}

const formatFormWithQuestions = (form: any) => { //Acá se hace el conjunto de pregunta-respuesta chido
    if (!form.answers) return form;
    const full_answers = Object.keys(questions).map((key) => {
        return {
            key: key,
            pregunta: questions[key],
            respuesta: form.answers[key] || null
        };
    });
    return {
        ...form,
        full_answers
    };
};

export const getAllForms = async () => {
    const forms = await formRepository.findAll();
    return forms.map(formatFormWithQuestions);
};

export const getFormById = async (id: string) => {
    const form = await formRepository.findById(id);
    if (!form) {
        throw new Error("Weekly survey not found");
    }
    return form.map(formatFormWithQuestions(form));
};

export const getFormsByWeek = async (dateString: string) => {
    const startDate = new Date(dateString);
    if (isNaN(startDate.getTime())) throw new Error("Fecha inválida");

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 7);

    const forms = await formRepository.findByDateRange(startDate, endDate);
    return forms.map(formatFormWithQuestions);
};

export const saveWeeklyForm = async (userId: string, answers: Record<string, number>) => {
    // Validamos que vengan respuestas (puedes validar que estén las 10 si quieres)
    if (!answers || Object.keys(answers).length === 0) {
        throw new Error("Debes proporcionar las respuestas al cuestionario");
    }

    const newForm = await formRepository.create({
        id_user: userId,
        answers: answers, 
        date: new Date()
    });

    return formatFormWithQuestions(newForm);
};