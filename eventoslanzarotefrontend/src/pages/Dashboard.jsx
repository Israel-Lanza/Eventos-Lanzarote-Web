import Sidebar from "../components/Sidebar";
import Resumen from "../components/Resumen";
import { Outlet } from "react-router-dom";
import ListadoEventos from "../components/ListadoEventos";

export default function AdminDashboard() {

    //Obtener el usuario del localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    const admin = user?.roles.includes("admin");
    const empresa = user?.roles.includes("empresa");

    return (
        <div className="flex min-h-screen">
            <Sidebar />

            {/* Main content */}
            <div className="flex-grow p-6 bg-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <div className="w-full text-center">
                        <h2 className="text-2xl font-bold text-gray-800">Panel de Administración</h2>
                    </div>
                </div>
                <div className="mb-6 flex flex-col gap-6 min-h-[100vh]">
                    <Resumen />

                    {admin && (
                        <Outlet />
                    )}
                    {empresa && (
                        <ListadoEventos />
                    )}
                </div>
            </div>
        </div>
    )
}