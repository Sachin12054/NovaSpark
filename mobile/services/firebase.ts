import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
  type Auth,
} from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyDummyKeyForNovaSparkDemo123456",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "novaspark-c1883.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "novaspark-c1883",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "novaspark-c1883.firebasestorage.app",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef123456",
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || ""
};

// 1. Singleton Firebase App
const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// 2. Safe Dynamic AsyncStorage Resolution to prevent Metro bundler failure
let AsyncStorage: any = null;
try {
  const mod = '@react-native-async-storage/async-storage';
  const req = typeof require !== 'undefined' ? require : null;
  if (req) {
    const loaded = req(mod);
    AsyncStorage = loaded?.default || loaded;
  }
} catch (e) {
  // Package not present in local node_modules
}

// 3. Canonical Singleton Firebase Auth with AsyncStorage Persistence
let auth: Auth;
try {
  if (AsyncStorage && typeof getReactNativePersistence === 'function') {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } else {
    auth = getAuth(app);
  }
} catch (e) {
  try {
    auth = getAuth(app);
  } catch (err) {
    auth = null as any;
  }
}

// 4. Singleton Firestore
let firestore: Firestore;
try {
  firestore = getFirestore(app);
} catch (e) {
  firestore = null as any;
}

export { app, auth, firestore };
