import Layout from "../components/Layout";
import successSound from "../assets/success.mp3";

import {
  useState,
  useEffect,
} from "react";

import {
  createSale,
} from "../services/salesService";

import jsPDF from "jspdf";

import toast from "react-hot-toast";

import {
  removeStock,
  getInventory,
} from "../services/inventoryService";

import {
  getProducts,
decreaseProductStock,
} from "../services/productService";

function SalesPage() {

  const [products, setProducts] =
    useState([]);

  const [type, setType] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [quantity, setQuantity] =
    useState(1);

  const [payment, setPayment] =
    useState("transferencia");

  const [clientName, setClientName] =
    useState("");

  const [clientPhone, setClientPhone] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {

    loadProducts();

  }, []);

  const loadProducts =
    async () => {

      const data =
        await getProducts();

      setProducts(data);

      if (data.length > 0) {

        setType(data[0].name);

      }

    };

  const handleSave =
    async () => {

      if (!amount) return;

      setLoading(true);
const selectedProduct =
  products.find(
    (product) =>
      product.name === type
  );
      try {

        if (
  !selectedProduct ||
  selectedProduct.stock < quantity
) {

  toast.error(
    `Stock insuficiente. Disponible: ${
      selectedProduct?.stock || 0
    }`
  );

  setLoading(false);

  return;

        }

        await createSale({

          type,

          amount:
            Number(amount),

          quantity,

          payment,

          clientName,

          clientPhone,

          vendor:
            JSON.parse(
              localStorage.getItem("seller")
            )?.name || "Sin vendedor",

        });

    await decreaseProductStock(
  selectedProduct.id,
  quantity
);

        // PDF
        const doc =
          new jsPDF();

        doc.setFillColor(
          15,
          23,
          42
        );

        doc.rect(
          0,
          0,
          210,
          35,
          "F"
        );

        doc.setTextColor(
          255,
          255,
          255
        );

        doc.setFontSize(22);

        doc.text(
          "DIREPSOL",
          20,
          22
        );

        doc.setFontSize(10);

        doc.text(
          "Distribuidora GLP",
          20,
          30
        );

        doc.setTextColor(
          0,
          0,
          0
        );

        doc.setFontSize(16);

        doc.text(
          "TICKET DE VENTA",
          20,
          50
        );

        doc.setDrawColor(200);

        doc.line(
          20,
          55,
          190,
          55
        );

        doc.setFontSize(12);

        doc.text(
          `Cliente: ${
            clientName ||
            "No registrado"
          }`,
          20,
          70
        );

        doc.text(
          `Teléfono: ${
            clientPhone || "-"
          }`,
          20,
          80
        );

        doc.text(
          `Producto: ${type}`,
          20,
          95
        );

        doc.text(
          `Cantidad: ${quantity}`,
          20,
          105
        );

        doc.text(
          `Pago: ${payment}`,
          20,
          115
        );

        doc.text(
          `Monto Total: S/ ${amount}`,
          20,
          125
        );

        doc.text(
          `Fecha: ${
            new Date().toLocaleDateString()
          }`,
          20,
          140
        );

        doc.text(
          `Hora: ${
            new Date().toLocaleTimeString()
          }`,
          20,
          150
        );

        doc.text(
          `Vendedor: ${
            JSON.parse(
              localStorage.getItem("seller")
            )?.name || "Admin"
          }`,
          20,
          160
        );

        doc.setFontSize(10);

        doc.setTextColor(100);

        doc.text(
          "Gracias por confiar en DIREPSOL",
          20,
          190
        );

        doc.save(
          "ticket-direpsol.pdf"
        );

        toast.success(
          "Venta registrada correctamente"
        );

        new Audio(
          successSound
        ).play();

        setAmount("");

        setQuantity(1);

        setClientName("");

        setClientPhone("");

      } catch (error) {

        toast.error(
          "Error al guardar la venta"
        );

      }

      setLoading(false);

    };

  return (

    <Layout>

      <div className="min-h-screen bg-gray-100 p-6">

        <h1 className="text-3xl font-bold text-blue-900 mb-6">
          Registrar Venta
        </h1>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-lg">

          <div className="mb-6">

            <h2 className="text-3xl font-bold text-gray-800">
              Registrar Venta
            </h2>

            <p className="text-gray-500 mt-1">
              Registrar nueva venta
            </p>

          </div>

          <div className="space-y-4">

            {/* PRODUCTOS */}
            <select
              value={type}
              onChange={(e) =>
                setType(e.target.value)
              }
              className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
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

            {/* MONTO */}
            <input
              type="number"
              placeholder="Monto de venta"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
              className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />

            {/* CANTIDAD */}
            <input
              type="number"
              placeholder="Cantidad"
              value={quantity}
              onChange={(e) =>
                setQuantity(
                  Number(e.target.value)
                )
              }
              className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />

            {/* CLIENTE */}
            <input
              type="text"
              placeholder="Nombre cliente"
              value={clientName}
              onChange={(e) =>
                setClientName(
                  e.target.value
                )
              }
              className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />

            {/* TELEFONO */}
            <input
              type="text"
              placeholder="Teléfono cliente"
              value={clientPhone}
              onChange={(e) =>
                setClientPhone(
                  e.target.value
                )
              }
              className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />

            {/* PAGO */}
            <select
              value={payment}
              onChange={(e) =>
                setPayment(
                  e.target.value
                )
              }
              className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >

              <option value="transferencia">
                Transferencia
              </option>

              <option value="yape">
                Yape
              </option>

              <option value="efectivo">
                Efectivo
              </option>

            </select>

            {/* BOTON */}
            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 transition text-white p-4 rounded-xl font-bold"
            >

              {
                loading
                  ? "Guardando..."
                  : "Registrar Venta"
              }

            </button>

          </div>

        </div>

      </div>

    </Layout>

  );
}

export default SalesPage;