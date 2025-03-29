import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getEventosCategory } from "../services/eventos";
import TarjetaEvento from "../components/TarjetaEvento";
import categorias from "../constantes/categorias";

const Categoria = () => {
  const { nombreCategoria } = useParams();
  const categoriaObj = categorias[nombreCategoria];
  const displayName = categoriaObj ? categoriaObj.display : nombreCategoria;
  const sigla = categoriaObj ? categoriaObj.sigla : null;

  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sigla) {
      setLoading(true);
      getEventosCategory(sigla).then(data => {
        setEventos(data);
        setLoading(false);
      });
    }
  }, [sigla]);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Título de la Categoría */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{displayName}</h1>
      
      {loading ? (
        <p className="text-gray-600 text-center">Cargando eventos...</p>
      ) : eventos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {eventos.map(evento => (
            <TarjetaEvento key={evento.id} evento={evento} />
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center">No hay eventos disponibles en esta categoría.</p>
      )}
    </div>
  );
};

export default Categoria;
