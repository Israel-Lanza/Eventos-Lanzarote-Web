import Sidebar from "../components/Sidebar";
import Resumen from "../components/Resumen";
import ListadoEventos from "../components/ListadoEventos";
import { useEffect, useState } from "react";
import { getDashboardData } from "../services/eventos";
import { Outlet } from "react-router-dom";
import { useTranslation } from 'react-i18next';

export default function AdminDashboard() {
    const [data, setData] = useState(null);
    const { t } = useTranslation();
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

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />

            <div className="flex-grow p-4 sm:p-6 md:p-8 transition-all duration-300 w-full">
                <div className="text-center mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{t('dashboard')}</h2>
                </div>

                {data ? (
                    <div className="mb-6 flex flex-col gap-6">
                        <Resumen resumen={data.resumen} />
                        {admin && (
                            <Outlet context={{
                                eventos: data.eventos,
                                empresas: data.empresas,
                                onActualizarDashboard: actualizarDashboard
                            }} />
                        )}
                        {empresa && <ListadoEventos eventosIniciales={data.eventos} />}
                    </div>
                ) : (
                    <div className="text-center text-gray-500">Cargando datos del dashboard...</div>
                )}
            </div>
        </div>
    );
}
