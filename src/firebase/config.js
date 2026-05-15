import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDUqx8K-lCFBAF1Uwk5AgVs_Ev567K5HA0",
  authDomain: "direpsol-erp.firebaseapp.com",
  projectId: "direpsol-erp",
  storageBucket: "direpsol-erp.firebasestorage.app",
  messagingSenderId: "501637959639",
  appId: "1:501637959639:web:5e339034932492bab38592"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
export default app;