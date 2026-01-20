import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCqAIRclfRtZoPIfaqaQBn72UtspU_jX08",
    authDomain: "loopin-b5d11.firebaseapp.com",
    projectId: "loopin-b5d11",
    storageBucket: "loopin-b5d11.firebasestorage.app",
    messagingSenderId: "721750012874",
    appId: "1:721750012874:web:0a00c42375d2a5d3269533",
    measurementId: "G-25Z4F8SG9D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, analytics, db, auth };
