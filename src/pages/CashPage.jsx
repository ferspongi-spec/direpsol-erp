import { useEffect, useState } from "react";
import { getSales } from "../services/salesService";
import Layout from "../components/Layout";
function CashPage() {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    const data = await getSales();
    setSales(data);
  };

  // Totales
  const totalCash = sales
    .filter((sale) => sale.payment === "efectivo")
    .reduce((acc, sale) => acc + sale.amount, 0);

  const totalYape = sales
    .filter((sale) => sale.payment === "yape")
    .reduce((acc, sale) => acc + sale.amount, 0);

  const totalTransfer = sales
    .filter((sale) => sale.payment === "transferencia")
    .reduce((acc, sale) => acc + sale.amount, 0);

  const totalGeneral = sales.reduce(
    (acc, sale) => acc + sale.amount,
    0
  );

  return (
    <Layout>
    <div className="min-h-screen bg-gray-100 p-6">

      <h1 className="text-3xl font-bold text-blue-900 mb-6">
        Caja Diaria
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        {/* Efectivo */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-gray-500 mb-2">
            Efectivo
          </h2>

          <p className="text-3xl font-bold text-green-600">
            S/ {totalCash}
          </p>
        </div>

        {/* Yape */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-gray-500 mb-2">
            Yape
          </h2>

          <p className="text-3xl font-bold text-purple-600">
            S/ {totalYape}
          </p>
        </div>

        {/* Transferencia */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-gray-500 mb-2">
            Transferencia
          </h2>

          <p className="text-3xl font-bold text-blue-600">
            S/ {totalTransfer}
          </p>
        </div>

        {/* Total */}
        <div className="bg-orange-500 rounded-xl shadow p-6 text-white">
          <h2 className="mb-2">
            Total General
          </h2>

          <p className="text-3xl font-bold">
            S/ {totalGeneral}
          </p>
        </div>

      </div>

    </div>
    </Layout>
  );
}

export default CashPage;