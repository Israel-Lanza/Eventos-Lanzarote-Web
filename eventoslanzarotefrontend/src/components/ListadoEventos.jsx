import { useEffect, useState } from "react";
import { Edit, MoreVertical, Trash } from "lucide-react";
import { getEventos } from "../services/eventos";
import Formulario2 from '../components/Formulario2'
import Modal from '@mui/material/Modal';
import { Menu, X } from "lucide-react";

import Box from '@mui/material/Box';

export default function ListadoEventos() {

    const [eventos, setEventos] = useState([]);
    const [mostrarForm, setMostrarForm] = useState(false);

    const handleMostrarForm = () => setMostrarForm(true);
    const handleClose = () => setMostrarForm(false);
    

    useEffect(() => {
        getEventos().then(data => setEventos(data));
    }, []);
    
    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        maxWidth: 800,
        bgcolor: 'background.paper',
        borderRadius: '16px',
        boxShadow: 24,
        p: 4,
        maxHeight: '90vh',
        overflowY: 'auto',
    };


    return (
        <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="mb-4 flex justify-between items-center">
                <input
                    type="text"
                    className="border border-gray-300 rounded-md p-2 w-72"
                    placeholder="Buscar eventos..."
                />

                <button
                    onClick={handleMostrarForm}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                >
                    Agregar eventos
                </button>
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

            {/* Modal */}
            <Modal open={mostrarForm} onClose={handleClose}>
                <Box sx={modalStyle}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Nuevo Evento</h2>
                        <button onClick={handleClose}>
                            <X size={24} />
                        </button>
                    </div>
                    <Formulario2 closeModal={handleClose} />
                    <div className="flex justify-end mt-4">
                        <button
                            onClick={handleClose}
                            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
                        >
                            Cerrar
                        </button>
                    </div>
                </Box>
            </Modal>
        </div>
    )
}
