// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCf8OyCsg_8TEhUhuJ7Ic8CD_QtMIEpd0w",
  authDomain: "pantry-tracker-5f8f9.firebaseapp.com",
  projectId: "pantry-tracker-5f8f9",
  storageBucket: "pantry-tracker-5f8f9.appspot.com",
  messagingSenderId: "129562886499",
  appId: "1:129562886499:web:81b6a155ed820542b75356",
  measurementId: "G-X32DJDKRP8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const firestore = getFirestore(app)

export{firestore}