// Firebase Web Push Notification Setup
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export function requestFirebaseNotificationPermission() {
  return Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      return getToken(messaging, { vapidKey: 'YOUR_VAPID_KEY' });
    }
    throw new Error('Notification permission not granted');
  });
}

export function onFirebaseMessage(callback: (payload: any) => void) {
  onMessage(messaging, callback);
}
