import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getEventoById } from "../services/eventos";
import { Card, CardContent, CardHeader, Divider, Button, Tabs, Tab } from "@mui/material";
import { ArrowBack, Share, CalendarToday, AccessTime, LocationOn, Business } from "@mui/icons-material";
import { getDisplay } from "../constantes/categorias";
import { formatearFecha } from "../utils/formatearFecha";
import Breadcrumbs from "../components/Breadcrumbs";
import { useTranslation } from 'react-i18next';
import categorias from "../constantes/categorias";
import { FaWhatsapp, FaFacebookF, FaXTwitter, FaArrowUp } from "react-icons/fa6";

const Descripcion = () => {
    const { nombreEvento } = useParams();
    const [evento, setEvento] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tabValue, setTabValue] = useState(0);
    const location = useLocation();
    const { query, categoria } = location.state || {};
    const { t } = useTranslation();
    const [openDialog, setOpenDialog] = useState(false);
    const [copied, setCopied] = useState(false);
    const navigate = useNavigate();
    const [mostrarBotonArriba, setMostrarBotonArriba] = useState(false);
    const [imagenAmpliada, setImagenAmpliada] = useState(false);

    const handleOpenDialog = () => setOpenDialog(true);
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCopied(false);
    };

    const currentUrl = window.location.href;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(currentUrl);
        setCopied(true);
    };

    const handleTabChange = (event, newValue) => setTabValue(newValue);

    useEffect(() => {
        setLoading(true);
        getEventoById(nombreEvento).then(data => {
            setEvento(data);
            setLoading(false);
        });
    }, [nombreEvento]);

    useEffect(() => {
        const handleScroll = () => {
            setMostrarBotonArriba(window.scrollY > 300);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (loading) return <div>{t("loading")}...</div>;
    if (!evento) return <div>{t("not_found")}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <button onClick={() => navigate(-1)} className="mb-4 flex items-center text-sm text-gray-600 hover:text-black">
                    <ArrowBack className="mr-1" />
                    {t("go_back")}
                </button>

                <Breadcrumbs
                    rutas={[
                        { to: "/", label: t('menu.home') },
                        ...(categoria ? [{ to: `/categoria/${categoria}`, label: categorias[categoria]?.display || categoria }] : []),
                        ...(query ? [{ to: `/buscar?query=${query}`, label: `Resultados de "${query}"` }] : []),
                        { label: evento.nombre }
                    ]}
                />

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h1 className="text-3xl font-bold">{evento.nombre}</h1>
                    <Button variant="outlined" startIcon={<Share />} onClick={handleOpenDialog}>
                        {t("share")}
                    </Button>
                </div>

                {openDialog && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md relative">
                            <h2 className="text-xl font-bold mb-4">Compartir evento</h2>

                            <div className="flex items-center mb-4">
                                <input type="text" readOnly value={currentUrl} className="flex-grow border rounded-l px-4 py-2" />
                                <button onClick={handleCopyLink} className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600">
                                    {copied ? "¡Copiado!" : "Copiar"}
                                </button>
                            </div>

                            <div className="flex justify-center space-x-4 mt-4">
                                <a href={`https://wa.me/?text=${encodeURIComponent(currentUrl)}`} target="_blank" rel="noopener noreferrer"
                                    className="text-green-500 hover:text-green-600 text-2xl" title="Compartir en WhatsApp">
                                    <FaWhatsapp />
                                </a>
                                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`} target="_blank"
                                    rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 text-2xl" title="Compartir en Facebook">
                                    <FaFacebookF />
                                </a>
                                <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}`} target="_blank"
                                    rel="noopener noreferrer" className="text-black hover:text-gray-800 text-2xl" title="Compartir en X">
                                    <FaXTwitter />
                                </a>
                            </div>

                            <button onClick={handleCloseDialog} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl" title="Cerrar">
                                ✖
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div
                        className="mb-8 h-40 sm:h-52 md:h-64 lg:h-72 xl:h-80 overflow-hidden rounded-md cursor-pointer"
                        onClick={() => setImagenAmpliada(true)}
                    >
                        <img src={`${evento.imagen}`} alt={evento.nombre} className="w-full h-full object-cover" />
                    </div>


                    <Tabs value={tabValue} onChange={handleTabChange} aria-label={t('event_details')}>
                        <Tab label={t("details")} />
                        <Tab label={t("location")} />
                    </Tabs>

                    {tabValue === 0 && (
                        <Card className="mt-4">
                            <CardContent>
                                <h3 className="text-xl font-bold mb-4">{t('about_event')}</h3>
                                <div dangerouslySetInnerHTML={{ __html: evento.descripcion }} />

                                <h3 className="text-xl font-bold mt-6 mb-4">{t('categories')}</h3>
                                <div className="flex gap-2 flex-wrap mb-2">
                                    {Array.isArray(evento.categorias) && evento.categorias.length > 0 ? (
                                        <div className="text-m text-blue-600 font-semibold mb-2 whitespace-normal break-words">
                                            {evento.categorias.map((categoria, index) => {
                                                const slug = Object.keys(categorias).find(
                                                    key => categorias[key].sigla === categoria.sigla
                                                );
                                                return (
                                                    <span key={index}>
                                                        <Link to={`/categoria/${slug}`} className="hover:underline text-blue-600">
                                                            {getDisplay(categoria.sigla)}
                                                        </Link>
                                                        {index < evento.categorias.length - 1 && ", "}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <span className="text-sm text-gray-500">{t('no_category')}</span>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {tabValue === 1 && (
                        <Card className="mt-4">
                            <CardContent>
                                <h3 className="text-xl font-bold mb-4">{t('location')}</h3>
                                {evento.ubicacion ? (
                                    <div className="w-full h-72 rounded overflow-hidden">
                                        <div
                                            id="map"
                                            ref={(ref) => {
                                                if (ref && window.google && evento.ubicacion) {
                                                    const map = new window.google.maps.Map(ref, {
                                                        zoom: 15,
                                                        center: { lat: 28.1235, lng: -15.4363 },
                                                        mapId: "15af9bcc470cf157",
                                                    });
                                                    const geocoder = new window.google.maps.Geocoder();
                                                    geocoder.geocode({ address: evento.ubicacion }, (results, status) => {
                                                        if (status === "OK") {
                                                            const location = results[0].geometry.location;
                                                            map.setCenter(location);
                                                            new window.google.maps.marker.AdvancedMarkerElement({
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
                        <CardHeader title={t("info")} />
                        <CardContent>
                            <div className="flex items-center gap-3 mb-4">
                                <CalendarToday />
                                <p>
                                    <b>{t('form.date')}:</b>{" "}
                                    {formatearFecha(evento.fecha)}
                                    {evento.fechaFin && ` - ${formatearFecha(evento.fechaFin)}`}
                                </p>
                            </div>
                            <div className="flex items-center gap-3 mb-4">
                                <AccessTime />
                                <p><b>{t('form.time')}:</b>  {evento.hora || "Sin información"}</p>
                            </div>
                            <div className="flex items-center gap-3 mb-4">
                                <LocationOn />
                                <p><b>{t('location')}:</b> {evento.ubicacion}</p>
                            </div>
                            <div className="flex items-center gap-3 mb-4">
                                <Business />
                                <p><b>{t('form.organizer')}: </b>{evento.organizador || "Sin información"}</p>
                            </div>

                            <Divider className="my-4" />
                            <br />

                            <div className="flex justify-between items-center">
                                <p className="flex items-center gap-2">
                                    <span className="text-base font-semibold px-2 py-1 rounded-md">
                                        {t('form.price')}:
                                    </span>
                                </p>

                                {evento.precio && evento.precio.toString().toLowerCase() !== "0.00" && evento.precio.toLowerCase() !== "gratis" ? (
                                    <span className="text-base font-semibold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-md">
                                        {evento.precio} €
                                    </span>
                                ) : (
                                    <p className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-md text-sm font-medium border border-green-300">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {t('free')}
                                    </p>
                                )}
                            </div>

                            {evento.enlace && evento.enlace.trim() !== "" && (
                                <a href={evento.enlace} target="_blank" rel="noopener noreferrer" className="block w-full mt-4">
                                    <Button variant="contained" color="primary" className="w-full">
                                        {t('more')}
                                    </Button>
                                </a>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/*BOTÓN IR ARRIBA */}
            {mostrarBotonArriba && (
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 z-50"
                    title="Ir arriba"
                >
                    <FaArrowUp className="text-xl" />
                </button>
            )}


            {imagenAmpliada && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
                    <div className="relative">
                        <img src={`${evento.imagen}`} alt="Evento ampliado" className="max-w-full max-h-screen rounded shadow-lg" />
                        <button
                            onClick={() => setImagenAmpliada(false)}
                            className="absolute top-2 right-2 text-white text-2xl bg-black bg-opacity-50 rounded-full px-2 hover:bg-opacity-75"
                            title="Cerrar"
                        >
                            ✖
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Descripcion;
