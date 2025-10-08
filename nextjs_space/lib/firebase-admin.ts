
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let app: App | undefined;
let db: Firestore | undefined;

// Inicializar Firebase Admin apenas se ainda não foi inicializado
if (!getApps().length) {
  // Para desenvolvimento/produção na Vercel, usar credenciais do ambiente
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      app = initializeApp({
        credential: cert(serviceAccount),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "futperform-club-manager"
      });
    } catch (error) {
      console.error('Erro ao parsear FIREBASE_SERVICE_ACCOUNT_KEY:', error);
    }
  }
  
  // Fallback: inicializar com credenciais padrão do projeto
  if (!app) {
    app = initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "futperform-club-manager"
    });
  }
}

// Obter instância do app
if (!app) {
  app = getApps()[0];
}

// Inicializar Firestore
if (app && !db) {
  db = getFirestore(app);
}

export { db, app };
export const adminDb = db;
