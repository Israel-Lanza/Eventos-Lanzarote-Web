import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      const response = await api.post("/login", { email, password });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        const roles = response.data.user.roles;

        if (roles.includes("admin") || roles.includes("empresa")) {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Imagen lateral */}
      <div className="hidden md:flex md:w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('https://hips.hearstapps.com/hmg-prod/images/carretera-de-lanzarote-parque-timanfaya-canarias-1621531417.jpg?crop=1.00xw:1.00xh;0,0&resize=1024:*')" }} />

      {/* Formulario */}
      <div className="flex flex-col justify-center items-center md:w-1/2 p-8 bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">Iniciar Sesión</h2>

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">Email</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.email ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-indigo-400"
                }`}
              />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.password ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-indigo-400"
                }`}
              />
              {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
            </div>

            {errors.general && <p className="text-center text-sm text-red-600 mb-4">{errors.general}</p>}

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Entrar
            </button>
          </form>

          <div className="mt-6 text-sm text-center text-gray-600">
            ¿No tienes cuenta?{" "}
            <Link to="/registro" className="text-indigo-600 hover:underline">
              Regístrate aquí
            </Link>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => navigate(-1)}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              ← Volver atrás
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
