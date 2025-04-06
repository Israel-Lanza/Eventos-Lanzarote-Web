import Sidebar from "../components/Sidebar";
import Resumen from "../components/Resumen";
import ListadoEventos from "../components/ListadoEventos";
import { useEffect, useState } from "react";
import { getDashboardData } from "../services/eventos";
import { Outlet } from "react-router-dom";

export default function AdminDashboard() {
    const [data, setData] = useState(null);

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
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-grow p-6 bg-gray-100">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Panel de Administración</h2>
                </div>

                {/* ✅ Solo renderiza si data existe */}
                {data ? (
                    <div className="mb-6 flex flex-col gap-6 min-h-[100vh]">
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