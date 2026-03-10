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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFavorites = exports.removeFavorite = exports.addFavorite = exports.deleteEmotion = exports.createEmotion = exports.getExploreEmotions = exports.emotionList = void 0;
const emotionRepository = __importStar(require("../repositories/emotion.repositories"));
const firebase_1 = __importDefault(require("../../config/firebase"));
const bucket = firebase_1.default.storage().bucket();
//ayuda a validar antes de cada una
const getUserId = async (firebaseUid) => {
    const user = await emotionRepository.findUserByFirebaseUid(firebaseUid);
    if (!user)
        throw new Error('Usuario no encontrado en la BD');
    return user.id;
};
const uploadImageToFirebase = async (file) => {
    const fileName = `emotions/${Date.now()}_${file.originalname}`;
    const fileUpload = bucket.file(fileName);
    await fileUpload.save(file.buffer, {
        metadata: { contentType: file.mimetype }
    });
    await fileUpload.makePublic();
    return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
};
const emotionList = async (firebaseUid) => {
    const userId = await getUserId(firebaseUid);
    return emotionRepository.findAllForUser(userId);
};
exports.emotionList = emotionList;
const getExploreEmotions = async (firebaseUid) => {
    const userId = await getUserId(firebaseUid);
    return emotionRepository.findCustomByOthers(userId);
};
exports.getExploreEmotions = getExploreEmotions;
const createEmotion = async (data, firebaseUid, imageFile) => {
    if (!data.name || !data.id_category)
        throw new Error('El nombre y la categoría son obligatorios');
    if (!imageFile)
        throw new Error('La imagen es obligatoria');
    const userId = await getUserId(firebaseUid);
    const img_url = await uploadImageToFirebase(imageFile);
    const emotion = await emotionRepository.create({
        name: data.name,
        img_url,
        users: { connect: { id: userId } },
        categories: { connect: { id: Number(data.id_category) } }
    });
    if (data.save_to_favorites === 'true') {
        await emotionRepository.addFavorite(userId, emotion.id);
    }
    return emotion;
};
exports.createEmotion = createEmotion;
const deleteEmotion = async (id, firebaseUid) => {
    const userId = await getUserId(firebaseUid);
    const emotion = await emotionRepository.findById(id);
    if (!emotion)
        throw new Error('Emoción no encontrada');
    if (emotion.id_user !== userId)
        throw new Error('No tienes permiso para eliminar esta emoción');
    return emotionRepository.deleteById(id);
};
exports.deleteEmotion = deleteEmotion;
const addFavorite = async (firebaseUid, idEmotion) => {
    const userId = await getUserId(firebaseUid);
    const emotion = await emotionRepository.findById(idEmotion);
    if (!emotion)
        throw new Error('Emoción no encontrada');
    return emotionRepository.addFavorite(userId, idEmotion);
};
exports.addFavorite = addFavorite;
const removeFavorite = async (firebaseUid, idEmotion) => {
    const userId = await getUserId(firebaseUid);
    return emotionRepository.removeFavorite(userId, idEmotion);
};
exports.removeFavorite = removeFavorite;
const getFavorites = async (firebaseUid) => {
    const userId = await getUserId(firebaseUid);
    return emotionRepository.findFavoritesByUser(userId);
};
exports.getFavorites = getFavorites;
//# sourceMappingURL=emotion.services.js.map