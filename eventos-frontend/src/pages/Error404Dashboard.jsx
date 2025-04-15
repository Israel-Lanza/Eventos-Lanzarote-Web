import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeftCircle } from "lucide-react";


export default function Error404Dashboard() {
    const [dashboardPath, setDashboardPath] = useState("/dashboard");

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));

        if (user?.roles?.includes("admin")) {
        setDashboardPath("/dashboard");
        } else if (user?.roles?.includes("empresa")) {
        setDashboardPath("/dashboard");
        } else {
        setDashboardPath("/"); // fallback si no hay rol
        }
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen px-4 bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-lg w-full">
            <h1 className="text-4xl font-bold text-red-500 mb-2">404</h1>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Sección no encontrada
            </h2>
            <p className="text-gray-600 mb-6">
            Lo sentimos, la sección del panel que estás intentando visitar no existe o no tienes acceso.
            </p>
            <Link
            to={dashboardPath}
            className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
            <ArrowLeftCircle className="w-5 h-5 mr-2" />
            Volver al Dashboard
            </Link>
        </div>
        </div>
    );
}
  