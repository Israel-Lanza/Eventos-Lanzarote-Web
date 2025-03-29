import { useEffect, useState } from "react";
import { getEventos } from "../services/eventos";
import TarjetaEvento from "../components/TarjetaEvento";

const HomePage = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEventos().then(data => {
      setEventos(data);
      setLoading(false);
    });
  }, []);

  return (
    <>
      {/* Cabecera */}
      <div className="bg-blue-500 text-white p-6 mb-6 rounded shadow">
        <h3 className="text-xl font-bold">Tu guía de ocio en la isla de Lanzarote</h3>
      </div>

      {/* Eventos de esta semana */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-4">Eventos de esta semana</h3>
        
        {loading ? (
          <p className="text-gray-500">Cargando eventos...</p>
        ) : eventos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventos.map(evento => (
              <TarjetaEvento key={evento.id} evento={evento} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No hay eventos disponibles.</p>
        )}
      </div>
    </>
  );
};

export default HomePage;