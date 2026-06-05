import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  increment,
} from "firebase/firestore";

import app from "../firebase/config";

const db = getFirestore(app);

// obtener productos
export const getProducts =
  async () => {

    const snapshot =
      await getDocs(
        collection(
          db,
          "products"
        )
      );

    return snapshot.docs.map(
      (doc) => ({
        id: doc.id,
        ...doc.data(),
      })
    );
};

// agregar producto
export const createProduct =
  async (product) => {

    await addDoc(
      collection(
        db,
        "products"
      ),
      {
        ...product,
        createdAt:
          new Date(),
      }
    );

};

// editar producto
export const updateProduct =
  async (
    id,
    product
  ) => {

    const ref =
      doc(
        db,
        "products",
        id
      );

    await updateDoc(
      ref,
      product
    );

};

// eliminar producto
export const deleteProduct =
  async (id) => {

    const ref =
      doc(
        db,
        "products",
        id
      );

    await deleteDoc(ref);

};
// descontar stock producto
export const decreaseProductStock =
  async (
    id,
    quantity
  ) => {

    const ref =
      doc(
        db,
        "products",
        id
      );

    await updateDoc(
      ref,
      {
        stock:
          increment(
            -quantity
          ),
      }
    );

};