import { getFirestore, collection, getDocs } from 'firebase/firestore';

import { initializeApp } from "firebase/app";
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
const db = getFirestore(app);

export const fetchCollectionData = async (collectionName: string) => {
  const collectionRef = collection(db, collectionName);
  const snapshot = await getDocs(collectionRef);
  const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return data;
};
