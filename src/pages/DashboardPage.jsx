import toast from "react-hot-toast";

import Layout from "../components/Layout";

import {
  useEffect,
  useState,
} from "react";

import {
  getSales,
} from "../services/salesService";

import {
  getExpenses,
} from "../services/expenseService";

import {
  getProducts,
} from "../services/productService";

import * as XLSX from "xlsx";

import { saveAs } from "file-saver";

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

import {
  DollarSign,
  Package,
  ShoppingCart,
} from "lucide-react";

function DashboardPage() {

  const [sales, setSales] =
    useState([]);

  const [expenses, setExpenses] =
    useState([]);

  const [inventory, setInventory] =
    useState([]);

  const [fromDate, setFromDate] =
    useState("");

  const [toDate, setToDate] =
    useState("");

  const [search, setSearch] =
    useState("");

  useEffect(() => {

    loadSales();

    loadInventory();

    const interval =
      setInterval(() => {

        loadSales();

        loadInventory();

      }, 5000);

    return () =>
      clearInterval(interval);

  }, []);

  // cargar ventas y gastos
  const loadSales =
    async () => {

      try {

        const salesData =
          await getSales();

        const expensesData =
          await getExpenses();

        setSales(
          salesData
        );

        setExpenses(
          expensesData
        );

      } catch (error) {

        console.log(error);

      }

    };

  // cargar productos
  const loadInventory =
    async () => {

      try {

        const data =
          await getProducts();

        setInventory(data);

      } catch (error) {

        console.log(error);

      }

    };

  // exportar excel
  const exportToExcel =
    () => {

      const data =
        filteredSales.map(
          (sale) => ({

            Tipo:
              sale.type,

            Cantidad:
              sale.quantity || 1,

            Monto:
              sale.amount,

            Pago:
              sale.payment,

            Vendedor:
              sale.vendor,

          })
        );

      const worksheet =
        XLSX.utils.json_to_sheet(
          data
        );

      const workbook =
        XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Ventas"
      );

      const excelBuffer =
        XLSX.write(
          workbook,
          {
            bookType: "xlsx",
            type: "array",
          }
        );

      const fileData =
        new Blob(
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

  // exportar pdf
  const exportToPDF =
    () => {

      const doc =
        new jsPDF();

      doc.setFontSize(18);

      doc.text(
        "Reporte DIREPSOL",
        14,
        20
      );

      const tableData =
        filteredSales.map(
          (sale) => [

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

          ]
        );

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

        body:
          tableData,

      });

      doc.save(
        "reporte-direpsol.pdf"
      );

    };

  // filtro ventas
  const filteredSales =
    sales.filter(
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

        if (
          from &&
          saleDate < from
        )
          return false;

        if (to) {

          to.setHours(
            23,
            59,
            59
          );

          if (
            saleDate > to
          )
            return false;

        }

        const searchText =
          `
          ${sale.type}
          ${sale.vendor}
          ${sale.payment}
          ${sale.clientName || ""}
        `
            .toLowerCase();

        return searchText.includes(
          search.toLowerCase()
        );

      }
    );

  // ventas hoy
  const todaySales =
    filteredSales.filter(
      (sale) => {

        if (!sale.createdAt)
          return false;

        const today =
          new Date();

        const saleDate =
          sale.createdAt.toDate();

        return (
          saleDate.toDateString() ===
          today.toDateString()
        );

      }
    );

  // totales
  const totalToday =
    todaySales.reduce(
      (acc, sale) =>
        acc + sale.amount,
      0
    );

  const totalSales =
    filteredSales.reduce(
      (acc, sale) =>
        acc + sale.amount,
      0
    );

  const totalExpenses =
    expenses.reduce(
      (acc, expense) =>
        acc + expense.amount,
      0
    );

  const netProfit =
    totalSales -
    totalExpenses;

  // promedio ticket
  const averageTicket =
    filteredSales.length > 0
      ? (
          totalSales /
          filteredSales.length
        ).toFixed(2)
      : 0;

  // pago top
  const paymentStats = {};

  filteredSales.forEach(
    (sale) => {

      paymentStats[
        sale.payment
      ] =
        (
          paymentStats[
            sale.payment
          ] || 0
        ) + 1;

    }
  );

  const topPayment =
    Object.keys(
      paymentStats
    ).reduce(
      (a, b) =>
        paymentStats[a] >
        paymentStats[b]
          ? a
          : b,
      "-"
    );

  // top cliente
  const clientStats = {};

  filteredSales.forEach(
    (sale) => {

      if (!sale.clientName)
        return;

      clientStats[
        sale.clientName
      ] =
        (
          clientStats[
            sale.clientName
          ] || 0
        ) + 1;

    }
  );

  const topClient =
    Object.keys(
      clientStats
    ).reduce(
      (a, b) =>
        clientStats[a] >
        clientStats[b]
          ? a
          : b,
      "-"
    );

  // top vendedor
  const sellerStats = {};

  filteredSales.forEach(
    (sale) => {

      sellerStats[
        sale.vendor
      ] =
        (
          sellerStats[
            sale.vendor
          ] || 0
        ) + 1;

    }
  );

  const topSeller =
    Object.keys(
      sellerStats
    ).reduce(
      (a, b) =>
        sellerStats[a] >
        sellerStats[b]
          ? a
          : b,
      "-"
    );

  // alertas stock
  useEffect(() => {

    const critical =
      inventory.filter(
        (item) =>
          item.stock <= 5
      );

    if (
      critical.length > 0
    ) {

      toast.error(
        "⚠️ Hay productos con stock crítico"
      );

    }

  }, [inventory]);

  // ventas mensuales
  const monthlySales = {};

  filteredSales.forEach(
    (sale) => {

      if (!sale.createdAt)
        return;

      const date =
        sale.createdAt.toDate();

      const month =
        date.toLocaleString(
          "es-PE",
          {
            month: "short",
          }
        );

      monthlySales[
        month
      ] =
        (
          monthlySales[
            month
          ] || 0
        ) + sale.amount;

    }
  );

  const monthlyChartData =
    Object.keys(
      monthlySales
    ).map(
      (month) => ({

        month,

        total:
          monthlySales[
            month
          ],

      })
    );

  // chart productos
  const chartData =
    inventory.map(
      (product) => ({

        name:
          product.name,

        ventas:
          filteredSales
            .filter(
              (sale) =>
                sale.type ===
                product.name
            )
            .reduce(
              (acc, sale) =>
                acc +
                (sale.quantity || 1),
              0
            ),

      })
    );

  return (

    <Layout>

      <div className="min-h-screen bg-gray-100 p-6">

        {/* header */}
        <div className="flex items-center justify-between mb-8">

          <div>

            <h1 className="text-4xl font-bold text-gray-800">
              Dashboard
            </h1>

            <p className="text-gray-500 mt-2">
              Resumen general DIREPSOL
            </p>

          </div>

          <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100">

            <p className="text-gray-500 text-sm">
              Fecha actual
            </p>

            <p className="font-bold text-lg text-gray-800">

              {
                new Date().toLocaleDateString()
              }

            </p>

          </div>

        </div>

        {/* buscador */}
        <input
          type="text"
          placeholder="Buscar cliente, vendedor o producto..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="border border-gray-200 rounded-xl p-3 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 w-full mb-6"
        />

        {/* filtros */}
        <div className="flex gap-4 mb-6">

          <input
            type="date"
            value={fromDate}
            onChange={(e) =>
              setFromDate(
                e.target.value
              )
            }
            className="border border-gray-200 rounded-xl p-3 bg-white"
          />

          <input
            type="date"
            value={toDate}
            onChange={(e) =>
              setToDate(
                e.target.value
              )
            }
            className="border border-gray-200 rounded-xl p-3 bg-white"
          />

        </div>

        {/* botones */}
        <div className="flex gap-4 mb-6">

          <button
            onClick={exportToExcel}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl font-semibold"
          >
            Exportar Excel
          </button>

          <button
            onClick={exportToPDF}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl font-semibold"
          >
            Exportar PDF
          </button>

        </div>

        {/* alertas */}
        {
          inventory.filter(
            (item) =>
              item.stock <= 10
          ).length > 0 && (

            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl p-6 shadow-lg mb-8">

              <h2 className="text-2xl font-bold mb-4">
                ⚠️ Alertas Stock
              </h2>

              <div className="space-y-3">

                {
                  inventory
                    .filter(
                      (item) =>
                        item.stock <= 10
                    )
                    .map(
                      (item) => (

                        <div
                          key={item.id}
                          className="bg-white/10 p-4 rounded-xl flex justify-between"
                        >

                          <div>

                            <p className="font-bold text-lg">
                              {item.name}
                            </p>

                            <p className="text-red-100">
                              Stock crítico
                            </p>

                          </div>

                          <div className="text-3xl font-bold">

                            {item.stock}

                          </div>

                        </div>

                      )
                    )
                }

              </div>

            </div>

          )
        }

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">

          <div className="bg-white rounded-2xl p-6 shadow-sm border">

            <p className="text-gray-500">
              Ventas Totales
            </p>

            <h2 className="text-4xl font-bold mt-2">

              {filteredSales.length}

            </h2>

          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border">

            <p className="text-gray-500">
              Ingresos
            </p>

            <h2 className="text-4xl font-bold text-green-600 mt-2">

              S/ {totalSales}

            </h2>

          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border">

            <p className="text-gray-500">
              Gastos
            </p>

            <h2 className="text-4xl font-bold text-red-600 mt-2">

              S/ {totalExpenses}

            </h2>

          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border">

            <p className="text-gray-500">
              Utilidad
            </p>

            <h2 className="text-4xl font-bold text-blue-600 mt-2">

              S/ {netProfit}

            </h2>

          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border">

            <p className="text-gray-500">
              Ventas Hoy
            </p>

            <h2 className="text-4xl font-bold text-orange-500 mt-2">

              S/ {totalToday}

            </h2>

          </div>

        </div>

      </div>

    </Layout>

  );
}

export default DashboardPage;