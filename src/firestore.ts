import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { addDoc, collection, getFirestore, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_APP_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_APP_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export interface PlayerScore {
  name: string;
  score: number;
}

export interface FirestoreConfig {
  userId: string;
  docRef: string;
}

export async function authenticateAnonymously() {
  return signInAnonymously(getAuth(app));
}

export async function addScoreboardItem(item: PlayerScore, scoreboardId: string, userId: string) {
  const itemsColRef = collection(db, 'scoreboard', scoreboardId, 'items');

  return addDoc(itemsColRef, {
    name: item.name,
    score: item.score,
    createdAt: serverTimestamp(),
    createdBy: userId,
  });
}
