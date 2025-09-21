import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyDh4A5HDcaKlEjfDXwQcsW-tW6ZSd664S0",
  authDomain: "system-1acc3.firebaseapp.com",
  projectId: "system-1acc3",
  storageBucket: "system-1acc3.appspot.com",
  messagingSenderId: "442841417216",
  appId: "1:442841417216:web:9cd596a9587353bdbf3ae5",
  measurementId: "G-VC670Q10W6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize messaging for push notifications (only in supported environments)
let messaging = null;
try {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    messaging = getMessaging(app);
  }
} catch (error) {
  console.log('Firebase messaging not supported in this environment');
}

export { messaging };
export default app;