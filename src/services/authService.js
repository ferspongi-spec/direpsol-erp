import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from "../firebase/config";

const auth = getAuth(app);

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    return userCredential.user;
  } catch (error) {
    throw error;
  }
};
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const db = getFirestore(app);

// login vendedor por PIN
export const loginSeller = async (pin) => {
  const q = query(
    collection(db, "sellers"),
    where("pin", "==", pin)
  );

  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    const seller = snapshot.docs[0].data();

    return seller;
  } else {
    throw new Error("PIN incorrecto");
  }
};