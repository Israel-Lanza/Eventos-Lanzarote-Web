import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getEventosCategory } from "../services/eventos";
import TarjetaEvento from "../components/TarjetaEvento";
import categorias from "../constantes/categorias";
import { Skeleton, Button } from "@mui/material";
import NavCategoria from "../components/NavCategoria";
import Breadcrumbs from "../components/Breadcrumbs";
import { Link } from "react-router-dom";//Volver atras
import { useTranslation } from 'react-i18next';
import { ArrowBack } from "@mui/icons-material";

const Categoria = () => {
  const { nombreCategoria } = useParams();
  const categoriaObj = categorias[nombreCategoria];
  const displayName = categoriaObj ? categoriaObj.display : nombreCategoria;
  const sigla = categoriaObj ? categoriaObj.sigla : null;
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const eventosPorPagina = 6;
  const { t } = useTranslation();
  

  useEffect(() => {
    if (sigla) {
      setLoading(true);
      getEventosCategory(sigla).then(data => {
        setEventos(data);
        setLoading(false);
      });
    }
  }, [sigla]);

  // Calcular eventos a mostrar en la página actual
  const indexOfLastEvento = currentPage * eventosPorPagina;
  const indexOfFirstEvento = indexOfLastEvento - eventosPorPagina;
  const eventosActuales = eventos.slice(indexOfFirstEvento, indexOfLastEvento);
  const totalPages = Math.ceil(eventos.length / eventosPorPagina);

  // Funciones de paginación
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    

    <div className="container mx-auto px-4 py-6">
      <Link to="/" className="mb-4 flex items-center text-sm text-gray-600 hover:text-black">
          <ArrowBack className="mr-1" />
          {t("go_back")}
      </Link>
      <Breadcrumbs
        rutas={[
          { to: "/", label: "Inicio" },
          { label: displayName }
        ]}
      />
      <NavCategoria/>
      {/* Título de la Categoría */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{displayName}</h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {Array.from(new Array(6)).map((_, index) => (
            <div key={index} className="p-4 bg-white shadow-md rounded-lg h-full">
              <Skeleton variant="rectangular" height={150} />
              <Skeleton variant="text" className="my-2" />
              <Skeleton variant="text" />
            </div>
          ))}
        </div>
      ) : eventosActuales.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-6">
            {eventosActuales.map(evento => (
              <TarjetaEvento key={evento.id} evento={evento} />
            ))}
          </div>
          {/* Paginación */}
          <div className="flex justify-between items-center mt-4">
            <Button 
              variant="outlined" 
              onClick={handlePreviousPage} 
              disabled={currentPage === 1}
            >
              Anterior
            </Button>

            <span>Página {currentPage} de {totalPages}</span>

            <Button 
              variant="outlined" 
              onClick={handleNextPage} 
              disabled={currentPage === totalPages}
            >
              Siguiente
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No hay eventos disponibles.</p>
      )}
    </div>
  );
};

export default Categoria;