import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";

import app from "../firebase/config";

const db = getFirestore(app);

// registrar FISE
export const createFise = async (data) => {

  const docRef = await addDoc(
    collection(db, "fise"),
    {
      ...data,
      createdAt: serverTimestamp(),
    }
  );

  return docRef.id;
};

// obtener FISE
export const getFise = async () => {

  const snapshot = await getDocs(
    collection(db, "fise")
  );

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// actualizar estado
export const updateFiseStatus = async (
  id,
  status
) => {

  const ref = doc(db, "fise", id);

  await updateDoc(ref, {
    status,
  });

};