import express from 'express';
import cors from 'cors';
import { verifyToken, AuthRequest } from './middlewares/auth.middleware';
import { Response } from 'express';
import { errorHandler } from './middlewares/error.middlewares';
import { requestLogger } from './middlewares/logger.middleware';
import { generalLimiter, authLimiter, bigqueryLimiter } from './middlewares/rateLimit.middleware';
import { verifyApiKey } from './middlewares/apiKey.middleware';

import recordsRoutes from './recordService/routes/record.routes';
import userRoutes from './userService/routes/user.routes'
import forumRoutes from "./forumService/routes/forumRoutes";
import postRoutes from "./forumService/routes/postRoutes";
import commentRoutes from "./forumService/routes/commentRoutes";
import formRoutes from "./formService/route/form.routes";
import multer from 'multer'
import emotionRoutes from "./emotionService/routes/emotion.routes";
import statsRoutes from "./analiticsService/routes/statsRoutes";
import bigQueryRoutes from './bigQueryService/bigquery.routes';


const app = express();
// app.use(generalLimiter);
app.use(cors());
app.use(express.json());
app.use(requestLogger);


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
app.get('/test-token', verifyToken, (req: AuthRequest, res: Response) => {
    res.json({
        success: true,
        message: 'Token válido',
        uid: req.user!.uid,
        email: req.user!.email
    });
});
//const upload = multer({ storage: multer.memoryStorage() });



app.post('/auth/register', verifyToken, (req: AuthRequest, res: Response) => {
    console.log('UID del token:', req.user!.uid);
    console.log('Body recibido:', req.body);

    res.json({
        success: true,
        message: 'Token verificado correctamente',
        uid: req.user!.uid,
        email: req.user!.email,
        bodyRecibido: req.body
    });
});

app.use('/api/records', recordsRoutes);
app.use('/api/users', userRoutes)

const upload = multer({ storage: multer.memoryStorage() })

app.use('/api/forums', forumRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/emotions', emotionRoutes);
app.use('/api/stats', statsRoutes);

app.use('/api/bigquery', verifyApiKey, bigqueryLimiter, bigQueryRoutes);

// Catch-all para rutas no encontradas
app.use((req, res) => {
    console.log(`Ruta no encontrada: ${req.method} ${req.path}`);
    res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use((err: any, req: any, res: any, next: any) => {
    console.error('GLOBAL ERROR CAUGHT:', err.message, err.stack);
    next(err);
});

app.use(errorHandler)
export default app;