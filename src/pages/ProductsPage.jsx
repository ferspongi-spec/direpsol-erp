import { useEffect, useState } from "react";

import Layout from "../components/Layout";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService";

function ProductsPage() {

  const [products, setProducts] =
    useState([]);

  const [name, setName] =
    useState("");

  const [code, setCode] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [stock, setStock] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [editingId, setEditingId] =
    useState(null);

  useEffect(() => {

    loadProducts();

  }, []);

  const loadProducts =
    async () => {

      const data =
        await getProducts();

      setProducts(data);

    };

  const handleSave =
    async () => {

      if (
        !name ||
        !price
      ) return;

      const productData = {

        name,

        code,

        price:
          Number(price),

        stock:
          Number(stock),

        category,

        active: true,

      };

      if (editingId) {

        await updateProduct(
          editingId,
          productData
        );

      } else {

        await createProduct(
          productData
        );

      }

      setName("");

      setCode("");

      setPrice("");

      setStock("");

      setCategory("");

      setEditingId(null);

      loadProducts();

    };

  const handleEdit =
    (product) => {

      setEditingId(
        product.id
      );

      setName(
        product.name
      );

      setCode(
        product.code
      );

      setPrice(
        product.price
      );

      setStock(
        product.stock
      );

      setCategory(
        product.category
      );

    };

  const handleDelete =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "¿Eliminar producto?"
        );

      if (!confirmDelete)
        return;

      await deleteProduct(id);

      loadProducts();

    };

  return (

    <Layout>

      <div className="min-h-screen bg-gray-100 p-6">

        <h1 className="text-3xl font-bold text-blue-900 mb-6">
          Productos
        </h1>

        {/* formulario */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8 max-w-xl">

          <div className="space-y-4">

            <input
              type="text"
              placeholder="Nombre producto"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="w-full border border-gray-200 rounded-xl p-4"
            />

            <input
              type="text"
              placeholder="Código"
              value={code}
              onChange={(e) =>
                setCode(e.target.value)
              }
              className="w-full border border-gray-200 rounded-xl p-4"
            />

            <input
              type="number"
              placeholder="Precio"
              value={price}
              onChange={(e) =>
                setPrice(e.target.value)
              }
              className="w-full border border-gray-200 rounded-xl p-4"
            />

            <input
              type="number"
              placeholder="Stock"
              value={stock}
              onChange={(e) =>
                setStock(e.target.value)
              }
              className="w-full border border-gray-200 rounded-xl p-4"
            />

            <input
              type="text"
              placeholder="Categoría"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className="w-full border border-gray-200 rounded-xl p-4"
            />

            <button
              onClick={handleSave}
              className={`w-full text-white p-4 rounded-xl font-bold ${
                editingId
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >

              {
                editingId
                  ? "Actualizar Producto"
                  : "Guardar Producto"
              }

            </button>

          </div>

        </div>

        {/* tabla */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          <table className="w-full">

            <thead className="bg-gray-50">

              <tr>

                <th className="p-4 text-left">
                  Nombre
                </th>

                <th className="p-4 text-left">
                  Código
                </th>

                <th className="p-4 text-left">
                  Precio
                </th>

                <th className="p-4 text-left">
                  Stock
                </th>

                <th className="p-4 text-left">
                  Categoría
                </th>

                <th className="p-4 text-left">
                  Acciones
                </th>

              </tr>

            </thead>

            <tbody>

              {products.map((item) => (

                <tr
                  key={item.id}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="p-4">
                    {item.name}
                  </td>

                  <td className="p-4">
                    {item.code}
                  </td>

                  <td className="p-4">
                    S/ {item.price}
                  </td>

                  <td className="p-4">
                    {item.stock}
                  </td>

                  <td className="p-4">
                    {item.category}
                  </td>

                  <td className="p-4 flex gap-2">

                    <button
                      onClick={() =>
                        handleEdit(item)
                      }
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(item.id)
                      }
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                    >
                      Eliminar
                    </button>

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

export default ProductsPage;