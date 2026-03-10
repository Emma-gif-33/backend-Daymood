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
exports.deletePost = exports.updatePost = exports.getPostById = exports.createPost = void 0;
const postRepository = __importStar(require("../repositories/postRepository"));
const createPost = async (postData) => {
    return await postRepository.create(postData);
};
exports.createPost = createPost;
const getPostById = async (id) => {
    const post = await postRepository.findById(id);
    if (!post) {
        throw new Error("Post no encontrado");
    }
    return post;
};
exports.getPostById = getPostById;
const updatePost = async (postId, userId, updateData) => {
    const post = await postRepository.findById(postId);
    if (!post)
        throw new Error("Post no encontrado");
    if (post.id_user !== userId) {
        throw new Error("No tienes permiso para modificar este post");
    }
    return await postRepository.update(postId, updateData);
};
exports.updatePost = updatePost;
const deletePost = async (postId, userId) => {
    const post = await postRepository.findById(postId);
    if (!post)
        throw new Error("Post no encontrado");
    if (post.id_user !== userId) {
        throw new Error("No tienes permiso para eliminar este post");
    }
    return await postRepository.remove(postId);
};
exports.deletePost = deletePost;
//# sourceMappingURL=postService.js.map