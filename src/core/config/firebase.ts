import { initializeApp } from 'firebase/app';
import { initializeAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';

// getReactNativePersistence is available at runtime but types may lag behind
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getReactNativePersistence } = require('firebase/auth');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const AsyncStorage = require('@react-native-async-storage/async-storage').default;

const firebaseConfig = {
  apiKey: 'AIzaSyCaunPAcMMvZ8_Wz2TFx3MFvz3LJt0hgWg',
  authDomain: 'task-management-app-b051a.firebaseapp.com',
  projectId: 'task-management-app-b051a',
  storageBucket: 'task-management-app-b051a.firebasestorage.app',
  messagingSenderId: '370512729399',
  appId: '1:370512729399:web:23f9e18eac7d90884af6b2',
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// experimentalForceLongPolling fixes "Unexpected state (ID: 3186)" on React Native.
// The default WebSocket transport is incompatible with RN's JS runtime — long polling is stable.
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

export default app;

