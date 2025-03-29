import { getDisplay } from "../constantes/categorias";
import { MapPin } from 'lucide-react';
import { Link } from "react-router-dom";

const TarjetaEvento = ({ evento }) => {
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

    return (
        <div className="p-4">
            <div className="bg-white shadow-lg rounded-2xl overflow-hidden transition-transform transform hover:scale-105 border border-gray-200 h-full flex flex-col">

                {/* Imagen del evento */}
                <div className="h-48 w-full overflow-hidden">
                    {/* <img
                        src={evento.imagen ? `http://api-eventoslanzarote.api/${evento.imagen}` : "https://via.placeholder.com/300x200"}
                        alt={evento.nombre}
                        className="w-full h-full object-cover"
                    /> */}
                    <img
                        src="https://inkscape.app/wp-content/uploads/imagen-vectorial.webp"
                        alt="lanzarote"
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
                        <p className="text-sm text-gray-600">{evento.fecha || "Fecha no disponible"}</p>
                        <p className="text-sm text-gray-600">{evento.precio ? `${evento.precio} €` : "Gratis"}</p>
                        <p className="text-sm text-gray-600">{evento.hora || "Hora no especificada"}</p>
                        <div className="text-sm text-gray-600 flex items-center mt-1">
                            <MapPin className="w-4 h-4 mr-1" />
                            {evento.ubicacion || "Ubicación no disponible"}
                        </div>
                        <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                            {evento.descripcion || "Sin descripción"}
                        </p>
                    </div>

                    <Link
                        to={`/eventos/${evento.nombre.replace(/\s+/g, '-').toLowerCase()}`}
                        className="mt-3 py-2 px-4 bg-blue-500 text-white text-center rounded-xl hover:bg-blue-600 transition inline-block"
                    >
                        Más información
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TarjetaEvento;
