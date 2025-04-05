import { useEffect, useState } from "react";
import { Edit, MoreVertical, Trash } from "lucide-react";
import { getEmpresas } from "../services/empresas";

export default function ListadoEmpresas() {

    const [empresas, setEmpresas] = useState([]);

    useEffect(() => {
        getEmpresas().then(data => setEmpresas(data));
    }, []);

    console.log(empresas.data);
    return (
        <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="mb-4 flex justify-between items-center">
                <input
                    type="text"
                    className="border border-gray-300 rounded-md p-2 w-72"
                    placeholder="Buscar empresas..."
                />
            </div>

            <div className="overflow-visible h-96 mb-3">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr>
                            <th className="border-b py-2 px-4">Nombre</th>
                            <th className="border-b py-2 px-4">Email</th>
                            <th className="border-b py-2 px-4">CIF</th>
                            <th className="border-b py-2 px-4"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {empresas.data.length > 0 ? (
                            empresas.data.map(empresa => (
                                <tr key={empresa.id} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 font-medium">{empresa.nombre}</td>
                                    <td className="py-2 px-4">{empresa.email}</td>
                                    <td className="py-2 px-4">{empresa.cif}</td>
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
                                <td colSpan={4} className="text-center py-4 text-gray-500">No hay resultados</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
