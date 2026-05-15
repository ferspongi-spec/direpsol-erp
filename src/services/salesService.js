import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import app from "../firebase/config";

const db = getFirestore(app);

// registrar venta
export const createSale = async (saleData) => {
  try {
    const docRef = await addDoc(collection(db, "sales"), {
      ...saleData,
      createdAt: serverTimestamp()
    });

    return docRef.id;
  } catch (error) {
    throw error;
  }
};
import { getDocs } from "firebase/firestore";

// obtener ventas
export const getSales = async () => {
  try {
    const snapshot = await getDocs(collection(db, "sales"));

    const sales = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return sales;
  } catch (error) {
    throw error;
  }
};