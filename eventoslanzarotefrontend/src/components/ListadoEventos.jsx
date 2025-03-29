"use client"

import { useEffect, useState } from "react";
import { Edit, MoreVertical, Trash } from "lucide-react";
import { getEventos } from "../services/eventos";

export default function ListadoEventos() {

    const [eventos, setEventos] = useState([]);

    useEffect(() => {
        getEventos().then(data => setEventos(data));
    }, []);

    return (
        <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="mb-4 flex justify-between items-center">
                <input
                    type="text"
                    className="border border-gray-300 rounded-md p-2 w-72"
                    placeholder="Buscar eventos..."
                />
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr>
                            <th className="border-b py-2 px-4">Evento</th>
                            <th className="border-b py-2 px-4">Empresa</th>
                            <th className="border-b py-2 px-4">Fecha</th>
                            <th className="border-b py-2 px-4">Ubicación</th>
                            <th className="border-b py-2 px-4">Estado</th>
                            <th className="border-b py-2 px-4"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {eventos.length > 0 ? (
                            eventos.map(evento => (
                                <tr key={evento.id} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 font-medium">{evento.nombre}</td>
                                    <td className="py-2 px-4">{evento.autor}</td>
                                    <td className="py-2 px-4">{evento.fecha}</td>
                                    <td className="py-2 px-4">{evento.ubicacion}</td>
                                    <td className="py-2 px-4">
                                        <span className={`px-2 py-1 text-sm rounded-md ${evento.estado === "A" ? "bg-green-500 text-white" : "bg-gray-400 text-white"}`}>
                                            {evento.estado === "A" ? "Activo" : "Pendiente"}
                                        </span>
                                    </td>
                                    <td className="py-2 px-4">
                                        <div className="relative">
                                            <button className="p-2 rounded-full hover:bg-gray-200 transition" aria-label="Opciones">
                                                <MoreVertical size={18} />
                                            </button>
                                            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                                <div className="py-1">
                                                    <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full">
                                                        <Edit size={16} className="mr-2" />
                                                        Editar
                                                    </button>
                                                    <button className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full">
                                                        <Trash size={16} className="mr-2" />
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center py-4 text-gray-500">No hay resultados</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
