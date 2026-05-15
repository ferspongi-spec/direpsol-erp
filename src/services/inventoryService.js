import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  collection,
addDoc,
} from "firebase/firestore";

import app from "../firebase/config";

const db = getFirestore(app);

// obtener inventario
export const getInventory = async (type) => {

  const ref =
    doc(db, "inventory", type);

  const snapshot =
    await getDoc(ref);

  if (snapshot.exists()) {

    return snapshot.data();

  } else {

    return { stock: 0 };

  }
};

// agregar stock
export const addStock =
  async (
    type,
    quantity,
    supplier
  ) => {

    const ref =
      doc(db, "inventory", type);

    await setDoc(
      ref,
      {
        stock:
          increment(quantity),

        supplier,

        updatedAt:
          new Date(),
      },
      { merge: true }
    );
    await addDoc(
  collection(db, "inventoryHistory"),
  {
    movement: "entrada",

    type,

    quantity,

    supplier,

    user: "Admin",

    createdAt: new Date(),
  }
);
};

// descontar stock
export const removeStock =
  async (
    type,
    quantity
  ) => {

    const ref =
      doc(db, "inventory", type);

    await updateDoc(ref, {

      stock:
        increment(-quantity),

    });
    await addDoc(
  collection(db, "inventoryHistory"),
  {
    movement: "salida",

    type,

    quantity,

    user:
      JSON.parse(
        localStorage.getItem("seller")
      )?.name || "Admin",

    createdAt:
      new Date(),
  }
);
};