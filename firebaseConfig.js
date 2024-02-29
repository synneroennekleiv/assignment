import { initializeApp } from "firebase/app"
import { getFirestore } from "@firebase/firestore"

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCh5IjFC1CnmbGJHxx6rhz3hZIfPvvkFMs",
    authDomain: "crud-fd5f0.firebaseapp.com",
    projectId: "crud-fd5f0",
    storageBucket: "crud-fd5f0.appspot.com",
    messagingSenderId: "162627165659",
    appId: "1:162627165659:web:d7ed195ae84bc92f58dbfe",
    measurementId: "G-SSB9BBF5F9"
};

// initialize firebase
const app = initializeApp(firebaseConfig);
// initialize database
export const db = getFirestore(app);