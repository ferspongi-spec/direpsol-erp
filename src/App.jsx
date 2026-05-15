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

import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  return (

    <Routes>

      {/* LOGIN */}

      <Route
        path="/"
        element={<LoginPage />}
      />

      {/* ADMIN */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/inventory"
        element={
          <ProtectedRoute>
            <InventoryPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/cash"
        element={
          <ProtectedRoute>
            <CashPage />
          </ProtectedRoute>
        }
      />

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

      <Route
        path="/seller-login"
        element={<SellerLoginPage />}
      />

    </Routes>
  );
}

export default App;