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
exports.getFullForumContent = exports.getForumsByCategory = void 0;
const forumRepository = __importStar(require("../repositories/forumRepository"));
const getAgeRange = (age) => {
    if (age >= 18 && age <= 20)
        return { min: 18, max: 20 };
    if (age >= 21 && age <= 23)
        return { min: 21, max: 23 };
    if (age >= 24 && age <= 60)
        return { min: 24, max: 60 };
    // Rango por defecto
    return { min: 24, max: 60 };
};
const getForumsByCategory = async (categoryId, userAge) => {
    const targetRange = getAgeRange(userAge);
    const forums = await forumRepository.findAvailableForums(categoryId);
    return forums.filter((f) => f.min_age === targetRange.min && f.max_age === targetRange.max);
};
exports.getForumsByCategory = getForumsByCategory;
const getFullForumContent = async (forumId) => {
    const forum = await forumRepository.getForumInfo(forumId);
    if (!forum)
        throw new Error("Foro no encontrado");
    return forum;
};
exports.getFullForumContent = getFullForumContent;
//# sourceMappingURL=forumService.js.map