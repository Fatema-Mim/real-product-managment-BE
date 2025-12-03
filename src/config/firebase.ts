import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!privateKey) {
  throw new Error("Firebase private key missing in .env");
}

export const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: privateKey,
  }),
});

export const db = admin.firestore();
