import admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

if (!admin.apps.length) {
    let serviceAccount;

    const envPath = path.resolve(__dirname, '../../.env');
    const envConfig = fs.readFileSync(envPath, 'utf8');

    const result = dotenv.config({path: envPath});

    if (result.error) {
        console.error("❌ Error cargando dotenv:", result.error);
    }

    if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
        const serviceAccountPath = path.resolve(process.cwd(), process.env.FIREBASE_SERVICE_ACCOUNT_PATH);

        console.log("📂 Intentando abrir llaves en:", serviceAccountPath);

        if (!fs.existsSync(serviceAccountPath)) {
            console.error("❌ ¡El archivo JSON de Firebase no está en esa ruta!");
            process.exit(1);
        }

        serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

    } else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    }

    if (!serviceAccount) {
        console.error("No se encontró configuración de Firebase (Path o JSON)");
        process.exit(1);
    }

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
}

export default admin;