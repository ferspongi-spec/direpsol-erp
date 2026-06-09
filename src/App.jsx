import {
  Routes,
  Route,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import SalesPage from "./pages/SalesPage";
import InventoryPage from "./pages/InventoryPage";
import CashPage from "./pages/CashPage";

import DispatchPage from "./pages/DispatchPage";
import SellerInventoryPage from "./pages/SellerInventoryPage";
import ReportsPage from "./pages/ReportsPage";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  return (

    <Routes>

      {/* LOGIN */}
      <Route
        path="/"
        element={<LoginPage />}
      />

      {/* DASHBOARD ADMIN */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute adminOnly={true}>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* INVENTARIO GENERAL */}
      <Route
        path="/inventory"
        element={
          <ProtectedRoute adminOnly={true}>
            <InventoryPage />
          </ProtectedRoute>
        }
      />

      {/* DESPACHO A VENDEDORES */}
      <Route
        path="/dispatch"
        element={
          <ProtectedRoute adminOnly={true}>
            <DispatchPage />
          </ProtectedRoute>
        }
      />

      {/* CAJA / INVENTARIO VENDEDORES */}
      <Route
        path="/seller-inventory"
        element={
          <ProtectedRoute adminOnly={true}>
            <SellerInventoryPage />
          </ProtectedRoute>
        }
      />

      {/* REPORTES */}
      <Route
        path="/reports"
        element={
          <ProtectedRoute adminOnly={true}>
            <ReportsPage />
          </ProtectedRoute>
        }
      />

      {/* CAJA */}
      <Route
        path="/cash"
        element={
          <ProtectedRoute>
            <CashPage />
          </ProtectedRoute>
        }
      />

      {/* VENTAS */}
      <Route
        path="/sales"
        element={
          <ProtectedRoute>
            <SalesPage />
          </ProtectedRoute>
        }
      />

    </Routes>

  );
}

export default App;