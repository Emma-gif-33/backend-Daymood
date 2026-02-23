import express from 'express';

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

// Catch-all para rutas no encontradas
app.use((req, res) => {
    console.log(`Ruta no encontrada: ${req.method} ${req.path}`);
    res.status(404).json({ error: 'Ruta no encontrada' });
});

export default app;