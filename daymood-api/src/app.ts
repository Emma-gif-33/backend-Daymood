import express from 'express';
import { verifyToken, AuthRequest } from './middlewares/auth.middleware';
import { Response } from 'express';
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

app.use(express.json());

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

app.use('/api/v1/bigquery', bigQueryRoutes);

// Catch-all para rutas no encontradas
app.use((req, res) => {
    console.log(`Ruta no encontrada: ${req.method} ${req.path}`);
    res.status(404).json({ error: 'Ruta no encontrada' });
});

export default app;