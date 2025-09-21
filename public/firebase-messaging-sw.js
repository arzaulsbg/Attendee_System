// [START initialize_firebase_in_sw]
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDh4A5HDcaKlEjfDXwQcsW-tW6ZSd664S0",
  authDomain: "system-1acc3.firebaseapp.com",
  projectId: "system-1acc3",
  storageBucket: "system-1acc3.appspot.com",
  messagingSenderId: "442841417216",
  appId: "1:442841417216:web:9cd596a9587353bdbf3ae5",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: '/favicon.ico',
  });
});
// [END initialize_firebase_in_sw]
