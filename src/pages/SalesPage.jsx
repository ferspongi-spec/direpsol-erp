import { useState } from "react";
import { createSale } from "../services/salesService";
import jsPDF from "jspdf";
import {
  removeStock,
  getInventory,
  

} from "../services/inventoryService";

function SalesPage() {
  const [type, setType] = useState("10kg");
  const [amount, setAmount] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [payment, setPayment] = useState("transferencia");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    if (!amount) return;

    setLoading(true);
    setMessage("");

    try {
        const inventory =
  await getInventory();

const currentStock =
  inventory.find(
    (item) => item.type === type
  );

if (
  !currentStock ||
  currentStock.stock < quantity
) {

  setMessage(
    `Stock insuficiente ❌ Disponible: ${
      currentStock?.stock || 0
    }`
  );

  setLoading(false);

  return;
}
      await createSale({    
        type,
        amount: Number(amount),
        quantity,
        payment,
        vendor: JSON.parse(localStorage.getItem("seller"))?.name || "Sin vendedor" // luego lo hacemos dinámico
      });
await removeStock(type, quantity);
const doc = new jsPDF();

doc.setFontSize(18);

doc.text(
  "DIREPSOL",
  20,
  20
);

doc.setFontSize(12);

doc.text(
  `Tipo: ${type}`,
  20,
  40
);

doc.text(
  `Cantidad: ${quantity}`,
  20,
  50
);

doc.text(
  `Monto: S/ ${amount}`,
  20,
  60
);

doc.text(
  `Pago: ${payment}`,
  20,
  70
);

doc.text(
  `Fecha: ${new Date().toLocaleDateString()}`,
  20,
  80
);

doc.text(
  `Hora: ${new Date().toLocaleTimeString()}`,
  20,
  90
);

doc.text(
  `Vendedor: ${
    JSON.parse(
      localStorage.getItem("seller")
    )?.name || "Admin"
  }`,
  20,
  100
);

doc.save(
  "ticket-direpsol.pdf"
);
      setMessage("Venta registrada correctamente ✅");
      setAmount("");
      setQuantity(1);
    } catch (error) {
      setMessage("Error al guardar la venta ❌");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <h1 className="text-3xl font-bold text-blue-900 mb-6">
        Registrar Venta GLP
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-md max-w-md space-y-4">

        {/* Tipo de balón */}
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full border p-3 rounded"
        >
          <option value="10kg">GLP 10 Kg</option>
          <option value="45kg">GLP 45 Kg</option>
        </select>
{/* Monto */}
<input
  type="number"
  placeholder="Monto de venta (S/)"
  value={amount}
  onChange={(e) => setAmount(e.target.value)}
  className="w-full border p-3 rounded"
/>

{/* Cantidad */}
<input
  type="number"
  placeholder="Cantidad de balones"
  value={quantity}
  onChange={(e) =>
    setQuantity(Number(e.target.value))
  }
  className="w-full border p-3 rounded"
/>

{/* Pago */}
<select
  value={payment}
  onChange={(e) => setPayment(e.target.value)}
  className="w-full border p-3 rounded"
>
  <option value="transferencia">Transferencia</option>
  <option value="yape">Yape</option>
  <option value="efectivo">Efectivo</option>
</select>

        {/* Botón */}
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-orange-500 text-white p-3 rounded font-bold"
        >
          {loading ? "Guardando..." : "Registrar Venta"}
        </button>

        {/* Mensaje */}
        {message && (
          <p className="text-center text-sm mt-2">
            {message}
          </p>
        )}

      </div>
    </div>
  );
}

export default SalesPage;