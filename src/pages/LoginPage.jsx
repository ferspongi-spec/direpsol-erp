import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  loginUser,
  loginSeller,
} from "../services/authService";

function LoginPage() {

  const navigate =
    useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [pin, setPin] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // login administrador
  const handleAdminLogin =
    async () => {

      setError("");

      setLoading(true);

      try {

        const user =
          await loginUser(
            email,
            password
          );

        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );

        navigate("/dashboard");

      } catch (error) {

        setError(
          "Correo o contraseña incorrectos"
        );

      }

      setLoading(false);
  };

  // login vendedor
  const handleSellerLogin =
    async () => {

      setError("");

      try {

        const seller =
          await loginSeller(pin);

        localStorage.setItem(
          "seller",
          JSON.stringify(seller)
        );

        navigate("/sales");

      } catch (error) {

        setError(
          "PIN incorrecto"
        );

      }
  };

  return (

    <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4">

      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center text-blue-900">
          DIREPSOL ERP
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Sistema de Ventas GLP
        </p>

        <div className="mt-8 space-y-4">

          {/* ADMIN */}

          <h2 className="font-bold text-lg">
            Administrador
          </h2>

          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full border rounded-xl p-3"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full border rounded-xl p-3"
          />

          <button
            onClick={handleAdminLogin}
            disabled={loading}
            className="w-full bg-blue-900 text-white rounded-xl p-3 font-semibold"
          >
            {
              loading
                ? "Ingresando..."
                : "Ingresar Admin"
            }
          </button>

          {/* VENDEDOR */}

          <h2 className="font-bold text-lg pt-6">
            Vendedor
          </h2>

          <input
            type="password"
            placeholder="PIN vendedor"
            value={pin}
            onChange={(e) =>
              setPin(e.target.value)
            }
            className="w-full border rounded-xl p-3"
          />

          <button
            onClick={handleSellerLogin}
            className="w-full bg-orange-500 text-white rounded-xl p-3 font-semibold"
          >
            Ingresar Vendedor
          </button>

          {/* ERROR */}

          {error && (

            <p className="text-red-500 text-sm text-center">
              {error}
            </p>

          )}

        </div>

      </div>

    </div>
  );
}

export default LoginPage;