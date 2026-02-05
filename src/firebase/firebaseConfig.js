import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDFrDQy0mKiHOhPqPa7WXxB0D0XN0nlqEg",
  authDomain: "instant-photos-9a258.firebaseapp.com",
  projectId: "instant-photos-9a258",
  storageBucket: "instant-photos-9a258.firebasestorage.app",
  messagingSenderId: "500402254803",
  appId: "1:500402254803:web:2a7f147363611518163526"
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)

export default app