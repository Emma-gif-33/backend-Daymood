import admin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT as string
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;