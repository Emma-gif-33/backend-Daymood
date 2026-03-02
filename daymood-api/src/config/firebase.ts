// firebase.ts
import admin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();

if (!admin.apps.length) {
    const saConfig = process.env.FIREBASE_SERVICE_ACCOUNT;

    if (!saConfig) {
        console.error("❌ ERROR: La variable FIREBASE_SERVICE_ACCOUNT no está definida en el .env");
        process.exit(1); // Detiene el proceso con error claro
    }

    try {
        const serviceAccount = JSON.parse(saConfig);

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        });
        console.log("✅ Firebase inicializado correctamente");
    } catch (e) {
        console.error("❌ ERROR: El contenido de FIREBASE_SERVICE_ACCOUNT no es un JSON válido");
        console.log("Contenido recibido:", saConfig.substring(0, 20) + "..."); // Solo mostramos el inicio por seguridad
        process.exit(1);
    }
}

export default admin;