// Firebase configuration
// Note: You'll need to replace these with your actual Firebase project credentials
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCqeIGS74IODcN_6s6K0uUB3O2Y1OenJok",
  authDomain: "cleactadh-laethuil-cd83e.firebaseapp.com",
  projectId: "cleactadh-laethuil-cd83e",
  storageBucket: "cleactadh-laethuil-cd83e.firebasestorage.app",
  messagingSenderId: "365635527375",
  appId: "1:365635527375:web:574371043372add387cdba",
  measurementId: "G-6S7NGTVWHL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { auth, db };

