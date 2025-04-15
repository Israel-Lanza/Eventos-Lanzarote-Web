import { useEffect, useState, useRef } from "react";
import { createEvento, updateEvento } from "../services/eventos";
import categoriasDisponibles from "../constantes/categorias";
import {
  Calendar,
  Clock,
  Upload,
  Euro,
  Link as LinkIcon,
  CheckCircle,
} from "lucide-react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";

export default function Formulario({ closeModal, eventoEditar = null, onActualizar }) {
  const pasos = ['Información general', 'Detalles del evento', 'Extras'];
  const [pasoActual, setPasoActual] = useState(0);
  const [pasosFallidos, setPasosFallidos] = useState(new Set());

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
      if (name === 'fecha' && prev.fechaFin && value > prev.fechaFin) {
        updatedData.fechaFin = '';
      }
      return updatedData;
    });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, imagen: e.target.files[0] });
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

  const validarPaso = () => {
    const erroresPaso = {};

    if (pasoActual === 0) {
      if (!formData.nombre) erroresPaso.nombre = ["El título es obligatorio."];
      if (!formData.fecha) erroresPaso.fecha = ["La fecha es obligatoria."];
      if (!formData.hora) erroresPaso.hora = ["La hora es obligatoria."];
      if (formData.precio === "") erroresPaso.precio = ["El precio es obligatorio."];
      if (formData.fecha && formData.fechaFin && formData.fechaFin < formData.fecha) {
        erroresPaso.fechaFin = ["La fecha de fin no puede ser anterior a la de inicio."];
      }
    }

    if (pasoActual === 1) {
      if (!formData.ubicacion) erroresPaso.ubicacion = ["La ubicación es obligatoria."];
      if (!formData.descripcion) erroresPaso.descripcion = ["La descripción es obligatoria."];
    }

    if (pasoActual === 2) {
      if (formData.categorias.length === 0) erroresPaso.categorias = ["Selecciona al menos una categoría."];
    }

    setErrores(erroresPaso);
    return Object.keys(erroresPaso).length === 0;
  };

  const siguientePaso = () => {
    if (pasoActual === pasos.length - 1) return;
    if (validarPaso()) {
      setPasoActual((p) => Math.min(p + 1, pasos.length - 1));
      setPasosFallidos((prev) => {
        const nuevo = new Set(prev);
        nuevo.delete(pasoActual);
        return nuevo;
      });
    } else {
      setPasosFallidos((prev) => new Set(prev).add(pasoActual));
    }
  };

  const pasoAnterior = () => setPasoActual(p => Math.max(p - 1, 0));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarPaso()) {
      setPasosFallidos(prev => new Set(prev).add(pasoActual));
      return;
    }
    setErrores({});
    const data = new FormData();
    data.append("nombre", formData.nombre);
    data.append("descripcion", formData.descripcion);
    data.append("fecha", formData.fecha);
    if (mostrarFechaFin && formData.fechaFin) data.append("fechaFin", formData.fechaFin);
    data.append("hora", formData.hora);
    data.append("precio", formData.precio);
    data.append("ubicacion", formData.ubicacion);
    data.append("enlace", formData.enlaceWeb);
    if (formData.imagen) data.append("imagen", formData.imagen);
    formData.categorias.forEach((cat) => data.append("categorias[]", cat));

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
        setPasosFallidos(new Set([0, 1, 2]));
      } else {
        console.error("Error en el formulario:", error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container mx-auto p-6 bg-white rounded-lg shadow-lg space-y-6">
      <Stepper activeStep={pasoActual} alternativeLabel>
        {pasos.map((label, index) => {
          const fallo = pasosFallidos.has(index);
          return (
            <Step key={label}>
              <StepLabel
                error={fallo}
                optional={fallo ? <Typography variant="caption" color="error">Revisa este paso</Typography> : null}
              >
                {label}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>

      {/* Paso 0: Información general */}
      {pasoActual === 0 && (
        <>
          <div>
            <label className="block font-bold mb-2">Título del Evento</label>
            <input type="text" name="nombre" value={formData.nombre} className="w-full border rounded px-4 py-2" onChange={handleChange} disabled={eventoCreado} />
            {errores.nombre && <p className="text-red-600 text-sm">{errores.nombre[0]}</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-bold mb-2">Fecha</label>
              <input type="date" name="fecha" value={formData.fecha} className="w-full border rounded px-4 py-2" onChange={handleChange} disabled={eventoCreado} />
              {errores.fecha && <p className="text-red-600 text-sm">{errores.fecha[0]}</p>}
            </div>
            <div>
              <label className="block font-bold mb-2">Fecha Fin (opcional)</label>
              <input type="date" name="fechaFin" value={formData.fechaFin} min={formData.fecha} className="w-full border rounded px-4 py-2" onChange={handleChange} disabled={eventoCreado} />
              {errores.fechaFin && <p className="text-red-600 text-sm">{errores.fechaFin[0]}</p>}
            </div>
          </div>
          <div>
            <label className="block font-bold mb-2">Hora</label>
            <input type="time" name="hora" value={formData.hora} className="w-full border rounded px-4 py-2" onChange={handleChange} disabled={eventoCreado} />
            {errores.hora && <p className="text-red-600 text-sm">{errores.hora[0]}</p>}
          </div>
          <div>
            <label className="block font-bold mb-2">Precio</label>
            <input type="number" name="precio" value={formData.precio} min="0" step="0.01" className="w-full border rounded px-4 py-2" onChange={handleChange} disabled={eventoCreado} />
            {errores.precio && <p className="text-red-600 text-sm">{errores.precio[0]}</p>}
          </div>
        </>
      )}

      {/* Paso 1: Detalles del evento */}
      {pasoActual === 1 && (
        <>
          <div>
            <label className="block font-bold mb-2">Ubicación</label>
            <input ref={inputRef} type="text" name="ubicacion" value={formData.ubicacion} className="w-full border rounded px-4 py-2" onChange={handleChange} disabled={eventoCreado} />
            {errores.ubicacion && <p className="text-red-600 text-sm">{errores.ubicacion[0]}</p>}
          </div>
          <div>
            <label className="block font-bold mb-2">Enlace Web</label>
            <input type="url" name="enlaceWeb" value={formData.enlaceWeb} className="w-full border rounded px-4 py-2" onChange={handleChange} placeholder="https://" disabled={eventoCreado} />
            {errores.enlace && <p className="text-red-600 text-sm">{errores.enlace[0]}</p>}
          </div>
          <div>
            <label className="block font-bold mb-2">Descripción</label>
            <textarea name="descripcion" rows={4} className="w-full border rounded px-4 py-2" value={formData.descripcion} onChange={handleChange} disabled={eventoCreado}></textarea>
            {errores.descripcion && <p className="text-red-600 text-sm">{errores.descripcion[0]}</p>}
          </div>
        </>
      )}

      {/* Paso 2: Extras */}
      {pasoActual === 2 && (
        <>
          <div>
            <label className="block font-bold mb-2">Categorías</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {Object.entries(categoriasDisponibles).map(([key, cat]) => (
                <label key={key} className="flex items-center space-x-2">
                  <input type="checkbox" value={cat.sigla} checked={formData.categorias.includes(cat.sigla)} onChange={handleCategoriaChange} disabled={eventoCreado} />
                  <span>{cat.display}</span>
                </label>
              ))}
            </div>
            {errores.categorias && <p className="text-red-600 text-sm">{errores.categorias[0]}</p>}
          </div>

          <div>
            <label className="block font-bold mb-2">Imagen del Evento</label>
            <input type="file" name="imagen" onChange={handleImageChange} disabled={eventoCreado} />
            {errores.imagen && <p className="text-red-600 text-sm">{errores.imagen[0]}</p>}
          </div>
        </>
      )}

      {eventoCreado && (
        <div className="flex items-center justify-between p-4 mb-4 bg-green-100 border border-green-400 text-green-800 rounded">
          <CheckCircle className="mr-2" />
          {eventoEditar ? "Evento actualizado correctamente." : "Evento creado correctamente."}
        </div>
      )}

      <div className="flex justify-between mt-6">
        {pasoActual > 0 && (
          <button type="button" onClick={pasoAnterior} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
            Anterior
          </button>
        )}
        {pasoActual < pasos.length - 1 ? (
          <button type="button" onClick={siguientePaso} className="ml-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Siguiente
          </button>
        ) : (
          !eventoCreado && (
            <button
              type="button"
              onClick={handleSubmit}
              className="ml-auto px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              {eventoEditar ? 'Actualizar Evento' : 'Crear Evento'}
            </button>
          )
        )}
      </div>
    </form>
  );
}
