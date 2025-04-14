import { useEffect, useState } from "react";
import { getEventos } from "../services/eventos";
import TarjetaEvento from "../components/TarjetaEvento";
import { Skeleton } from "@mui/material";
import NavCategoria from "../components/NavCategoria";
import { useTranslation } from 'react-i18next';


const HomePage = () => {
  const [eventos, setEventos] = useState([]);
 /*  const [loading, setLoading] = useState(true); */
  const [isInitialLoading, setIsInitialLoading] = useState(true); // solo cuando arranca la página
  const [isPageLoading, setIsPageLoading] = useState(false);  
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchEventos = async () => {
      if (eventos.length === 0) {
        setIsInitialLoading(true); // primera vez
      } else {
        setIsPageLoading(true); // cuando cambias de página
      }
  
      try {
        const data = await getEventos(currentPage);
        setEventos(data.data);
        setLastPage(data.last_page);
      } catch (error) {
        console.error("Error cargando eventos:", error);
      } finally {
        setIsInitialLoading(false);
        setIsPageLoading(false);
      }
    };
  
    fetchEventos();
  }, [currentPage]);

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

        {isInitialLoading ? (
          // Skeletons al cargar por primera vez
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="p-4 bg-white shadow-md rounded-lg h-full">
                <Skeleton variant="rectangular" height={150} />
                <Skeleton variant="text" className="my-2" />
                <Skeleton variant="text" />
              </div>
            ))}
          </div>
        ) : eventos.length > 0 ? (
          <div className="relative">
            {isPageLoading && (
              <div className="absolute inset-0 z-10 bg-white bg-opacity-70 flex items-center justify-center rounded">
                <div className="text-blue-600 font-semibold animate-pulse">Cargando...</div>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {eventos.map((evento) => (
                <TarjetaEvento key={evento.id} evento={evento} />
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500">{t("no_available")}</p>
        )}
      </div>
      <div className="flex justify-center mt-6 space-x-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="text-gray-700 pt-2">Página {currentPage} de {lastPage}</span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, lastPage))}
          disabled={currentPage === lastPage}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </>
  );
};

export default HomePage;
