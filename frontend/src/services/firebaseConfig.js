// Firebase configuration for the Sri Sudha application
// This enables real-time features, authentication, and analytics

import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, logEvent } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'srisudha-demo.firebaseapp.com',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'srisudha-demo',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'srisudha-demo.appspot.com',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || 'demo-sender-id',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || 'demo-app-id',
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || 'demo-measurement-id'
};

// Initialize Firebase
let app;
let auth;
let db;
let storage;
let analytics;

try {
  app = initializeApp(firebaseConfig);
  
  // Initialize Authentication
  auth = getAuth(app);
  setPersistence(auth, browserLocalPersistence).catch(error => {
    console.warn('Firebase persistence error:', error);
  });
  
  // Initialize Firestore
  db = getFirestore(app);
  enableIndexedDbPersistence(db).catch(error => {
    console.warn('Firestore persistence error:', error);
  });
  
  // Initialize Storage
  storage = getStorage(app);
  
  // Initialize Analytics
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
}

// Export services
export { app, auth, db, storage, analytics };

// Utility function to log events
export const logCustomEvent = (eventName, eventData = {}) => {
  try {
    if (analytics) {
      logEvent(analytics, eventName, eventData);
    }
  } catch (error) {
    console.error('Error logging event:', error);
  }
};

// Custom hooks and utilities for Firebase
export const isFirebaseInitialized = () => {
  return !!(app && auth && db && storage);
};
