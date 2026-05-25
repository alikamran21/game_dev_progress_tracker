// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
 
const firebaseConfig = {
  apiKey: "AIzaSyBh9aypQIcNZGmAZkU5B7thL5gBUiDIdH8",
  authDomain: "unity-progresstracker.firebaseapp.com",
  databaseURL: "https://unity-progresstracker-default-rtdb.firebaseio.com",
  projectId: "unity-progresstracker",
  storageBucket: "unity-progresstracker.firebasestorage.app",
  messagingSenderId: "939700256642",
  appId: "1:939700256642:web:3f6aa50a3b751dcb89199b",
};
 
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export default app;
