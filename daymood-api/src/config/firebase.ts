import admin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();

if (!admin.apps.length) {
    const saConfig = process.env.FIREBASE_SERVICE_ACCOUNT;

    if (!saConfig) {
        process.exit(1);
    }

    try {
        const serviceAccount = JSON.parse(saConfig);

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        });
    } catch (e) {
        process.exit(1);
    }
}

export default admin;