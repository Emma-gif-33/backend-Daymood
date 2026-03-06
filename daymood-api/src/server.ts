import app from './app';
import { insertSnapshot } from './bigQueryService/bigquery.service';

const PORT = 3000;

app.listen(PORT, async () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});