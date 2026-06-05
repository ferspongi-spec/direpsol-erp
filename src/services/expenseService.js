import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
} from "firebase/firestore";

import app from "../firebase/config";

const db = getFirestore(app);

// obtener gastos
export const getExpenses =
  async () => {

    const snapshot =
      await getDocs(
        collection(
          db,
          "expenses"
        )
      );

    return snapshot.docs.map(
      (doc) => ({
        id: doc.id,
        ...doc.data(),
      })
    );

};

// crear gasto
export const createExpense =
  async (expense) => {

    await addDoc(
      collection(
        db,
        "expenses"
      ),
      {
        ...expense,
        createdAt:
          new Date(),
      }
    );

};