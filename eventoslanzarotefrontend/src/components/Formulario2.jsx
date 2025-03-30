import { useState } from "react";
import { createEvento } from "../services/eventos";
import { ArrowLeft, Calendar, Clock, MapPin, Upload, Euro, Link as LinkIcon } from "lucide-react";


function Formulario() {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    fecha: "",
    fechaFin: "",
    hora: "",
    precio: "",
    ubicacion: "",
    enlaceWeb: "",
    imagen: null,
    categorias: [],
  });

  const [mostrarFechaFin, setMostrarFechaFin] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      imagen: e.target.files[0],
    });
  };

  const handleCategoriaChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({
        ...formData,
        categorias: [...formData.categorias, value],
      });
    } else {
      setFormData({
        ...formData,
        categorias: formData.categorias.filter((cat) => cat !== value),
      });
    }
  };

  const handleFechaFinCheckbox = (e) => {
    setMostrarFechaFin(e.target.checked);
    // Opcional: limpiar el campo fechaFin si se desactiva
    if (!e.target.checked) {
      setFormData((prev) => ({ ...prev, fechaFin: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("nombre", formData.nombre);
    data.append("descripcion", formData.descripcion);
    data.append("fecha", formData.fecha);
    if (mostrarFechaFin && formData.fechaFin) {
      data.append("fechaFin", formData.fechaFin);
    }
    data.append("hora", formData.hora);
    data.append("precio", formData.precio);
    data.append("ubicacion", formData.ubicacion);
    data.append("enlaceWeb", formData.enlaceWeb);
    if (formData.imagen) {
      data.append("imagen", formData.imagen);
    }
    formData.categorias.forEach((categoria) => data.append("categorias[]", categoria));

    const resultado = await createEvento(data);
    if (resultado) {
      alert("Evento creado con éxito");
    }
  };
  return (
    <form onSubmit={handleSubmit} className="container mx-auto p-6 bg-white rounded-lg shadow-lg space-y-6">
      {/* Nombre */}
      <div>
        <label className="block text-gray-700 font-bold mb-2">Título del Evento</label>
        <input
          type="text"
          name="nombre"
          className="w-full px-4 py-2 border rounded-md"
          placeholder="Título del Evento"
          onChange={handleChange}
        />
      </div>

      {/* Fecha, Hora y Ubicación */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-gray-700 font-bold mb-2">Fecha de Inicio</label>
          <div className="flex items-center border rounded-md px-3 py-2">
            <Calendar size={16} className="mr-2" />
            <input type="date" name="fecha" className="w-full" onChange={handleChange} />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">Fecha de Fin (opcional)</label>
          <div className="flex items-center border rounded-md px-3 py-2">
            <Calendar size={16} className="mr-2" />
            <input type="date" name="fechaFin" className="w-full" onChange={handleChange} />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">Hora</label>
          <div className="flex items-center border rounded-md px-3 py-2">
            <Clock size={16} className="mr-2" />
            <input type="time" name="hora" className="w-full" onChange={handleChange} />
          </div>
        </div>
      </div>

      {/* Categorías */}
      <div>
        <label className="block text-gray-700 font-bold mb-2">Categorías</label>
        <div className="flex space-x-6">
          {["musica", "deportes", "arte"].map((cat) => (
            <label key={cat} className="flex items-center space-x-2">
              <input type="checkbox" value={cat} onChange={handleCategoriaChange} />
              <span>{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Precio y Enlace Web */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 font-bold mb-2">Precio</label>
          <div className="flex items-center border rounded-md px-3 py-2">
            <Euro size={16} className="mr-2" />
            <input
              type="number"
              name="precio"
              className="w-full"
              placeholder="0.00"
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">Enlace Web</label>
          <div className="flex items-center border rounded-md px-3 py-2">
            <LinkIcon size={16} className="mr-2" />
            <input
              type="url"
              name="enlaceWeb"
              className="w-full"
              placeholder="https://"
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
      {/* Descripción */}
      <div>
        <label className="block text-gray-700 font-bold mb-2">Descripción</label>
        <textarea
          name="descripcion"
          rows={5}
          className="w-full p-4 border rounded-md"
          placeholder="Describe tu evento en detalle..."
          onChange={handleChange}
        ></textarea>
      </div>

      {/* Imagen */}
      <div>
        <label className="block text-gray-700 font-bold mb-2">Imagen del Evento</label>
        <div className="flex flex-col items-center justify-center border rounded-md py-6 px-4 mb-4 bg-gray-100">
          <Upload size={32} className="mb-2" />
          <p className="text-gray-600 mb-2">Sube una imagen representativa</p>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
      </div>

      {/* Botón */}
      <button
        type="submit"
        className="w-full py-2 px-4 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition"
      >
        Crear Evento
      </button>
    </form>
  );
}

export default Formulario;