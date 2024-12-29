import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, setConsent } from 'firebase/analytics';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAPYSt1tK4oo-zY_kHeHJ2-MDfEVa1RBXw",
    authDomain: "recipe-book-5d22b.firebaseapp.com",
    projectId: "recipe-book-5d22b",
    storageBucket: "recipe-book-5d22b.firebasestorage.app",
    messagingSenderId: "176469682007",
    appId: "1:176469682007:web:7eb43ac41176593335c012",
    measurementId: "G-Y80STJDST6"
  };
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics with consent settings
const analytics = getAnalytics(app);
setConsent({
  analytics_storage: 'granted',
  ad_storage: 'denied',
  functionality_storage: 'granted',
  personalization_storage: 'denied',
  security_storage: 'granted',
});

// Optional: Add cookie consent banner
const initializeCookieConsent = () => {
  if (typeof window !== 'undefined') {
    // Check if user has already given consent
    const hasConsent = localStorage.getItem('cookieConsent');
    if (!hasConsent) {
      // Show cookie consent banner
      showCookieConsentBanner();
    }
  }
};

export { analytics, initializeCookieConsent };
