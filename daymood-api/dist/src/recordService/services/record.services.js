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
exports.getMonthPreview = exports.getRecordByDate = exports.getRecordsByMonth = exports.createRecord = void 0;
const recordRepository = __importStar(require("../repositories/record.repositories"));
const getUserId = async (firebaseUid) => {
    const user = await recordRepository.findUserByFirebaseUid(firebaseUid);
    if (!user)
        throw new Error('Usuario no encontrado en la BD');
    return user.id;
};
const createRecord = async (firebaseUid, data) => {
    // campos obligatorios
    if (!data.date)
        throw new Error('La fecha es obligatoria');
    if (!data.id_emotion)
        throw new Error('La emoción es obligatoria');
    if (!data.habits || data.habits.length === 0) {
        throw new Error('Debes seleccionar al menos un hábito');
    }
    // validar q la fecha no sea futura
    const recordDate = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (recordDate > today) {
        throw new Error('No puedes registrar una fecha futura');
    }
    const userId = await getUserId(firebaseUid);
    // Validar que no exista ya un registro para esa fecha
    const existing = await recordRepository.findRecordByUserAndDate(userId, recordDate);
    if (existing)
        throw new Error('Ya tienes un registro para esta fecha');
    //emoción existe
    const emotion = await recordRepository.findEmotionById(data.id_emotion);
    if (!emotion)
        throw new Error('Emoción no encontrada');
    //los hábitos existen
    for (const habitId of data.habits) {
        const habit = await recordRepository.findHabitById(habitId);
        if (!habit)
            throw new Error(`Hábito no encontrado: ${habitId}`);
    }
    //no habitos de la misma categoria (o sea no dos habitos)
    const categoriesUsed = new Set();
    for (const habitId of data.habits) {
        const habit = await recordRepository.findHabitById(habitId);
        if (!habit)
            throw new Error(`Hábito no encontrado: ${habitId}`);
        if (categoriesUsed.has(habit.id_category)) {
            throw new Error('No puedes seleccionar dos hábitos de la misma categoría');
        }
        categoriesUsed.add(habit.id_category);
    }
    return recordRepository.createRecord({
        date: recordDate,
        note: data.note,
        id_user: userId,
        id_emotion: data.id_emotion,
        habits: data.habits
    });
};
exports.createRecord = createRecord;
const getRecordsByMonth = async (firebaseUid, year, month) => {
    if (!year || !month)
        throw new Error('Año y mes son obligatorios');
    if (month < 1 || month > 12)
        throw new Error('Mes inválido');
    const userId = await getUserId(firebaseUid);
    return recordRepository.findRecordsByMonth(userId, year, month);
};
exports.getRecordsByMonth = getRecordsByMonth;
const getRecordByDate = async (firebaseUid, date) => {
    if (!date)
        throw new Error('La fecha es obligatoria');
    const recordDate = new Date(date);
    if (isNaN(recordDate.getTime()))
        throw new Error('Fecha inválida');
    const userId = await getUserId(firebaseUid);
    const record = await recordRepository.findRecordByDate(userId, recordDate);
    if (!record)
        return null; // el controller maneja el mensaje
    return record;
};
exports.getRecordByDate = getRecordByDate;
const getMonthPreview = async (firebaseUid, year, month) => {
    if (!year || !month)
        throw new Error('Año y mes son obligatorios');
    if (month < 1 || month > 12)
        throw new Error('Mes inválido');
    const userId = await getUserId(firebaseUid);
    return recordRepository.findPreviewByMonth(userId, year, month);
};
exports.getMonthPreview = getMonthPreview;
//# sourceMappingURL=record.services.js.map