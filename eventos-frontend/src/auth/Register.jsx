import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Auth from "./Auth";
import { createEmpresa } from "../services/empresas";
import { getCsrfCookie } from "../services/api";

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    cif: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();

  const validate = (fieldValues = formData) => {
    let temp = { ...errors };

    if ("nombre" in fieldValues)
      temp.nombre = fieldValues.nombre ? "" : "El nombre es obligatorio";

    if ("cif" in fieldValues)
      temp.cif = /^[A-Za-z0-9]{8,10}$/.test(fieldValues.cif)
        ? ""
        : "El CIF debe tener entre 8 y 10 caracteres alfanuméricos";

    if ("email" in fieldValues)
      temp.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fieldValues.email)
        ? ""
        : "Email no válido";

    if ("password" in fieldValues)
      temp.password = fieldValues.password.length >= 6
        ? ""
        : "La contraseña debe tener al menos 6 caracteres";

    setErrors({
      ...temp,
    });

    return Object.values(temp).every((x) => x === "");
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (touched[name]) {
      validate({ [name]: value });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({
      ...touched,
      [name]: true,
    });
    validate({ [name]: formData[name] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = {
      nombre: formData.nombre,
      cif: formData.cif,
      email: formData.email,
      password: formData.password,
    };

    try {
      await getCsrfCookie();
      
      await createEmpresa(data);
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors((prev) => ({
          ...prev,
          general: error.response.data.message || "Error al registrarse",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          general: "Error de red. Intenta más tarde.",
        }));
      }
    }
  };


  return (
    <Auth>
      <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">Registrarse</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.nombre ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-indigo-400"
              }`}
          />
          {touched.nombre && errors.nombre && (
            <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.email ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-indigo-400"
              }`}
          />
          {touched.email && errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">CIF / DNI</label>
          <input
            type="text"
            name="cif"
            value={formData.cif}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.cif ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-indigo-400"
              }`}
          />
          {touched.cif && errors.cif && (
            <p className="text-red-500 text-sm mt-1">{errors.cif}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Contraseña</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.password ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-indigo-400"
              }`}
          />
          {touched.password && errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {errors.general && <p className="text-center text-sm text-red-600 mb-4">{errors.general}</p>}

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
