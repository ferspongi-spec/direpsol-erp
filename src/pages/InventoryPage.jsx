import { useEffect, useState } from "react";

import {
  getInventory,
  addStock,
  getInventoryHistory,
} from "../services/inventoryService";

function InventoryPage() {

  const [stock10, setStock10] =
    useState(0);

  const [stock45, setStock45] =
    useState(0);

  const [type, setType] =
    useState("10kg");

  const [quantity, setQuantity] =
    useState("");

  const [supplier, setSupplier] =
    useState("");

  const [history, setHistory] =
    useState([]);

  useEffect(() => {

    loadInventory();

    loadHistory();

  }, []);

  const loadInventory =
    async () => {

      const data10 =
        await getInventory("10kg");

      const data45 =
        await getInventory("45kg");

      setStock10(
        data10.stock || 0
      );

      setStock45(
        data45.stock || 0
      );
  };

  const loadHistory =
    async () => {

      const data =
        await getInventoryHistory();

      setHistory(data);
  };

  const handleAddStock =
    async () => {

      if (!quantity) return;

      await addStock(
        type,
        Number(quantity),
        supplier
      );

      setQuantity("");

      setSupplier("");

      loadInventory();

      loadHistory();
  };

  return (

    <div className="min-h-screen bg-gray-100 p-6">

      <h1 className="text-3xl font-bold text-blue-900 mb-6">
        Inventario GLP
      </h1>

      {/* ingreso stock */}

      <div className="bg-white p-6 rounded-xl shadow mb-8 max-w-md space-y-4">

        <h2 className="text-2xl font-bold">
          Ingreso de Stock
        </h2>

        <select
          value={type}
          onChange={(e) =>
            setType(e.target.value)
          }
          className="w-full border p-3 rounded"
        >

          <option value="10kg">
            GLP 10 Kg
          </option>

          <option value="45kg">
            GLP 45 Kg
          </option>

        </select>

        <input
          type="number"
          placeholder="Cantidad"
          value={quantity}
          onChange={(e) =>
            setQuantity(e.target.value)
          }
          className="w-full border p-3 rounded"
        />

        <input
          type="text"
          placeholder="Proveedor"
          value={supplier}
          onChange={(e) =>
            setSupplier(e.target.value)
          }
          className="w-full border p-3 rounded"
        />

        <button
          onClick={handleAddStock}
          className="w-full bg-green-600 text-white p-3 rounded font-bold"
        >
          Agregar Stock
        </button>

      </div>

      {/* tarjetas stock */}

      <div className="grid md:grid-cols-2 gap-6">

        {/* 10kg */}

        <div className="bg-white p-6 rounded-xl shadow">

          <h2 className="text-2xl font-bold mb-4">
            GLP 10 Kg
          </h2>

          <p className="text-4xl text-orange-500 font-bold">
            {stock10}
          </p>

        </div>

        {/* 45kg */}

        <div className="bg-white p-6 rounded-xl shadow">

          <h2 className="text-2xl font-bold mb-4">
            GLP 45 Kg
          </h2>

          <p className="text-4xl text-blue-600 font-bold">
            {stock45}
          </p>

        </div>

      </div>

      {/* historial */}

      <div className="bg-white rounded-xl shadow mt-8 overflow-hidden">

        <h2 className="text-2xl font-bold p-6">
          Historial Inventario
        </h2>

        <table className="w-full">

          <thead className="bg-blue-900 text-white">

            <tr>

              <th className="p-4 text-left">
                Movimiento
              </th>

              <th className="p-4 text-left">
                Tipo
              </th>

              <th className="p-4 text-left">
                Cantidad
              </th>

              <th className="p-4 text-left">
                Usuario
              </th>

              <th className="p-4 text-left">
                Fecha
              </th>

            </tr>

          </thead>

          <tbody>

            {history.map((item) => (

              <tr
                key={item.id}
                className="border-b"
              >

                <td className="p-4">
                  {item.movement}
                </td>

                <td className="p-4">
                  {item.type}
                </td>

                <td className="p-4">
                  {item.quantity}
                </td>

                <td className="p-4">
                  {item.user}
                </td>

                <td className="p-4">

                  {item.createdAt
                    ?.toDate()
                    .toLocaleString()}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default InventoryPage;