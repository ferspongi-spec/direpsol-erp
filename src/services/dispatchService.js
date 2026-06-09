import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  increment,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import app from "../firebase/config";

const db = getFirestore(app);

// DESPACHAR BALONES A VENDEDOR
export const dispatchStock = async ({
  sellerName,
  full10kg,
  full45kg,
}) => {

  const inventoryRef =
    doc(db, "inventory", "general");

  const inventorySnap =
    await getDoc(inventoryRef);

  if (!inventorySnap.exists()) {
    throw new Error(
      "No existe inventory/general"
    );
  }

  const inventory =
    inventorySnap.data();

  // validar stock disponible
  if (
    inventory.full10kg < full10kg
  ) {
    throw new Error(
      "Stock insuficiente de 10kg"
    );
  }

  if (
    inventory.full45kg < full45kg
  ) {
    throw new Error(
      "Stock insuficiente de 45kg"
    );
  }

  // descontar del almacén general
  await updateDoc(
    inventoryRef,
    {
      full10kg:
        increment(-full10kg),

      full45kg:
        increment(-full45kg),
    }
  );

  // sumar al vendedor
  const sellerRef =
    doc(
      db,
      "sellerInventory",
      sellerName
    );

  await updateDoc(
    sellerRef,
    {
      full10kg:
        increment(full10kg),

      full45kg:
        increment(full45kg),
    }
  );

  // historial
  await addDoc(
    collection(
      db,
      "dispatchHistory"
    ),
    {
      sellerName,
      full10kg,
      full45kg,
      createdAt:
        serverTimestamp(),
    }
  );
};

// HISTORIAL
export const getDispatchHistory =
  async () => {

    const snapshot =
      await getDocs(
        collection(
          db,
          "dispatchHistory"
        )
      );

    return snapshot.docs.map(
      (doc) => ({
        id: doc.id,
        ...doc.data(),
      })
    );
};