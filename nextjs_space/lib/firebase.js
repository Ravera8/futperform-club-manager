
// Firebase Configuration
// INSTRUÇÕES PARA OBTER CREDENCIAIS:
// 1. Aceder a https://console.firebase.google.com/
// 2. Criar novo projeto ou selecionar existente
// 3. Ir para "Project Settings" (ícone engrenagem)
// 4. Na aba "General", descer até "Your apps"
// 5. Clicar "Add app" e selecionar "Web" (</>)
// 6. Registar app com nome "FutPerform Club Manager"
// 7. Copiar o objeto firebaseConfig e substituir os valores abaixo

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "demo-project.firebaseapp.com", 
  projectId: "demo-project",
  storageBucket: "demo-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
export const storage = getStorage(app);

// Configure Auth providers
export const googleProvider = new GoogleAuthProvider();

// Connect to emulators if in development
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  try {
    // Only connect once to prevent errors
    if (!auth.config.emulator) {
      // Auth emulator runs on port 9099
    }
    if (!db._delegate._databaseId.projectId.includes('demo-')) {
      connectFirestoreEmulator(db, 'localhost', 8080);
    }
    if (!functions.app.options.projectId?.includes('demo-')) {
      connectFunctionsEmulator(functions, 'localhost', 5001);
    }
    if (!storage._delegate._host.includes('localhost')) {
      connectStorageEmulator(storage, 'localhost', 9199);
    }
  } catch (error) {
    console.log('Firebase emulators already connected or not available');
  }
}

export default app;
