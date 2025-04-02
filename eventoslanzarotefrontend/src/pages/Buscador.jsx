import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getEventos } from "../services/eventos";
import TarjetaEvento from "../components/TarjetaEvento";

const Buscador = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEventos().then(eventos => {
      const filtrados = eventos.filter(evento =>
        evento.nombre.toLowerCase().includes(query.toLowerCase())
      );
      setResultados(filtrados);
      setLoading(false);
    });
  }, [query]);

  return (
    <div className="py-6">
      <h2 className="text-2xl font-bold mb-4">Resultados para: "{query}"</h2>
      {loading ? (
        <p>Cargando...</p>
      ) : resultados.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {resultados.map(evento => (
            <TarjetaEvento key={evento.id} evento={evento} />
          ))}
        </div>
      ) : (
        <p>No se encontraron eventos con ese nombre.</p>
      )}
    </div>
  );
};

export default Buscador;
