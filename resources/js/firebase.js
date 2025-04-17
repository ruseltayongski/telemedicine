import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyB7Epl_VSU8H1sN8rH9J-kENGtdOIDfsYM",
    authDomain: "telemedicinethesis-27316.firebaseapp.com",
    databaseURL: "https://telemedicinethesis-27316-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "telemedicinethesis-27316",
    storageBucket: "telemedicinethesis-27316.firebasestorage.app",
    messagingSenderId: "554743062964",
    appId: "1:554743062964:web:244a2183f8a4c3af2b12e1",
    measurementId: "G-H24X2N4E9E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

export { app, database, auth };