import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBb5SG2xCWg_Wd-RE5Xv9so5-M8OfM6vmA",
  authDomain: "speakpoint-e9594.firebaseapp.com",
  databaseURL: "https://speakpoint-e9594-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "speakpoint-e9594",
  storageBucket: "speakpoint-e9594.appspot.com",
  messagingSenderId: "502535491076",
  appId: "1:502535491076:web:ced8b3eb1aa799b25a6f51",
  measurementId: "G-7HNHJG4V14"
};

// Alusta Firebase
const app = initializeApp(firebaseConfig);

// Alusta Realtime Database
const database = getDatabase(app);

export { database };
