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
  HelpCircle,
} from "lucide-react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

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
    horaFin: "",
    precio: "",
    ubicacion: "",
    enlaceWeb: "",
    imagen: null,
    categorias: [],
    organizador: ""
  });

  const [errores, setErrores] = useState({});
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
        horaFin: eventoEditar.horaFin || "",
        precio: eventoEditar.precio || "",
        ubicacion: eventoEditar.ubicacion || "",
        enlaceWeb: eventoEditar.enlace || "",
        imagen: null,
        categorias: eventoEditar.categorias?.map(c => c.sigla) || [],
        organizador: eventoEditar.organizador || "",
      });
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
      if (formData.horaFin && !formData.hora) {
        erroresPaso.hora = ["La hora de inicio es obligatoria si especificas una hora de fin."];
      }
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
    data.append("fechaFin", formData.fechaFin);
    data.append("hora", formData.hora);
    data.append("horaFin", formData.horaFin);
    data.append("precio", formData.precio);
    data.append("ubicacion", formData.ubicacion);
    data.append("enlace", formData.enlaceWeb);
    data.append("organizador", formData.organizador);
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
        closeModal();
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
    <div className="w-full px-2 sm:px-4 md:px-8">
      <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-lg space-y-6 overflow-hidden break-words">
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
              <label className="block font-bold mb-2">Título del Evento *</label>
              <input type="text" name="nombre" value={formData.nombre} className="w-full border rounded px-4 py-2" onChange={handleChange} disabled={eventoCreado} />
              {errores.nombre && <p className="text-red-600 text-sm">{errores.nombre[0]}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-bold mb-2">Fecha *</label>
                <input type="date" name="fecha" value={formData.fecha} className="w-full border rounded px-4 py-2" onChange={handleChange} disabled={eventoCreado} />
                {errores.fecha && <p className="text-red-600 text-sm">{errores.fecha[0]}</p>}
              </div>
              <div>
                <label className="block font-bold mb-2">Fecha fin</label>
                <input type="date" name="fechaFin" value={formData.fechaFin} min={formData.fecha} className="w-full border rounded px-4 py-2" onChange={handleChange} disabled={eventoCreado} />
                {errores.fechaFin && <p className="text-red-600 text-sm">{errores.fechaFin[0]}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-bold mb-2">Hora</label>
                <input type="time" name="hora" value={formData.hora} className="w-full border rounded px-4 py-2" onChange={handleChange} disabled={eventoCreado} />
                {errores.hora && <p className="text-red-600 text-sm">{errores.hora[0]}</p>}
              </div>
              <div>
                <label className="block font-bold mb-2">Hora hasta</label>
                <input type="time" name="horaFin" value={formData.horaFin} className="w-full border rounded px-4 py-2" onChange={handleChange} disabled={eventoCreado} />
                {errores.horaFin && <p className="text-red-600 text-sm">{errores.horaFin[0]}</p>}
              </div>
            </div>
            <div>
              <label className="font-bold mb-2 flex items-center gap-2">
                Precio *
                <span title="Introduce el precio del evento. Usa 0 si es gratuito">
                  <HelpCircle size={18} className="text-gray-500 cursor-pointer" />
                </span>
              </label>
              <input type="number" name="precio" value={formData.precio} min="0" step="0.01" className="w-full border rounded px-4 py-2" onChange={handleChange} disabled={eventoCreado} />
              {errores.precio && <p className="text-red-600 text-sm">{errores.precio[0]}</p>}
            </div>
          </>
        )}

        {/* Paso 1: Detalles del evento */}
        {pasoActual === 1 && (
          <>
            <div>
              <label className="block font-bold mb-2">Ubicación *</label>
              <input ref={inputRef} type="text" name="ubicacion" value={formData.ubicacion} className="w-full border rounded px-4 py-2" onChange={handleChange} disabled={eventoCreado} />
              {errores.ubicacion && <p className="text-red-600 text-sm">{errores.ubicacion[0]}</p>}
            </div>
            <div>
              <label className="block font-bold mb-2">Enlace Web</label>
              <input type="url" name="enlaceWeb" value={formData.enlaceWeb ? formData.enlaceWeb : "https://"} className="w-full border rounded px-4 py-2" onChange={handleChange} disabled={eventoCreado} />
              {errores.enlace && <p className="text-red-600 text-sm">{errores.enlace[0]}</p>}
            </div>
            <div>
              <label className="block font-bold mb-2">Descripción *</label>
              <ReactQuill
                value={formData.descripcion}
                onChange={(value) => handleChange({ target: { name: 'descripcion', value } })}
                readOnly={eventoCreado}
                className="bg-white"
              />
              {errores.descripcion && <p className="text-red-600 text-sm">{errores.descripcion[0]}</p>}
            </div>

          </>
        )}

        {/* Paso 2: Extras */}
        {pasoActual === 2 && (
          <>
            <div>
              <label className="block font-bold mb-2">Categorías *</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
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
              <label className="block font-bold mb-2">Organizador</label>
              <input type="text" name="organizador" value={formData.organizador} className="w-full border rounded px-4 py-2" onChange={handleChange} disabled={eventoCreado} />
              {errores.organizador && <p className="text-red-600 text-sm">{errores.organizador[0]}</p>}
            </div>
            <div>
              <label className="block font-bold mb-2">Imagen del Evento</label>
              <input type="file" name="imagen" onChange={handleImageChange} disabled={eventoCreado} />
              {errores.imagen && <p className="text-red-600 text-sm">{errores.imagen[0]}</p>}
            </div>
          </>
        )}

        {/* Mensaje de éxito */}
        {eventoCreado && (
          <div className="flex items-center justify-between p-4 mb-4 bg-green-100 border border-green-400 text-green-800 rounded">
            <CheckCircle className="mr-2" />
            {eventoEditar ? "Evento actualizado correctamente." : "Evento creado correctamente."}
          </div>
        )}

        {/* Botones de navegación */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
          {pasoActual > 0 && (
            <button type="button" onClick={pasoAnterior} className="w-full sm:w-auto px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
              Anterior
            </button>
          )}
          {pasoActual < pasos.length - 1 ? (
            <button type="button" onClick={siguientePaso} className="w-full sm:w-auto ml-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Siguiente
            </button>
          ) : (
            !eventoCreado && (
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full sm:w-auto ml-auto px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                {eventoEditar ? 'Actualizar Evento' : 'Crear Evento'}
              </button>
            )
          )}
        </div>
      </form>
    </div>

  );
}
