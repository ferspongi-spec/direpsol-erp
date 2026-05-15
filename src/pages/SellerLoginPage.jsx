 import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginSeller } from "../services/authService";

function SellerLoginPage() {
  const navigate = useNavigate();

  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const seller = await loginSeller(pin);

      localStorage.setItem(
        "seller",
        JSON.stringify(seller)
      );

      navigate("/sales");
    } catch (error) {
      setError("PIN incorrecto");
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4">

      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">

        <h1 className="text-3xl font-bold text-center text-blue-900">
          DIREPSOL
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Acceso Vendedor
        </p>

        <input
          type="password"
          placeholder="PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className="w-full border rounded-xl p-3 mt-6"
        />

        {error && (
          <p className="text-red-500 text-sm mt-2">
            {error}
          </p>
        )}

        <button
          onClick={handleLogin}
          className="w-full bg-orange-500 text-white rounded-xl p-3 mt-4"
        >
          Ingresar
        </button>

      </div>

    </div>
  );
}

export default SellerLoginPage;