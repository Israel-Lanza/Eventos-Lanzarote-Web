import { useEffect, useState, useRef } from "react";
import { createEvento, updateEvento } from "../services/eventos";
import categoriasDisponibles from "../constantes/categorias";
import { Calendar, Clock, Upload, Euro, Link as LinkIcon, CheckCircle } from "lucide-react";

export default function Formulario({ closeModal, eventoEditar = null, onActualizar }) {
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

  const [errores, setErrores] = useState({});
  const [mostrarFechaFin, setMostrarFechaFin] = useState(false);
  const [eventoCreado, setEventoCreado] = useState(false);
  const inputRef = useRef(null);


  useEffect(() => {
    if (eventoEditar) {
      console.log("categorías del evento a editar:", eventoEditar.nombre);
      setFormData({
        nombre: eventoEditar.nombre || "",
        descripcion: eventoEditar.descripcion || "",
        fecha: eventoEditar.fecha || "",
        fechaFin: eventoEditar.fechaFin || "",
        hora: eventoEditar.hora || "",
        precio: eventoEditar.precio || "",
        ubicacion: eventoEditar.ubicacion || "",
        enlaceWeb: eventoEditar.enlace || "",
        imagen: null,
        categorias: eventoEditar.categorias?.map(c => c.sigla) || [],
      });
      if (eventoEditar.fechaFin) setMostrarFechaFin(true);
    }
  }, [eventoEditar]);

  useEffect(() => {
    if (window.google && inputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ["geocode"],
      });

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.formatted_address) {
          setFormData(prev => ({ ...prev, ubicacion: place.formatted_address }));
        } else if (place.name) {
          setFormData(prev => ({ ...prev, ubicacion: place.name }));
        }
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setFormData(prev => {
      const updatedData = { ...prev, [name]: value };
  
      //Lógica adicional para limpiar fechaFin si ya no es válida
      if (name === 'fecha' && prev.fechaFin && value > prev.fechaFin) {
        updatedData.fechaFin = '';
      }
  
      return updatedData;
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
    setFormData((prev) => ({
      ...prev,
      categorias: checked
        ? [...prev.categorias, value]
        : prev.categorias.filter((cat) => cat !== value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrores({});
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
    data.append("enlace", formData.enlaceWeb);
    if (formData.imagen) {
      data.append("imagen", formData.imagen);
    }
    formData.categorias.forEach((categoria) => data.append("categorias[]", categoria));

    try {
      let resultado;
      if (eventoEditar) {
        resultado = await updateEvento(eventoEditar.id, data);
      } else {
        resultado = await createEvento(data);
      }
  
      if (resultado) {
        setEventoCreado(true); 

        if (onActualizar) onActualizar();
      }
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setEventoCreado(false);
        setErrores(error.response.data.errors);
      } else {
        console.error("Error en el formulario:", error);
      }
    }
    
  };

  return (
    <form onSubmit={handleSubmit} className="container mx-auto p-6 bg-white rounded-lg shadow-lg space-y-6">

      <div>
        <label className="block text-gray-700 font-bold mb-2">Título del Evento</label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          className="w-full px-4 py-2 border rounded-md"
          placeholder="Título del Evento"
          onChange={handleChange}
          disabled={eventoCreado}
        />
        {errores.nombre && (
          <p className="text-red-600 text-sm mt-1">{errores.nombre[0]}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-gray-700 font-bold mb-2">Fecha de Inicio</label>
          <div className="flex items-center border rounded-md px-3 py-2">
            <Calendar size={16} className="mr-2" />
            <input type="date" name="fecha" value={formData.fecha} className="w-full" onChange={handleChange} disabled={eventoCreado} />
          </div>
          {errores.fecha && (
            <p className="text-red-600 text-sm mt-1">{errores.fecha[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">Fecha de Fin (opcional)</label>
          <div className="flex items-center border rounded-md px-3 py-2">
            <Calendar size={16} className="mr-2" />
            <input type="date" name="fechaFin" value={formData.fechaFin} min={formData.fecha || ""} className="w-full" onChange={handleChange} disabled={eventoCreado} />
          </div>
          {errores.fechaFin && (
            <p className="text-red-600 text-sm mt-1">{errores.fechaFin[0]}</p>
          )}  
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">Hora</label>
          <div className="flex items-center border rounded-md px-3 py-2">
            <Clock size={16} className="mr-2" />
            <input type="time" name="hora" value={formData.hora} className="w-full" onChange={handleChange} disabled={eventoCreado} />
          </div>
          {errores.hora && (
            <p className="text-red-600 text-sm mt-1">{errores.hora[0]}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-gray-700 font-bold mb-2">Categorías</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {Object.entries(categoriasDisponibles).map(([key, cat]) => (
            <label key={key} className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="categorias"
                value={cat.sigla}
                checked={formData.categorias.includes(cat.sigla)}
                onChange={handleCategoriaChange}
                disabled={eventoCreado}
              />
              <span>{cat.display}</span>
            </label>
          ))}
        </div>
        {errores.categorias && (
          <p className="text-red-600 text-sm mt-1">{errores.categorias[0]}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 font-bold mb-2">Precio</label>
          <div className="flex items-center border rounded-md px-3 py-2">
            <Euro size={16} className="mr-2" />
            <input
              type="number"
              name="precio"
              min="0"
              step="0.01"
              className="w-full"
              value={formData.precio}
              onChange={handleChange}
              disabled={eventoCreado}
            />
          </div>
          {errores.precio && (
            <p className="text-red-600 text-sm mt-1">{errores.precio[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">Enlace Web (Opcional)</label>
          <div className="flex items-center border rounded-md px-3 py-2">
            <LinkIcon size={16} className="mr-2" />
            <input
              type="url"
              name="enlaceWeb"
              className="w-full"
              placeholder="https://"
              value={formData.enlaceWeb}
              onChange={handleChange}
              disabled={eventoCreado}
            />
          </div>
          {errores.enlace && (
            <p className="text-red-600 text-sm mt-1">{errores.enlace[0]}</p>
          )}
        </div>
      </div>
      


      <div>
        <label className="block text-gray-700 font-bold mb-2">Ubicación</label>
        <input
          ref={inputRef}
          type="text"
          name="ubicacion"
          value={formData.ubicacion}
          className="w-full px-4 py-2 border rounded-md"
          placeholder="Ubicación del evento"
          onChange={handleChange}
          disabled={eventoCreado}
        />
        {errores.ubicacion && (
          <p className="text-red-600 text-sm mt-1">{errores.ubicacion[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-gray-700 font-bold mb-2">Descripción</label>
        <textarea
          name="descripcion"
          rows={5}
          className="w-full p-4 border rounded-md"
          placeholder="Describe tu evento en detalle..."
          value={formData.descripcion}
          onChange={handleChange}
          disabled={eventoCreado}
        ></textarea>
        {errores.descripcion && (
          <p className="text-red-600 text-sm mt-1">{errores.descripcion[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-gray-700 font-bold mb-2">Imagen del Evento (Opcional)</label>
        <div className="flex flex-col items-center justify-center border rounded-md py-6 px-4 mb-4 bg-gray-100">
          <Upload size={32} className="mb-2" />
          <p className="text-gray-600 mb-2">Sube una imagen representativa</p>
          <input type="file" name="imagen" id="imagen" onChange={handleImageChange} className="form-control" disabled={eventoCreado} />
        </div>
        {errores.imagen && (
          <p className="text-red-600 text-sm mt-1">{errores.imagen[0]}</p>
        )}
      </div>
      {eventoCreado && (
        <div className="flex items-center justify-between p-4 mb-4 bg-green-100 border border-green-400 text-green-800 rounded">
          <CheckCircle className="mr-2" /> 
          {eventoEditar ? "Evento actualizado correctamente." : "Evento creado correctamente."}
        </div>
      )}


      {!eventoCreado && (
        <button
          type="submit"
          className="w-full py-2 px-4 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition"
        >
          {eventoEditar ? 'Actualizar Evento' : 'Crear Evento'}
        </button>
      )}
    </form>
  );
}


