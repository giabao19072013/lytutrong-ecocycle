import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "gen-lang-client-0430726814",
  appId: "1:653266233858:web:cebce1fcd62e1991b5951b",
  apiKey: "AIzaSyCa2TOvLgA5lpdS13S0GzMmZRwYh0hGG-I",
  authDomain: "gen-lang-client-0430726814.firebaseapp.com",
  storageBucket: "gen-lang-client-0430726814.firebasestorage.app",
  messagingSenderId: "653266233858",
};

const databaseId = "ai-studio-ecocycleschool-e4d54e88-fef9-4277-a0f3-891f7b266980";

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, databaseId);
