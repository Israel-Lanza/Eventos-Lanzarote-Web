import { useEffect, useState } from "react";
import { createEmpresa, updateEmpresa } from "../services/empresas";
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

function FormularioEmpresa({ closeModal, empresaEditar = null, onActualizar }) {
  const [formData, setFormData] = useState({
    nombre: "",
    cif: "",
    email: "",
    password: "",
  });
  const { t } = useTranslation();
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
      temp.nombre = fieldValues.nombre ? "" : t("form.errors.name");

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
  
    
    validate();
  
    const data = new FormData();
    data.append("nombre", formData.nombre);
    data.append("cif", formData.cif);
    data.append("email", formData.email);
    data.append("password", formData.password);
  
    try {
      let resultado;
      if (empresaEditar) {
        resultado = await updateEmpresa(empresaEditar.id, data);
      } else {
        resultado = await createEmpresa(data);
      }
  
      if (resultado) {
        if (onActualizar) onActualizar();
        toast.success(empresaEditar ? t("user_updated") : t("user_created"));
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
      } else{
        toast.error(t("errors.user_process"));
      }
    }
  };
  

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 py-6 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-screen-sm bg-white rounded-lg shadow-md p-4 sm:p-6 md:p-8 space-y-5"
      >
        {/* NOMBRE */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium text-sm mb-1">{t("form.name")}</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder={t("form.name")}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.nombre && errors.nombre && (
            <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>
          )}
        </div>
  
        {/* CIF */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium text-sm mb-1">CIF / DNI</label>
          <input
            type="text"
            name="cif"
            value={formData.cif}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="CIF / DNI"
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.cif && errors.cif && (
            <p className="text-red-500 text-xs mt-1">{errors.cif}</p>
          )}
        </div>
  
        {/* EMAIL */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium text-sm mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Email"
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.email && errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>
  
        {/* PASSWORD */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium text-sm mb-1">{t("form.password")}</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder={t("form.password")}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.password && errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>
  
        {/* BOTÓN */}
        <button
          type="submit"
          className="w-full py-2 px-4 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        >
          {empresaEditar ? t("update_user") : t("create_user")}
        </button>
      </form>
    </div>
  );
  
}

export default FormularioEmpresa;
