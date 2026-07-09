
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "multi-agent-ai-d04b1.firebaseapp.com",
  projectId: "multi-agent-ai-d04b1", 
  storageBucket: "multi-agent-ai-d04b1.firebasestorage.app",
  messagingSenderId: "1059516907700",
  appId: "1:1059516907700:web:250591eaa906e18b43d7e1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };