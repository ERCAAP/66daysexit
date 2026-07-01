import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Firebase config - Use environment variables in production
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "REDACTED",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "daysexit.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "daysexit",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "daysexit.firebasestorage.app",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "901615538631",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:901615538631:web:de981ed614c182e54bc9e2",
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-6WYQT4KCBG"
};

// Validate Firebase configuration in development
if (__DEV__ && firebaseConfig.projectId === "daysexit") {
  console.log('🔥 Firebase: Using production configuration for daysexit project');
}

let app;
let auth;
let db;
let analytics;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  
  // Initialize Firebase Auth
  auth = getAuth(app);
  
  // Initialize Firestore
  db = getFirestore(app);
  
  // Initialize Analytics (only on web platforms that support it)
  if (typeof window !== 'undefined') {
    isSupported().then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
        console.log('🔥 Firebase Analytics initialized');
      }
    });
  }
  
  console.log('🔥 Firebase initialized successfully for daysexit project');
} catch (error) {
  console.error('🔥 Firebase initialization error:', error);
  
  // In development, provide helpful error message
  if (__DEV__) {
    console.error(
      'Firebase initialization failed. Please check:\n' +
      '1. Firebase project configuration\n' +
      '2. Authentication and Firestore are enabled\n' +
      '3. Network connection is available'
    );
  }
  
  throw error;
}

export { auth, db, app, analytics }; 