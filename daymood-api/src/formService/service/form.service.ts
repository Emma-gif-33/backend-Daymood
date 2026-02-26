import * as formRepository from "../repository/form.repository";

const questions: Record<string, string> = { //esto lo cambio después con las preguntas reales xd
    q1: "Pregunta 1",
    q2: "Pregunta 2",
    q3: "Pregunta 3",
    q4: "Pregunta 4",
    q5: "Pregunta 5",
    q6: "Pregunta 6",
    q7: "Pregunta 7",
    q8: "Pregunta 8",
    q9: "Pregunta 9",
    q10: "Pregunta 10"
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