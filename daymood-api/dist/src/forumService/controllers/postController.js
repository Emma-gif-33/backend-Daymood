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
exports.deletePost = exports.update = exports.getById = exports.createNewPost = void 0;
const postService = __importStar(require("../services/postService"));
// postController.ts
const createNewPost = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user || !user.id) {
            console.error("DEBUG: req.user no llegó al postController");
            return res.status(401).json({ message: "Usuario no identificado" });
        }
        const { title, content, id_category, id_forum } = req.body;
        const newPost = await postService.createPost({
            title,
            content,
            id_category,
            id_forum,
            id_user: user.id // Aquí es donde tronaba
        });
        res.status(201).json(newPost);
    }
    catch (error) {
        next(error);
    }
};
exports.createNewPost = createNewPost;
const getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (typeof id !== 'string') {
            return res.status(404).json({ message: "ID inválido, intente con uno existente." });
        }
        const post = await postService.getPostById(id);
        res.json(post);
    }
    catch (error) {
        next(error);
    }
};
exports.getById = getById;
const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedPost = await postService.updatePost(id, req.user.id, req.body);
        res.json(updatedPost);
    }
    catch (error) {
        next(error);
    }
};
exports.update = update;
const deletePost = async (req, res, next) => {
    try {
        const { id } = req.params;
        await postService.deletePost(id, req.user.id);
        res.json({ message: "La publicación se ha eliminado correctamente" });
    }
    catch (error) {
        next(error);
    }
};
exports.deletePost = deletePost;
//# sourceMappingURL=postController.js.map