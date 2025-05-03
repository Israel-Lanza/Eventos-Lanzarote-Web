import Sidebar from "../components/Sidebar";
import Resumen from "../components/Resumen";
import ListadoEventos from "../components/ListadoEventos";
import Settings from "../components/Settings"; // IMPORTAMOS Settings
import { useEffect, useState } from "react";
import { getDashboardData } from "../services/eventos";
import { Outlet } from "react-router-dom";
import { useTranslation } from 'react-i18next';

export default function AdminDashboard() {
    const [data, setData] = useState(null);
    const { t, i18n } = useTranslation();
    const user = JSON.parse(localStorage.getItem('user'));
    const admin = user?.roles?.includes("admin");
    const empresa = user?.roles?.includes("empresa");

    const actualizarDashboard = () => {
        getDashboardData().then((res) => {
            setData(res);
        });
    };

    useEffect(() => {
        getDashboardData().then((res) => {
            setData(res);
        });
    }, []);
    const cambiarIdioma = (lang) => {
        i18n.changeLanguage(lang);
        localStorage.setItem('lang', lang);
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />

            <div className="flex-grow p-4 sm:p-6 md:p-8 transition-all duration-300 w-full">
                {/* Botón de idioma arriba a la derecha */}
                <div className="flex justify-end mb-2">
                    {i18n.language === 'es' ? (
                        <button
                            onClick={() => cambiarIdioma('en')}
                            className="text-sm px-2 py-1 flex items-center gap-1"
                        >
                            🇬🇧 {t('english')}
                        </button>
                    ) : (
                        <button
                            onClick={() => cambiarIdioma('es')}
                            className="text-sm px-2 py-1 flex items-center gap-1"
                        >
                            🇪🇸 {t('spanish')}
                        </button>
                    )}
                </div>

                {/* Título del dashboard */}
                <div className="text-center mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{t('dashboard')}</h2>
                </div>

                {data ? (
                    <div className="mb-6 flex flex-col gap-6">
                        <Resumen resumen={data.resumen} />

                        {/* ADMIN */}
                        {admin && (
                            <Outlet context={{
                                eventos: data.eventos,
                                empresas: data.empresas,
                                onActualizarDashboard: actualizarDashboard
                            }} />
                        )}

                        {/* EMPRESA */}
                        {empresa && (
                            <Outlet context={{
                                eventos: data.eventos,
                                onActualizarDashboard: actualizarDashboard
                            }} />
                        )}
                    </div>
                ) : (
                    <div className="text-center text-gray-500">Cargando datos del dashboard...</div>
                )}
            </div>
        </div>
    );
}
