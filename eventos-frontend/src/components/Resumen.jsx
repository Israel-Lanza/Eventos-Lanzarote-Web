import { useEffect, useState } from "react";
import { getResumenEventos } from "../services/eventos"; // ajusta el path si es necesario

export default function Resumen() {
    const [resumen, setResumen] = useState({
        total: 0,
        activos: 0,
        pendientes: 0,
    });

    useEffect(() => {
        const autor = localStorage.getItem('nombreUsuario'); // o como lo tengas guardado
        const fetchResumen = async () => {
            const data = await getResumenEventos(autor);
            setResumen(data);
        };
    
        fetchResumen();
    }, []);

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
            <div>
                <h5 className="text-xl font-bold mb-2">Resumen</h5>
                <p className="text-gray-500 mb-4">Vista general de los eventos</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Total Eventos */}
                    <div className="border border-gray-200 rounded-lg p-4 text-center">
                        <div className="text-gray-500 text-sm">Total Eventos</div>
                        <div className="text-2xl font-bold">{resumen.total}</div>
                    </div>

                    {/* Eventos Activos */}
                    <div className="border border-gray-200 rounded-lg p-4 text-center">
                        <div className="text-gray-500 text-sm">Eventos Activos</div>
                        <div className="text-2xl font-bold">{resumen.activos}</div>
                    </div>

                    {/* Pendientes */}
                    <div className="border border-gray-200 rounded-lg p-4 text-center">
                        <div className="text-gray-500 text-sm">Pendientes</div>
                        <div className="text-2xl font-bold">{resumen.pendientes}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
