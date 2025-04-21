import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { buscarEventosPorNombre } from "../services/eventos";
import TarjetaEvento from "../components/TarjetaEvento";
import Breadcrumbs from "../components/Breadcrumbs";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";

const Buscador = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    buscarEventosPorNombre(query).then(data => {
      setResultados(data);
      setLoading(false);
    });
  }, [query]);

  return (
    <div className="py-6">
       <button onClick={() => navigate(-1)} className="mb-4 flex items-center text-sm text-gray-600 hover:text-black">
          <ArrowBack className="mr-1" />
          {t("go_back")}
        </button>
      <Breadcrumbs
        rutas={[
          { to: "/", label: "Inicio" },
          { label: `Resultados de "${query}"` }
        ]}
      />
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
