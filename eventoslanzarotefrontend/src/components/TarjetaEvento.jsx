import { getDisplay } from "../constantes/categorias";

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
        <div className="w-full md:w-1/2 p-4">
            <div className="flex flex-col md:flex-row bg-white shadow-md rounded-lg overflow-hidden">
                
                {/* Imagen del evento */}
                <div className="md:w-1/3 w-full">
                    <img
                        src={evento.imagen ? `http://api-eventoslanzarote.api/${evento.imagen}` : "https://via.placeholder.com/150"}
                        alt={evento.nombre}
                        className="object-cover w-full h-full"
                    />
                </div>
                
                {/* Contenido del evento */}
                <div className="p-4 flex flex-col justify-between w-full">
                    <div>
                        <strong className="text-blue-600 text-sm block mb-1">
                            {categoriasDisplay}
                        </strong>
                        <h3 className="text-lg font-bold mb-2">{evento.nombre || "Nombre no disponible"}</h3>
                        <p className="text-sm text-gray-500 mb-2">{evento.fecha || "Fecha no disponible"}</p>
                        <p className="text-sm text-gray-500 mb-2">{evento.precio ? `${evento.precio} €` : "Gratis"}</p>
                        <div className="text-sm text-gray-500 mb-2">{evento.hora || "Hora no especificada"}</div>
                        <p className="text-sm text-gray-500 mb-2">
                            📍 {evento.ubicacion || "Ubicación no disponible"}
                        </p>
                        <p className="text-sm text-gray-700 mb-2">
                            {evento.descripcion || "Sin descripción"}
                        </p>
                    </div>
                    
                    <a href={evento.link || "#"} className="mt-2 py-2 px-4 bg-blue-500 text-white text-center rounded hover:bg-blue-600 transition">
                        Más información
                    </a>
                </div>
            </div>
        </div>
    );
};

export default TarjetaEvento;
