import { initializeApp } from 'firebase/app'
import { getFirestore, collection } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const api_key = import.meta.env.VITE_REACT_API_KEY || 'mock_key'
const auth_domain = import.meta.env.VITE_REACT_AUTH_DOM || 'mock_key'
const project_id = import.meta.env.VITE_REACT_PID || 'mock_key'
const storage_id = import.meta.env.VITE_REACT_SB || 'mock_key'
const mess_id = import.meta.env.VITE_REACT_MSID || 'mock_key'
const app_id = import.meta.env.VITE_REACT_AID || 'mock_key'

const firebaseConfig = {
  apiKey: api_key,
  authDomain: auth_domain,
  projectId: project_id,
  storageBucket: storage_id,
  messagingSenderId: mess_id,
  appId: app_id,
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const movieRef = collection(db, 'movies')
export const reviewsRef = collection(db, 'reviews')
export const usersRef = collection(db, 'users')
export const auth = getAuth(app)
export default app
