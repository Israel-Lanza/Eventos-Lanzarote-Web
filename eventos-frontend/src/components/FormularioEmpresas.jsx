import { useEffect, useState } from "react";
import { createEvento, updateEvento } from "../services/eventos";

function FormularioEmpresa({ closeModal, empresaEditar = null, onActualizar }) {
  const [formData, setFormData] = useState({
    nombre: "",
    cif: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (empresaEditar) {
      setFormData({
        nombre: empresaEditar.nombre || "",
        cif: empresaEditar.cif || "",
        email: empresaEditar.email || "",
        password: empresaEditar.password || "",
      });
    }
  }, [empresaEditar]);

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

    const data = new FormData();
    data.append("nombre", formData.nombre);
    data.append("cif", formData.cif);
    data.append("email", formData.email);
    data.append("password", formData.password);

    try {
      let resultado;
      if (empresaEditar) {
        resultado = await updateEvento(empresaEditar.id, data);
      } else {
        resultado = await createEvento(data);
      }

      if (resultado) {
        if (onActualizar) onActualizar();
        closeModal();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        const backendErrors = {};
        Object.keys(error.response.data.errors).forEach((campo) => {
          backendErrors[campo] = error.response.data.errors[campo][0];
        });
        setErrors(backendErrors);
        setTouched((prev) => ({
          ...prev,
          ...Object.keys(backendErrors).reduce((acc, campo) => {
            acc[campo] = true;
            return acc;
          }, {}),
        }));
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container mx-auto p-6 bg-white rounded-lg shadow-lg space-y-6">
      {/* NOMBRE */}
      <div>
        <label className="block text-gray-700 font-bold mb-2">Nombre</label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          className="w-full px-4 py-2 border rounded-md"
          placeholder="Nombre de la empresa"
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.nombre && errors.nombre && (
          <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>
        )}
      </div>

      {/* CIF */}
      <div>
        <label className="block text-gray-700 font-bold mb-2">CIF</label>
        <input
          type="text"
          name="cif"
          value={formData.cif}
          className="w-full px-4 py-2 border rounded-md"
          placeholder="CIF / DNI"
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.cif && errors.cif && (
          <p className="text-red-500 text-sm mt-1">{errors.cif}</p>
        )}
      </div>

      {/* EMAIL */}
      <div>
        <label className="block text-gray-700 font-bold mb-2">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          className="w-full px-4 py-2 border rounded-md"
          placeholder="Email"
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.email && errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      {/* PASSWORD */}
      <div>
        <label className="block text-gray-700 font-bold mb-2">Contraseña</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          className="w-full px-4 py-2 border rounded-md"
          placeholder="Contraseña"
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.password && errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition"
      >
        {empresaEditar ? 'Actualizar Empresa' : 'Alta Empresa'}
      </button>
    </form>
  );
}

export default FormularioEmpresa;
