import { useEffect, useState } from "react";

import Layout from "../components/Layout";

import {
  getExpenses,
  createExpense,
} from "../services/expenseService";

import {
  getSales,
} from "../services/salesService";

function FinancePage() {

  const [expenses, setExpenses] =
    useState([]);

  const [sales, setSales] =
    useState([]);

  const [description, setDescription] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [category, setCategory] =
    useState("");

  useEffect(() => {

    loadData();

  }, []);

  const loadData =
    async () => {

      const expensesData =
        await getExpenses();

      const salesData =
        await getSales();

      setExpenses(expensesData);

      setSales(salesData);

    };

  const handleSave =
    async () => {

      if (
        !description ||
        !amount
      ) return;

      await createExpense({

        description,

        amount:
          Number(amount),

        category,

      });

      setDescription("");

      setAmount("");

      setCategory("");

      loadData();

    };

  const totalSales =
    sales.reduce(
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

  return (

    <Layout>

      <div className="min-h-screen bg-gray-100 p-6">

        <h1 className="text-3xl font-bold text-blue-900 mb-6">
          Finanzas
        </h1>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">

            <p className="text-gray-500">
              Ingresos
            </p>

            <h2 className="text-4xl font-bold text-green-600 mt-2">

              S/ {totalSales}

            </h2>

          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">

            <p className="text-gray-500">
              Gastos
            </p>

            <h2 className="text-4xl font-bold text-red-600 mt-2">

              S/ {totalExpenses}

            </h2>

          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">

            <p className="text-gray-500">
              Utilidad Neta
            </p>

            <h2 className="text-4xl font-bold text-blue-600 mt-2">

              S/ {netProfit}

            </h2>

          </div>

        </div>

        {/* formulario */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8 max-w-xl">

          <div className="space-y-4">

            <input
              type="text"
              placeholder="Descripción gasto"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              className="w-full border border-gray-200 rounded-xl p-4"
            />

            <input
              type="number"
              placeholder="Monto"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
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
              className="w-full bg-red-600 hover:bg-red-700 text-white p-4 rounded-xl font-bold"
            >
              Registrar Gasto
            </button>

          </div>

        </div>

        {/* tabla */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          <table className="w-full">

            <thead className="bg-gray-50">

              <tr>

                <th className="p-4 text-left">
                  Descripción
                </th>

                <th className="p-4 text-left">
                  Categoría
                </th>

                <th className="p-4 text-left">
                  Monto
                </th>

                <th className="p-4 text-left">
                  Fecha
                </th>

              </tr>

            </thead>

            <tbody>

              {expenses.map((item) => (

                <tr
                  key={item.id}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="p-4">
                    {item.description}
                  </td>

                  <td className="p-4">
                    {item.category}
                  </td>

                  <td className="p-4 text-red-600 font-bold">
                    S/ {item.amount}
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

export default FinancePage;