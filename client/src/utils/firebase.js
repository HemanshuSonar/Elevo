
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "elevo-e319a.firebaseapp.com",
  projectId: "elevo-e319a",
  storageBucket: "elevo-e319a.firebasestorage.app",
  messagingSenderId: "178167834914",
  appId: "1:178167834914:web:b63a22c7b69ca571f69d7b"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider()

export {auth , provider}