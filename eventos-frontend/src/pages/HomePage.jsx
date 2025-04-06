import { useEffect, useState } from "react";
import { getEventos } from "../services/eventos";
import TarjetaEvento from "../components/TarjetaEvento";
import { Skeleton } from "@mui/material";
import NavCategoria from "../components/NavCategoria";
import { useTranslation } from 'react-i18next';


const HomePage = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

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
        <h3 className="text-xl font-bold">{t("welcome")}</h3>
      </div>

      <NavCategoria/>

      {/* Eventos de esta semana */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-4">{t("next_events")}</h3>

        {loading ? (
          // Mostrar Skeletons mientras se cargan los eventos
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {Array.from(new Array(6)).map((_, index) => (
              <div key={index} className="p-4 bg-white shadow-md rounded-lg h-full">
                <Skeleton variant="rectangular" height={150} />
                <Skeleton variant="text" className="my-2" />
                <Skeleton variant="text" />
              </div>
            ))}
          </div>
        ) : eventos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {eventos.map(evento => (
              <TarjetaEvento key={evento.id} evento={evento} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">{t("no_available")}</p>
        )}
      </div>
    </>
  );
};

export default HomePage;
