import admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

if (!admin.apps.length) {
    let serviceAccount: any;
    if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
        const serviceAccountPath = path.resolve(process.cwd(), process.env.FIREBASE_SERVICE_ACCOUNT_PATH);

        if (fs.existsSync(serviceAccountPath)) {
            serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
            console.log("✅ Firebase cargado desde archivo JSON.");
        } else {
            console.error("No se encontró el JSON en:", serviceAccountPath);
        }
    }

    if (!serviceAccount && process.env.FIREBASE_SERVICE_ACCOUNT) {
        try {
            serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
            console.log("Firebase cargado desde variable de entorno.");
        } catch (e) {
            console.error("Error al parsear FIREBASE_SERVICE_ACCOUNT JSON");
        }
    }

    if (!serviceAccount) {
        console.error("No se encontró configuración de Firebase. Revisa las variables de entorno.");
        process.exit(1);
    }

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
}

export default admin;