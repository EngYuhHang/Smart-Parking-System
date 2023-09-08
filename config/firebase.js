// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA48kHT-bFm_EWoaRuxDyEbMvkIYWV8Z4I",
  authDomain: "ezpark-26995.firebaseapp.com",
  databaseURL: "https://ezpark-26995-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ezpark-26995",
  storageBucket: "ezpark-26995.appspot.com",
  messagingSenderId: "524725136869",
  appId: "1:524725136869:web:9a0c1e34fe869c9b5e930c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//initialize authorization
export const auth = getAuth(app);

//initialize database
export const fires = getFirestore(app);