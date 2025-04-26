import { getDisplay } from "../constantes/categorias";
import { Link } from "react-router-dom";
import PlaceIcon from '@mui/icons-material/Place';
import { formatearFecha } from "../utils/formatearFecha";
import { useLocation } from "react-router-dom";

const TarjetaEvento = ({ evento }) => {
    const location = useLocation();
    let categoriasDisplay = "Sin categoría";

    if (evento.categorias) {
        const categoriasArray = Array.isArray(evento.categorias)
            ? evento.categorias
            : Object.values(evento.categorias);

        categoriasDisplay = categoriasArray
            .map(categ =>
                typeof categ === "object" && categ.sigla ? getDisplay(categ.sigla) : getDisplay(categ)
            )
            .join(", ");
    }

    const mostrarPrecio = (precio) => {
        if (
          precio === 0 ||
          precio === "0.00" ||
          precio?.toString().toLowerCase() === "gratis" ||
          precio === null ||
          precio === ""
        ) {
          return "Evento gratuito";
        }
        return `${precio} €`;
    };

    return (
        <div className="p-4">
            <div className="bg-white shadow-lg rounded-2xl overflow-hidden transition-transform transform hover:scale-105 border border-gray-200 h-full flex flex-col">

                {/* Imagen del evento */}
                <div className="h-48 w-full overflow-hidden">
                    <img
                        src={`http://localhost:8000${evento.imagen}`}
                        alt={evento.nombre}
                        className="w-full h-full object-cover"
                    /> 
                </div>

                {/* Contenido del evento */}
                <div className="p-4 flex flex-col justify-between flex-grow">
                    <div>
                        <div className="text-sm text-blue-600 font-semibold mb-2 whitespace-normal break-words">
                            {categoriasDisplay}
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-1">{evento.nombre || "Nombre no disponible"}</h3>
                        <p className="text-sm text-gray-600">{formatearFecha(evento.fecha) || "Fecha no disponible"}</p>
                        <p className="text-sm text-gray-600">{evento.hora + " horas" || "Hora no especificada"}</p>
                        <div className="text-sm text-gray-600 flex items-center mt-1">
                            <PlaceIcon className="w-4 h-4 mr-1" />
                            {evento.ubicacion || "Ubicación no disponible"}
                        </div>
                        <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                            {evento.descripcion || "Sin descripción"}
                        </p>
                        <br></br>
                        <div className="flex justify-end mt-2">
                            <span className="text-base font-semibold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-md">
                                {mostrarPrecio(evento.precio)}
                            </span>
                        </div>
                    </div>

                    <Link
                        className="mt-3 py-2 px-4 bg-blue-500 text-white text-center rounded-xl hover:bg-blue-600 transition inline-block"
                        to={`/eventos/${evento.nombre.replace(/\s+/g, '-')}`}
                        state={{
                            from: location.pathname,
                            query: new URLSearchParams(location.search).get("query") || null,
                            categoria: location.pathname.includes("/categoria/")
                            ? location.pathname.split("/").pop()
                            : null
                        }}
                    >
                        Más información
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TarjetaEvento;
