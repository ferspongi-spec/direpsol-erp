import { useEffect, useState } from "react";

import Layout from "../components/Layout";

import {
  addStock,
  getInventoryHistory,
} from "../services/inventoryService";

import {
  getProducts,
} from "../services/productService";

function InventoryPage() {

  const [products, setProducts] =
    useState([]);

  const [type, setType] =
    useState("");

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

      const data =
        await getProducts();

      setProducts(data);

      if (data.length > 0) {

        setType(data[0].name);

      }

    };

  const loadHistory =
    async () => {

      try {

        const data =
          await getInventoryHistory();

        setHistory(data);

      } catch (error) {

        console.log(error);

      }

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

    <Layout>

      <div className="min-h-screen bg-gray-100 p-6">

        <h1 className="text-3xl font-bold text-blue-900 mb-6">
          Inventario
        </h1>

        {/* ingreso stock */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8 max-w-lg">

          <div className="mb-6">

            <h2 className="text-3xl font-bold text-gray-800">
              Ingreso de Stock
            </h2>

            <p className="text-gray-500 mt-1">
              Registrar entrada de productos
            </p>

          </div>

          <div className="space-y-4">

            <select
              value={type}
              onChange={(e) =>
                setType(e.target.value)
              }
              className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >

              {
                products.map(
                  (product) => (

                    <option
                      key={product.id}
                      value={product.name}
                    >

                      {product.name}

                    </option>

                  )
                )
              }

            </select>

            <input
              type="number"
              placeholder="Cantidad"
              value={quantity}
              onChange={(e) =>
                setQuantity(
                  e.target.value
                )
              }
              className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              placeholder="Proveedor"
              value={supplier}
              onChange={(e) =>
                setSupplier(
                  e.target.value
                )
              }
              className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={handleAddStock}
              className="w-full bg-green-600 hover:bg-green-700 transition text-white p-4 rounded-xl font-bold"
            >
              Agregar Stock
            </button>

          </div>

        </div>

        {/* productos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

          {
            products.map(
              (product) => (

                <div
                  key={product.id}
                  className={`${
                    product.stock <= 10
                      ? "bg-red-50 border-red-300"
                      : "bg-white border-gray-100"
                  } rounded-2xl p-6 shadow-sm border hover:shadow-xl hover:-translate-y-1 transition duration-300`}
                >

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-gray-500">
                        {product.name}
                      </p>

                      <h2 className="text-5xl font-bold text-blue-600 mt-2">

                        {product.stock}

                      </h2>

                      <p className="text-sm text-gray-400 mt-2">

                        {product.category}

                      </p>

                    </div>

                    <div className="bg-blue-100 p-4 rounded-xl">

                      <span className="text-3xl">
                        📦
                      </span>

                    </div>

                  </div>

                </div>

              )
            )
          }

        </div>

        {/* historial */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          <div className="p-6 border-b">

            <h2 className="text-2xl font-bold text-gray-800">
              Historial Inventario
            </h2>

          </div>

          <table className="w-full">

            <thead className="bg-gray-50 text-gray-700">

              <tr>

                <th className="p-4 text-left font-semibold">
                  Movimiento
                </th>

                <th className="p-4 text-left font-semibold">
                  Tipo
                </th>

                <th className="p-4 text-left font-semibold">
                  Cantidad
                </th>

                <th className="p-4 text-left font-semibold">
                  Proveedor
                </th>

                <th className="p-4 text-left font-semibold">
                  Usuario
                </th>

                <th className="p-4 text-left font-semibold">
                  Fecha
                </th>

              </tr>

            </thead>

            <tbody>

              {history.map((item) => (

                <tr
                  key={item.id}
                  className="border-b hover:bg-gray-50 transition"
                >

                  <td className="p-4">

                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm ${
                        item.movement === "entrada"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >

                      {item.movement}

                    </span>

                  </td>

                  <td className="p-4">
                    {item.type}
                  </td>

                  <td className="p-4">
                    {item.quantity}
                  </td>

                  <td className="p-4">
                    {item.supplier || "-"}
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

    </Layout>

  );
}

export default InventoryPage;