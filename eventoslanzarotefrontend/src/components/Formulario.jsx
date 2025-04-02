import { useState } from "react";
import { createEvento } from "../services/eventos";

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
    formData.categorias.forEach((categoria) =>
      data.append("categorias[]", categoria)
    );

    const resultado = await createEvento(data);
    if (resultado) {
      alert("Evento creado con éxito");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-4">
      {/* Nombre */}
      <div className="mb-3">
        <label htmlFor="nombre" className="form-label">
          Nombre
        </label>
        <input
          type="text"
          name="nombre"
          id="nombre"
          placeholder="Nombre"
          onChange={handleChange}
          className="form-control"
        />
      </div>
      {/* Fecha */}
      <div className="mb-3">
        <label htmlFor="fecha" className="form-label">
          Fecha
        </label>
        <input
          type="date"
          name="fecha"
          id="fecha"
          onChange={handleChange}
          className="form-control"
        />
      </div>
      {/* Checkbox para mostrar fecha fin */}
      <div className="mb-3 form-check">
        <input
          type="checkbox"
          id="mostrarFechaFin"
          className="form-check-input"
          onChange={handleFechaFinCheckbox}
        />
        <label htmlFor="mostrarFechaFin" className="form-check-label">
          Agregar fecha fin
        </label>
      </div>
      {/* Fecha Fin (condicional) */}
      {mostrarFechaFin && (
        <div className="mb-3">
          <label htmlFor="fechaFin" className="form-label">
            Fecha Fin
          </label>
          <input
            type="date"
            name="fechaFin"
            id="fechaFin"
            onChange={handleChange}
            className="form-control"
          />
        </div>
      )}
      {/* Hora */}
      <div className="mb-3">
        <label htmlFor="hora" className="form-label">
          Hora
        </label>
        <input
          type="time"
          name="hora"
          id="hora"
          onChange={handleChange}
          className="form-control"
        />
      </div>
      {/* Ubicación */}
      <div className="mb-3">
        <label htmlFor="ubicacion" className="form-label">
          Ubicación
        </label>
        <input
          type="text"
          name="ubicacion"
          id="ubicacion"
          placeholder="Ubicación"
          onChange={handleChange}
          className="form-control"
        />
      </div>
      {/* Categorías */}
      <div className="mb-3">
        <label className="form-label">Categorías</label>
        <div className="form-check">
          <input
            type="checkbox"
            name="categorias"
            value="musica"
            id="categoriaMusica"
            className="form-check-input"
            onChange={handleCategoriaChange}
          />
          <label htmlFor="categoriaMusica" className="form-check-label">
            Música
          </label>
        </div>
        <div className="form-check">
          <input
            type="checkbox"
            name="categorias"
            value="deportes"
            id="categoriaDeportes"
            className="form-check-input"
            onChange={handleCategoriaChange}
          />
          <label htmlFor="categoriaDeportes" className="form-check-label">
            Deportes
          </label>
        </div>
        <div className="form-check">
          <input
            type="checkbox"
            name="categorias"
            value="arte"
            id="categoriaArte"
            className="form-check-input"
            onChange={handleCategoriaChange}
          />
          <label htmlFor="categoriaArte" className="form-check-label">
            Arte
          </label>
        </div>
        {/* Agrega más categorías según tus necesidades */}
      </div>
      {/* Precio */}
      <div className="mb-3">
        <label htmlFor="precio" className="form-label">
          Precio
        </label>
        <input
          type="number"
          name="precio"
          id="precio"
          min="0"
          placeholder="Precio"
          onChange={handleChange}
          className="form-control"
        />
      </div>
      {/* Enlace Web */}
      <div className="mb-3">
        <label htmlFor="enlaceWeb" className="form-label">
          Enlace Web
        </label>
        <input
          type="url"
          name="enlaceWeb"
          id="enlaceWeb"
          placeholder="https://"
          onChange={handleChange}
          className="form-control"
        />
      </div>
      {/* Imagen */}
      <div className="mb-3">
        <label htmlFor="imagen" className="form-label">
          Imagen
        </label>
        <input
          type="file"
          name="imagen"
          id="imagen"
          onChange={handleImageChange}
          className="form-control"
        />
      </div>
      {/* Descripción */}
      <div className="mb-3">
        <label htmlFor="descripcion" className="form-label">
          Descripción
        </label>
        <textarea
          name="descripcion"
          id="descripcion"
          placeholder="Descripción"
          onChange={handleChange}
          className="form-control"
        ></textarea>
      </div>
      <button type="submit" className="btn btn-primary">
        Crear Evento
      </button>
    </form>
  );
}

export default Formulario;