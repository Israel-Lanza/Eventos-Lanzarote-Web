import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Auth from "./Auth";
import { createEmpresa } from "../services/empresas";
import { getCsrfCookie } from "../services/api";
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    cif: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [errores, setErrores] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validarCampoVacio = (nombreCampo, valor) => {
    if (!valor.trim()) {
      setErrores((prev) => ({
        ...prev,
        [nombreCampo]: ["Este campo es obligatorio."],
      }));
    } else {
      setErrores((prev) => {
        const nuevos = { ...prev };
        delete nuevos[nombreCampo];
        return nuevos;
      });
    }
  };

  const validarConfirmacionContraseña = () => {
    if (
      formData.password &&
      formData.password_confirmation &&
      formData.password !== formData.password_confirmation
    ) {
      setErrores((prev) => ({
        ...prev,
        password_confirmation: ["Las contraseñas no coinciden."],
      }));
    } else {
      setErrores((prev) => {
        const nuevos = { ...prev };
        delete nuevos.password_confirmation;
        return nuevos;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrores({});

    // Validaciones básicas antes de enviar
    if (!formData.nombre.trim() || !formData.email.trim() || !formData.cif.trim() || !formData.password.trim() || !formData.password_confirmation.trim()) {
      setErrores((prev) => ({
        ...prev,
        general: "Rellena todos los campos obligatorios.",
      }));
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      setErrores((prev) => ({
        ...prev,
        password_confirmation: ["Las contraseñas no coinciden."],
      }));
      return;
    }

    try {
      await getCsrfCookie();
      await createEmpresa({
        nombre: formData.nombre,
        cif: formData.cif,
        email: formData.email,
        password: formData.password,
      });
      toast.success('Usuario registrado correctamente. Revisa tu correo para verificar la cuenta.');
      setTimeout(() => {
        navigate("/login");
      }, 400);

    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrores(error.response.data.errors || {});
      } else {
        setErrores({ general: "Error de red. Intenta más tarde." });
      }
    }
  };

  return (
    <Auth>
      <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">Registrarse</h2>

      <form onSubmit={handleSubmit}>
        {/* Nombre */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            onBlur={(e) => validarCampoVacio("nombre", e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errores.nombre ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-indigo-400"
              }`}
          />
          {errores.nombre && <p className="text-red-500 text-sm mt-1">{errores.nombre[0]}</p>}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={(e) => validarCampoVacio("email", e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errores.email ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-indigo-400"
              }`}
          />
          {errores.email && <p className="text-red-500 text-sm mt-1">{errores.email[0]}</p>}
        </div>

        {/* CIF */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">CIF / DNI</label>
          <input
            type="text"
            name="cif"
            value={formData.cif}
            onChange={handleChange}
            onBlur={(e) => validarCampoVacio("cif", e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errores.cif ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-indigo-400"
              }`}
          />
          {errores.cif && <p className="text-red-500 text-sm mt-1">{errores.cif[0]}</p>}
        </div>

        {/* Contraseña */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Contraseña</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={(e) => {
              validarCampoVacio("password", e.target.value);
              validarConfirmacionContraseña();
            }}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errores.password ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-indigo-400"
              }`}
          />
          {errores.password && <p className="text-red-500 text-sm mt-1">{errores.password[0]}</p>}
        </div>

        {/* Repetir contraseña */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Repetir contraseña</label>
          <input
            type="password"
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleChange}
            onBlur={(e) => {
              validarCampoVacio("password_confirmation", e.target.value);
              validarConfirmacionContraseña();
            }}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errores.password_confirmation ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-indigo-400"
              }`}
          />
          {errores.password_confirmation && (
            <p className="text-red-500 text-sm mt-1">{errores.password_confirmation[0]}</p>
          )}
        </div>

        {/* Error general */}
        {errores.general && (
          <p className="text-center text-sm text-red-600 mb-4">{errores.general}</p>
        )}

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Registrarse
        </button>
      </form>

      <div className="mt-6 text-sm text-center text-gray-600">
        ¿Ya tienes cuenta?{" "}
        <Link to="/login" className="text-indigo-600 hover:underline">
          Iniciar Sesión
        </Link>
      </div>

      <div className="mt-4 text-center">
        <button
          onClick={() => navigate('/')}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          ← Volver atrás
        </button>
      </div>
    </Auth>
  );
};

export default Register;
