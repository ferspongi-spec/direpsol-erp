import {
  Routes,
  Route,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import SalesPage from "./pages/SalesPage";
import InventoryPage from "./pages/InventoryPage";
import CashPage from "./pages/CashPage";
import SellerLoginPage from "./pages/SellerLoginPage";
import FisePage from "./pages/FisePage";
import FinancePage from "./pages/FinancePage";
import ProductsPage from "./pages/ProductsPage";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  return (

    <Routes>

      {/* LOGIN */}
      <Route
        path="/"
        element={<LoginPage />}
      />

      {/* DASHBOARD */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute adminOnly={true}>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* INVENTARIO */}
      <Route
        path="/inventory"
        element={
          <ProtectedRoute adminOnly={true}>
            <InventoryPage />
          </ProtectedRoute>
        }
      />

      {/* PRODUCTOS */}
      <Route
        path="/products"
        element={
          <ProtectedRoute adminOnly={true}>
            <ProductsPage />
          </ProtectedRoute>
        }
      />

      {/* FINANZAS */}
      <Route
        path="/finance"
        element={
          <ProtectedRoute adminOnly={true}>
            <FinancePage />
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

      {/* FISE */}
      <Route
        path="/fise"
        element={
          <ProtectedRoute>
            <FisePage />
          </ProtectedRoute>
        }
      />

      {/* VENTAS */}
      <Route
        path="/sales"
        element={<SalesPage />}
      />

      {/* LOGIN VENDEDOR */}
      <Route
        path="/seller-login"
        element={<SellerLoginPage />}
      />

    </Routes>

  );
}

export default App;