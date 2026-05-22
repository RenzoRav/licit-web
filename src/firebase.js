import { initializeApp } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyA7Oc6uJH5iwgadkhhqVVs293RiI_4KU0k',
  authDomain: 'licit-project.firebaseapp.com',
  projectId: 'licit-project',
  storageBucket: 'licit-project.firebasestorage.app',
  messagingSenderId: '99574854179',
  appId: '1:99574854179:web:8b3fba0536e8acedc3f796',
  measurementId: 'G-TMTM7FE8CW',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

export {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
}
