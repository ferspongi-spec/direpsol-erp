import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Boxes,
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
  DollarSign,
  BarChart3,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useState } from "react";

function Layout({ children }) {

  const [open, setOpen] =
    useState(false);

  const [darkMode, setDarkMode] =
    useState(false);

  const navigate =
    useNavigate();

  const seller =
    JSON.parse(
      localStorage.getItem("seller")
    );

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  const handleLogout = () => {

    localStorage.removeItem("user");

    localStorage.removeItem("seller");

    navigate("/");

  };

  return (

    <div
      className={`flex min-h-screen ${
        darkMode
          ? "bg-gray-900"
          : "bg-gray-100"
      }`}
    >

      {/* SIDEBAR */}
      <div
        className={`fixed md:relative z-50 md:z-0 h-screen w-72 bg-gradient-to-b from-blue-950 to-blue-900 text-white p-6 flex flex-col justify-between transition-all duration-300 ${
          open
            ? "left-0"
            : "-left-72"
        } md:left-0`}
      >

        <div>

          {/* LOGO */}
          <div className="mb-10">

            <h1 className="text-4xl font-extrabold tracking-wide">
              DIREPSOL
            </h1>

            <p className="text-blue-200 mt-2 text-sm">
              ERP Distribuidora GLP
            </p>

          </div>

          {/* MENÚ */}
          <nav className="space-y-4">

            {/* ADMINISTRADOR */}
            {user && (
              <>

                <Link
                  to="/dashboard"
                  className="flex items-center gap-3 hover:bg-white/10 transition p-4 rounded-xl font-medium"
                >
                  <LayoutDashboard size={20} />
                  Dashboard
                </Link>

                <Link
                  to="/inventory"
                  className="flex items-center gap-3 hover:bg-white/10 transition p-4 rounded-xl font-medium"
                >
                  <Package size={20} />
                  Inventario General
                </Link>

                <Link
                  to="/dispatch"
                  className="flex items-center gap-3 hover:bg-white/10 transition p-4 rounded-xl font-medium"
                >
                  <Boxes size={20} />
                  Despacho
                </Link>

                <Link
                  to="/seller-inventory"
                  className="flex items-center gap-3 hover:bg-white/10 transition p-4 rounded-xl font-medium"
                >
                  <DollarSign size={20} />
                  Caja Vendedores
                </Link>

                <Link
                  to="/reports"
                  className="flex items-center gap-3 hover:bg-white/10 transition p-4 rounded-xl font-medium"
                >
                  <BarChart3 size={20} />
                  Reportes
                </Link>

              </>
            )}

            {/* VENDEDOR */}
            {seller && (
              <>

                <Link
                  to="/sales"
                  className="flex items-center gap-3 hover:bg-white/10 transition p-4 rounded-xl font-medium"
                >
                  <ShoppingCart size={20} />
                  Registrar Ventas
                </Link>

                <Link
                  to="/my-inventory"
                  className="flex items-center gap-3 hover:bg-white/10 transition p-4 rounded-xl font-medium"
                >
                  <Package size={20} />
                  Mi Inventario
                </Link>

                <Link
                  to="/cash"
                  className="flex items-center gap-3 hover:bg-white/10 transition p-4 rounded-xl font-medium"
                >
                  <DollarSign size={20} />
                  Mi Caja
                </Link>

              </>
            )}

          </nav>

        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 transition px-4 py-4 rounded-xl w-full font-semibold"
        >
          <LogOut size={20} />
          Cerrar Sesión
        </button>

      </div>

      {/* BOTÓN MÓVIL */}
      <button
        onClick={() =>
          setOpen(!open)
        }
        className="fixed top-4 left-4 z-50 md:hidden bg-blue-900 text-white p-3 rounded-xl shadow-lg"
      >

        {
          open
            ? <X size={24} />
            : <Menu size={24} />
        }

      </button>

      {/* CONTENIDO */}
      <div className="flex-1">

        <header
          className={`shadow-sm px-8 py-4 flex items-center justify-between ${
            darkMode
              ? "bg-gray-800 text-white"
              : "bg-white"
          }`}
        >

          <div>

            <h2
              className={`text-2xl font-bold ${
                darkMode
                  ? "text-white"
                  : "text-gray-800"
              }`}
            >
              Bienvenido 👋
            </h2>

            <p
              className={`${
                darkMode
                  ? "text-gray-300"
                  : "text-gray-500"
              }`}
            >
              Sistema ERP DIREPSOL
            </p>

          </div>

          <div className="flex items-center gap-4">

            <button
              onClick={() =>
                setDarkMode(!darkMode)
              }
              className={`p-3 rounded-xl transition ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >

              {
                darkMode
                  ? <Sun size={22} />
                  : <Moon size={22} />
              }

            </button>

            <div className="text-right">

              <p
                className={`font-bold ${
                  darkMode
                    ? "text-white"
                    : "text-gray-800"
                }`}
              >
                {seller?.name || "Administrador"}
              </p>

              <p
                className={`text-sm ${
                  darkMode
                    ? "text-gray-300"
                    : "text-gray-500"
                }`}
              >
                {new Date().toLocaleDateString()}
              </p>

            </div>

            <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
              D
            </div>

          </div>

        </header>

        <main className="p-8">

          {children}

        </main>

      </div>

    </div>

  );
}

export default Layout;