import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDwm8xuQL5YxxuSmw0biUddUCa9sUJLIGY",
  authDomain: "onix-fb4e7.firebaseapp.com",
  projectId: "onix-fb4e7",
  storageBucket: "onix-fb4e7.firebasestorage.app",
  messagingSenderId: "255994591547",
  appId: "1:255994591547:web:5e46434eeb8e4e92869f1e",
  measurementId: "G-TPV9GX3S4E"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  client_id: '255994591547-vdha32lblbjc2tdbn484clnes1fs3tu0.apps.googleusercontent.com',
  prompt: 'select_account'
});