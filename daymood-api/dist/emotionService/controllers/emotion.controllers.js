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
exports.removeFavorite = exports.addFavorite = exports.getFavorites = exports.deleteEmotion = exports.create = exports.explore = exports.getAll = void 0;
const emotionService = __importStar(require("../services/emotion.services"));
// categoriass
const EMOTION_CATEGORIES = [8, 9, 10, 11, 12, 13, 14, 15];
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'];
const getAll = async (req, res, next) => {
    try {
        const emotions = await emotionService.emotionList(req.user.uid);
        res.json({ success: true, data: emotions });
    }
    catch (error) {
        next(error);
    }
};
exports.getAll = getAll;
const explore = async (req, res, next) => {
    try {
        const emotions = await emotionService.getExploreEmotions(req.user.uid);
        res.json({ success: true, data: emotions });
    }
    catch (error) {
        next(error);
    }
};
exports.explore = explore;
const create = async (req, res, next) => {
    try {
        const { name, id_category, save_to_favorites } = req.body;
        // Validar campos obligatorios
        if (!name || !id_category) {
            return res.status(400).json({
                success: false,
                message: 'El nombre y la categoría son obligatorios'
            });
        }
        // Validar que haya imagen
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'La imagen es obligatoria'
            });
        }
        // Validar formato de imagen
        if (!ALLOWED_IMAGE_TYPES.includes(req.file.mimetype)) {
            return res.status(400).json({
                success: false,
                message: 'Formato de imagen no válido. Solo se permiten: JPG, PNG, WEBP, GIF'
            });
        }
        // Validar longitud del nombre
        if (name.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: 'El nombre debe tener al menos 2 caracteres'
            });
        }
        if (name.trim().length > 30) {
            return res.status(400).json({
                success: false,
                message: 'El nombre no puede tener más de 30 caracteres'
            });
        }
        // Validar que la categoría sea de emociones (8-15)
        const categoryId = parseInt(id_category);
        if (isNaN(categoryId) || !EMOTION_CATEGORIES.includes(categoryId)) {
            return res.status(400).json({
                success: false,
                message: 'La categoría debe ser una categoría de emoción válida (Alegría, Tristeza, Ira, Miedo, Amor, Desagrado, Vergüenza o Culpa)'
            });
        }
        const emotion = await emotionService.createEmotion(req.body, req.user.uid, req.file);
        res.status(201).json({ success: true, data: emotion });
    }
    catch (error) {
        next(error);
    }
};
exports.create = create;
const deleteEmotion = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ success: false, message: 'ID de emoción requerido' });
        }
        await emotionService.deleteEmotion(id, req.user.uid);
        res.json({ success: true, message: 'Emoción eliminada' });
    }
    catch (error) {
        if (error.message === 'Emoción no encontrada') {
            return res.status(404).json({ success: false, message: error.message });
        }
        if (error.message === 'No tienes permiso para eliminar esta emoción') {
            return res.status(403).json({ success: false, message: error.message });
        }
        next(error);
    }
};
exports.deleteEmotion = deleteEmotion;
const getFavorites = async (req, res, next) => {
    try {
        const favorites = await emotionService.getFavorites(req.user.uid);
        res.json({ success: true, data: favorites });
    }
    catch (error) {
        next(error);
    }
};
exports.getFavorites = getFavorites;
const addFavorite = async (req, res, next) => {
    try {
        const id = req.params.id?.trim();
        if (!id) {
            return res.status(400).json({ success: false, message: 'ID de emoción requerido' });
        }
        await emotionService.addFavorite(req.user.uid, id);
        res.status(201).json({ success: true, message: 'Agregado a favoritos' });
    }
    catch (error) {
        if (error.message === 'Emoción no encontrada') {
            return res.status(404).json({ success: false, message: error.message });
        }
        next(error);
    }
};
exports.addFavorite = addFavorite;
const removeFavorite = async (req, res, next) => {
    try {
        const id = req.params.id?.trim();
        if (!id) {
            return res.status(400).json({ success: false, message: 'ID de emoción requerido' });
        }
        await emotionService.removeFavorite(req.user.uid, id);
        res.json({ success: true, message: 'Eliminado de favoritos' });
    }
    catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({
                success: false,
                message: 'Este favorito no existe o ya fue eliminado'
            });
        }
        next(error);
    }
};
exports.removeFavorite = removeFavorite;
//# sourceMappingURL=emotion.controllers.js.map