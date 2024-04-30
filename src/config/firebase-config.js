// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import{ getAuth, GithubAuthProvider, GoogleAuthProvider } from 'firebase/auth';
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDTYpcmbd0YQWNu_01qJpTgk1-zFHUgJpU",
  authDomain: "tesla-location-lia.firebaseapp.com",
  projectId: "tesla-location-lia",
  storageBucket: "tesla-location-lia.appspot.com",
  messagingSenderId: "56858737173",
  appId: "1:56858737173:web:aa6a8293c3ffcb0e08ec1c",
  measurementId: "G-FMJD17S3NG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();//google log in
export const db = getFirestore(app);
