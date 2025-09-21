import { messaging } from '@/lib/firebase';
import { getToken, onMessage } from 'firebase/messaging';

const VAPID_KEY = '<YOUR_PUBLIC_VAPID_KEY_HERE>'; // Replace with your Firebase project's public VAPID key

export async function requestNotificationPermission(): Promise<string | null> {
  if (!messaging) return null;
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, { vapidKey: VAPID_KEY });
      return token;
    }
    return null;
  } catch (error) {
    console.error('Unable to get permission to notify.', error);
    return null;
  }
}

export function onForegroundMessage(callback: (payload: any) => void) {
  if (!messaging) return;
  onMessage(messaging, callback);
}
