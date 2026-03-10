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
exports.getDetails = exports.getAvailable = void 0;
const forumService = __importStar(require("../services/forumService"));
const getAvailable = async (req, res, next) => {
    try {
        const { categoryId } = req.params;
        const user = req.user;
        if (!req.user || req.user.age === undefined) {
            console.error("ERROR: El middleware no inyectó la edad. req.user es:", req.user);
            return res.status(401).json({ message: "No se pudo determinar la edad del usuario" });
        }
        const forums = await forumService.getForumsByCategory(Number(categoryId), user.age);
        res.json(forums);
    }
    catch (error) {
        next(error);
    }
};
exports.getAvailable = getAvailable;
const getDetails = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (typeof id !== 'string') {
            return res.status(404).json({ message: "ID inválido, intente con uno existente." });
        }
        const forum = await forumService.getFullForumContent(id);
        res.json(forum);
    }
    catch (error) {
        next(error);
    }
};
exports.getDetails = getDetails;
//# sourceMappingURL=forumController.js.map