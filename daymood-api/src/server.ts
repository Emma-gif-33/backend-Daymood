import app from './app';
import { insertSnapshot } from './bigQueryService/bigquery.service';

const PORT = 3000;

app.listen(PORT, async () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);

    // try {
    //     await insertSnapshot();
    // } catch (error: any) {
    //     console.error('❌ Error enviando snapshot inicial a BigQuery:', error.message);
    // }
});