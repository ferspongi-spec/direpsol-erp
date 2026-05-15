import { useEffect, useState } from "react";
import { getSales } from "../services/salesService";
import { getInventory } from "../services/inventoryService";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";

import {
  logoutUser,
} from "../services/authService";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

function DashboardPage() {
const navigate =
  useNavigate();
  const [sales, setSales] = useState([]);
const [inventory, setInventory] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

 useEffect(() => {

  loadSales();

  loadInventory();

}, []);

  // cargar ventas
  const loadSales = async () => {

    try {

      const data = await getSales();

      setSales(data);

    } catch (error) {

      console.log(error);

    }
  };
const loadInventory = async () => {

  try {

    const data =
      await getInventory();

    setInventory(data);

  } catch (error) {

    console.log(error);

  }
};
  // exportar excel
  const exportToExcel = () => {

    const data = filteredSales.map(
      (sale) => ({
        Tipo: sale.type,
        Cantidad: sale.quantity || 1,
        Monto: sale.amount,
        Pago: sale.payment,
        Vendedor: sale.vendor,
      })
    );

    const worksheet =
      XLSX.utils.json_to_sheet(data);

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Ventas"
    );

    const excelBuffer =
      XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

    const fileData = new Blob(
      [excelBuffer],
      {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }
    );

    saveAs(
      fileData,
      "ventas-direpsol.xlsx"
    );
  };

  // exportar PDF
  const exportToPDF = () => {

    const doc = new jsPDF();

    doc.setFontSize(18);

    doc.text(
      "Reporte DIREPSOL",
      14,
      20
    );

    const tableData =
      filteredSales.map((sale) => [

        sale.type,

        sale.quantity || 1,

        `S/ ${sale.amount}`,

        sale.payment,

        sale.vendor,

        sale.createdAt
          ?.toDate()
          .toLocaleDateString(),

        sale.createdAt
          ?.toDate()
          .toLocaleTimeString(),

      ]);

    autoTable(doc, {

      startY: 30,

      head: [[
        "Tipo",
        "Cantidad",
        "Monto",
        "Pago",
        "Vendedor",
        "Fecha",
        "Hora",
      ]],

      body: tableData,

    });

    doc.save(
      "reporte-direpsol.pdf"
    );
  };

  // filtro fechas
  const filteredSales = sales.filter(
    (sale) => {

      if (!sale.createdAt)
        return false;

      const saleDate =
        sale.createdAt.toDate();

      const from =
        fromDate
          ? new Date(fromDate)
          : null;

      const to =
        toDate
          ? new Date(toDate)
          : null;

      if (from && saleDate < from)
        return false;

      if (to) {

        to.setHours(23, 59, 59);

        if (saleDate > to)
          return false;
      }

      return true;
    }
  );
const chartData = [

  {
    name: "10kg",

    ventas:
      filteredSales
        .filter(
          (sale) =>
            sale.type === "10kg"
        )
        .reduce(
          (acc, sale) =>
            acc + (sale.quantity || 1),
          0
        ),
  },

  {
    name: "45kg",

    ventas:
      filteredSales
        .filter(
          (sale) =>
            sale.type === "45kg"
        )
        .reduce(
          (acc, sale) =>
            acc + (sale.quantity || 1),
          0
        ),
  },

];
const handleLogout =
  async () => {

    await logoutUser();

    localStorage.removeItem("user");

    navigate("/");

};
  return (

    <div className="min-h-screen bg-gray-100 p-6">

      <h1 className="text-3xl font-bold text-blue-900 mb-6">
        Dashboard DIREPSOL
      </h1>
<button
  onClick={handleLogout}
  className="bg-red-600 text-white px-4 py-2 rounded mb-6"
>
  Cerrar Sesión
</button>
      {/* filtros fecha */}
      <div className="flex gap-4 mb-6">

        <input
          type="date"
          value={fromDate}
          onChange={(e) =>
            setFromDate(e.target.value)
          }
          className="border p-2 rounded"
        />

        <input
          type="date"
          value={toDate}
          onChange={(e) =>
            setToDate(e.target.value)
          }
          className="border p-2 rounded"
        />

      </div>

      {/* botones */}
      <div className="flex gap-4 mb-6">

        <button
          onClick={exportToExcel}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Exportar Excel
        </button>

        <button
          onClick={exportToPDF}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Exportar PDF
        </button>

      </div>

      {/* resumen */}
      <div className="mb-6 space-y-2">

  {inventory
    .filter((item) => item.stock <= 10)
    .map((item) => (

      <div
        key={item.id}
        className="bg-red-100 text-red-700 p-3 rounded font-bold"
      >

        ⚠️ Stock bajo {item.type}: {item.stock} unidades

      </div>

    ))}

</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

        <div className="bg-white rounded-xl p-6 shadow">

          <h2 className="text-gray-500">
            Ventas Totales
          </h2>

          <p className="text-3xl font-bold text-orange-500">
            {filteredSales.length}
          </p>

        </div>

        <div className="bg-white rounded-xl p-6 shadow">

          <h2 className="text-gray-500">
            Monto Total
          </h2>

          <p className="text-3xl font-bold text-green-600">

            S/ {
              filteredSales.reduce(
                (acc, sale) =>
                  acc + sale.amount,
                0
              )
            }

          </p>

        </div>

        <div className="bg-white rounded-xl p-6 shadow">

          <h2 className="text-gray-500">
            GLP Registrado
          </h2>

          <p className="text-3xl font-bold text-blue-600">

            {filteredSales.reduce(
              (acc, sale) =>
                acc + (sale.quantity || 1),
              0
            )}

          </p>

        </div>

      </div>

      {/* tabla */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">

  <h2 className="text-2xl font-bold mb-4">
    Ventas por Tipo GLP
  </h2>

  <ResponsiveContainer
    width="100%"
    height={300}
  >

    <BarChart data={chartData}>

      <XAxis dataKey="name" />

      <YAxis />

      <Tooltip />

     <Bar
  dataKey="ventas"
>

  <Cell fill="#f97316" />
  <Cell fill="#2563eb" />

</Bar>

    </BarChart>

  </ResponsiveContainer>

</div>
      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-blue-900 text-white">

            <tr>

              <th className="p-4 text-left">
                Tipo
              </th>

              <th className="p-4 text-left">
                Cantidad
              </th>

              <th className="p-4 text-left">
                Monto
              </th>

              <th className="p-4 text-left">
                Pago
              </th>

              <th className="p-4 text-left">
                Vendedor
              </th>

              <th className="p-4 text-left">
                Fecha
              </th>

              <th className="p-4 text-left">
                Hora
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredSales.map((sale) => (

              <tr
                key={sale.id}
                className="border-b"
              >

                <td className="p-4">
                  {sale.type}
                </td>

              <td className="p-4">
                  {sale.quantity || 1}
                 </td>

                <td className="p-4">
                  S/ {sale.amount}
                </td>

                <td className="p-4">
                  {sale.payment}
                </td>

                <td className="p-4">
                  {sale.vendor}
                </td>

                <td className="p-4">

                  {sale.createdAt
                    ?.toDate()
                    .toLocaleDateString()}

                </td>

                <td className="p-4">

                  {sale.createdAt
                    ?.toDate()
                    .toLocaleTimeString()}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default DashboardPage;