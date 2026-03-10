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
exports.loginUser = exports.registerUser = void 0;
const userRepository = __importStar(require("../repositories/user.repositories"));
const registerUser = async (data) => {
    if (!data.firebase_uid || !data.username || !data.email || !data.birth_day) {
        throw new Error('Todos los campos son obligatorios');
    }
    // Verificar que no exista ya
    const existing = await userRepository.findByFirebaseUid(data.firebase_uid);
    if (existing)
        throw new Error('El usuario ya existe');
    return userRepository.createUser(data);
};
exports.registerUser = registerUser;
const loginUser = async (firebase_uid) => {
    const user = await userRepository.findByFirebaseUid(firebase_uid);
    if (!user)
        throw new Error('Usuario no encontrado en la BD');
    return user;
};
exports.loginUser = loginUser;
//# sourceMappingURL=user.services.js.map