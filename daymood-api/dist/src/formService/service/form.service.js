"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveWeeklyForm = exports.getFormsByWeek = exports.getFormById = exports.getAllForms = void 0;
const formRepository = __importStar(require("../repository/form.repository"));
const questions = {
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
};
const formatFormWithQuestions = (form) => {
    if (!form.answers)
        return form;
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
const getAllForms = async () => {
    const forms = await formRepository.findAll();
    return forms.map(formatFormWithQuestions);
};
exports.getAllForms = getAllForms;
const getFormById = async (id) => {
    const form = await formRepository.findById(id);
    if (!form) {
        throw new Error("Weekly survey not found");
    }
    return (formatFormWithQuestions(form));
};
exports.getFormById = getFormById;
const getFormsByWeek = async (dateString) => {
    const startDate = new Date(dateString);
    if (isNaN(startDate.getTime()))
        throw new Error("Fecha inválida");
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 7);
    const forms = await formRepository.findByDateRange(startDate, endDate);
    return forms.map(formatFormWithQuestions);
};
exports.getFormsByWeek = getFormsByWeek;
const saveWeeklyForm = async (userId, answers) => {
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
exports.saveWeeklyForm = saveWeeklyForm;
//# sourceMappingURL=form.service.js.map