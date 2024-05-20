// lib/firebase.ts
import admin from "firebase-admin";

const serviceAccount = require("./.fbconfig.json");
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

const config = {
  credential: admin.credential.cert(serviceAccount),
};

export const firebase = admin.apps.length
  ? admin.app()
  : admin.initializeApp(config);
