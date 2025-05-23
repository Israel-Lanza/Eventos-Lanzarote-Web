import { getDisplay } from "../constantes/categorias";
import { Link } from "react-router-dom";
import PlaceIcon from '@mui/icons-material/Place';
import { formatearFecha } from "../utils/formatearFecha";
import { useLocation } from "react-router-dom";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useTranslation } from 'react-i18next';

const TarjetaEvento = ({ evento }) => {
    const location = useLocation();
    let categoriasDisplay = "Sin categoría";
    const { t } = useTranslation();

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
            return t('free');
        }
        return `${precio} €`;
    };

    return (
        <div className="p-4">
            <div className="bg-white shadow-lg rounded-2xl overflow-hidden transition-transform transform hover:scale-105 border border-gray-200 h-full flex flex-col">

                {/* Imagen del evento */}
                <div className="h-48 w-full overflow-hidden">
                    <Link
                        to={`/eventos/${evento.nombre.replace(/\s+/g, '-')}`}
                        state={{
                            from: location.pathname,
                            query: new URLSearchParams(location.search).get("query") || null,
                            categoria: location.pathname.includes("/categoria/")
                                ? location.pathname.split("/").pop()
                                : null
                        }}
                    >
                        <img
                            src={`http://localhost:8000${evento.imagen}`}
                            alt={evento.nombre}
                            className="w-full h-full object-cover"
                        />
                    </Link>
                </div>

                {/* Contenido del evento */}
                <div className="p-4 flex flex-col justify-between flex-grow">

                    {/* Parte de arriba: título, fecha, ubicación, descripción */}
                    <div className="flex-grow">
                        <div className="text-sm text-blue-600 font-semibold mb-2 whitespace-normal break-words">
                            {categoriasDisplay}
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-1">
                            {evento.nombre || "Nombre no disponible"}
                        </h3>
                        <p className="text-sm text-gray-600">
                            <CalendarTodayIcon className="mr-1" /> {formatearFecha(evento.fecha) || "Fecha no disponible"}
                            {evento.fechaFin && ` - ${formatearFecha(evento.fechaFin)}`}
                        </p>
                        <p className="text-sm text-gray-600">
                            <AccessTimeIcon className="mr-2" />{evento.hora ? evento.hora + " horas" : "Hora no especificada"}
                        </p>
                        <div className="text-sm text-gray-600 flex items-center mt-1">
                            <PlaceIcon className="w-4 h-4 mr-1" />
                            {evento.ubicacion || "Ubicación no disponible"}
                        </div>
                        <div
                            className="text-sm text-gray-700 mt-2 line-clamp-2"
                            dangerouslySetInnerHTML={{ __html: evento.descripcion || "Sin descripción" }}
                        />
                    </div>

                    {/* Parte de abajo: precio + botón */}
                    <div className="mt-4">
                        <div className="flex justify-end mb-3">
                            <span className="text-base font-semibold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-md">
                                {mostrarPrecio(evento.precio)}
                            </span>
                        </div>

                        <Link
                            className="py-2 px-4 bg-blue-500 text-white text-center rounded-xl hover:bg-blue-600 transition inline-block w-full"
                            to={`/eventos/${evento.nombre.replace(/\s+/g, '-')}`}
                            state={{
                                from: location.pathname,
                                query: new URLSearchParams(location.search).get("query") || null,
                                categoria: location.pathname.includes("/categoria/")
                                    ? location.pathname.split("/").pop()
                                    : null
                            }}
                        >
                            {t("more")}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TarjetaEvento;
