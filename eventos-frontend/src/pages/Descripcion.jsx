import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { getEventoById } from "../services/eventos";  // Asegúrate que esta función reciba un nombre o slug
import { Card, CardContent, CardHeader, Divider, Button, Tabs, Tab } from "@mui/material";
import { ArrowBack, Share, CalendarToday, AccessTime, LocationOn, Business, Map } from "@mui/icons-material";
import { Link } from "react-router-dom";


const Descripcion = () => {
    const { nombreEvento } = useParams();
    const [evento, setEvento] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        setLoading(true);

        getEventoById(nombreEvento).then(data => {  // Ahora recibe el nombre del evento
            setEvento(data);
            setLoading(false);
        });
    }, [nombreEvento]);

    if (loading) return <div>Cargando...</div>;

    if (!evento) return <div>Evento no encontrado</div>;

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Link to="/" className="mb-4 flex items-center text-sm text-gray-600 hover:text-black">
                    <ArrowBack className="mr-1" />
                    Volver a eventos
                </Link>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h1 className="text-3xl font-bold">{evento.nombre}</h1>
                    <Button variant="outlined" startIcon={<Share />}>Compartir</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="mb-8">
                        {/* <img
                            src={evento.imagen || "/placeholder.svg"}
                            alt={evento.nombre}
                            className="w-full h-96 object-cover rounded-lg"
                        /> */}
                        <img
                            src="https://inkscape.app/wp-content/uploads/imagen-vectorial.webp"
                            alt="lanzarote"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="Detalles del evento">
                        <Tab label="Detalles" />
                        <Tab label="Ubicación" />
                    </Tabs>

                    {tabValue === 0 && (
                        <Card className="mt-4">
                            <CardContent>
                                <h3 className="text-xl font-bold mb-4">Sobre este evento</h3>
                                <p>{evento.descripcion} </p>

                                <h3 className="text-xl font-bold mt-6 mb-4">Categorías</h3>
                                {/* {evento.categorias.map((categoria, index) => (
                                    <div key={index}>
                                        <Link to={`/categoria/${categoria.nombre}`} className="text-blue-600 hover:underline">
                                            {categoria.nombre}
                                        </Link>
                                    </div>
                                ))} */}
                            </CardContent>
                        </Card>
                    )}

                    {tabValue === 1 && (
                        <Card className="mt-4">
                            <CardContent>
                                <h3 className="text-xl font-bold mb-4">Ubicación del evento</h3>
                                {evento.ubicacion ? (
                                    <div className="w-full h-72 rounded overflow-hidden">
                                        <div
                                            id="map"
                                            ref={(ref) => {
                                                if (ref && window.google && evento.ubicacion) {
                                                    const map = new window.google.maps.Map(ref, {
                                                        zoom: 15,
                                                        center: { lat: 28.1235, lng: -15.4363 }, // coordenadas por defecto
                                                    });

                                                    const geocoder = new window.google.maps.Geocoder();
                                                    geocoder.geocode({ address: evento.ubicacion }, (results, status) => {
                                                        if (status === "OK") {
                                                            const location = results[0].geometry.location;
                                                            map.setCenter(location);
                                                            new window.google.maps.Marker({
                                                                map,
                                                                position: location,
                                                            });
                                                        } else {
                                                            console.error("Geocode failed:", status);
                                                        }
                                                    });
                                                }
                                            }}
                                            style={{ width: "100%", height: "100%" }}
                                        ></div>
                                    </div>
                                ) : (
                                    <p>Ubicación no disponible</p>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div>
                    <Card className="sticky top-4">
                        <CardHeader title="Información del evento" />
                        <CardContent>
                            <div className="flex items-center gap-3 mb-4">
                                <CalendarToday />
                                <div>
                                    <p>Fecha: {evento.fecha}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 mb-4">
                                <AccessTime />
                                <div>
                                    <p>Hora: {evento.hora}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 mb-4">
                                <LocationOn />
                                <div>
                                    <p>Ubicación: {evento.ubicacion}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 mb-4">
                                <Business />
                                <div>
                                    <p>Organizador: {evento.autor}</p>
                                </div>
                            </div>

                            <Divider className="my-4" />

                            <div className="flex justify-between items-center">
                                <p>Precio:</p>
                                <p className="font-bold">{evento.precio}</p>
                            </div>
                            <br />

                            <Button variant="contained" color="primary" className="w-full mt-4">Comprar entradas</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Descripcion;
