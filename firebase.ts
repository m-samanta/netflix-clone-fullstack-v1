// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD6hxLSVJLJHneoYFoPgroSby74VHeTYIc",
    authDomain: "netflix-clone-yt-tutorial.firebaseapp.com",
    projectId: "netflix-clone-yt-tutorial",
    storageBucket: "netflix-clone-yt-tutorial.appspot.com",
    messagingSenderId: "1001918124903",
    appId: "1:1001918124903:web:2c62eacbea14d2dbdb55c2"
  };
// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore()
const auth = getAuth()

export default app
export { auth, db }