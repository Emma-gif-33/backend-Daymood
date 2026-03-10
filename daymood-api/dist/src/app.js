"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("./middlewares/auth.middleware");
const record_routes_1 = __importDefault(require("./recordService/routes/record.routes"));
const user_routes_1 = __importDefault(require("./userService/routes/user.routes"));
const forumRoutes_1 = __importDefault(require("./forumService/routes/forumRoutes"));
const postRoutes_1 = __importDefault(require("./forumService/routes/postRoutes"));
const commentRoutes_1 = __importDefault(require("./forumService/routes/commentRoutes"));
const form_routes_1 = __importDefault(require("./formService/route/form.routes"));
const multer_1 = __importDefault(require("multer"));
const emotion_routes_1 = __importDefault(require("./emotionService/routes/emotion.routes"));
const statsRoutes_1 = __importDefault(require("./analiticsService/routes/statsRoutes"));
const bigquery_routes_1 = __importDefault(require("./bigQueryService/bigquery.routes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Log para ver todas las peticiones
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    console.log('Body:', req.body);
    next();
});
app.get('/', (req, res) => {
    res.json({ message: 'Si jala' });
});
// Ruta de prueba — verifica que el token funciona
app.get('/test-token', auth_middleware_1.verifyToken, (req, res) => {
    res.json({
        success: true,
        message: 'Token válido',
        uid: req.user.uid,
        email: req.user.email
    });
});
app.post('/auth/register', auth_middleware_1.verifyToken, (req, res) => {
    console.log('UID del token:', req.user.uid);
    console.log('Body recibido:', req.body);
    res.json({
        success: true,
        message: 'Token verificado correctamente',
        uid: req.user.uid,
        email: req.user.email,
        bodyRecibido: req.body
    });
});
app.use('/api/records', record_routes_1.default);
app.use('/api/users', user_routes_1.default);
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
app.use('/api/forums', forumRoutes_1.default);
app.use('/api/posts', postRoutes_1.default);
app.use('/api/comments', commentRoutes_1.default);
app.use('/api/forms', form_routes_1.default);
app.use('/api/emotions', emotion_routes_1.default);
app.use('/api/stats', statsRoutes_1.default);
app.use('/api/bigquery', bigquery_routes_1.default);
// Catch-all para rutas no encontradas
app.use((req, res) => {
    console.log(`Ruta no encontrada: ${req.method} ${req.path}`);
    res.status(404).json({ error: 'Ruta no encontrada' });
});
exports.default = app;
//# sourceMappingURL=app.js.map