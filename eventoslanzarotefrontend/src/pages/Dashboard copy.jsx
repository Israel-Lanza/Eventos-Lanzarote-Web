import Sidebar from "../components/Sidebar";
import Resumen from "../components/Resumen";
import { Outlet } from "react-router-dom";
import { useState } from 'react';
import Formulario2 from '../components/Formulario2'
import { Dialog } from '@headlessui/react';

export default function AdminDashboard() {
    const [mostrarForm, setMostrarForm] = useState(false);

    const handleMostrarForm = () => setMostrarForm(true);
    const handleClose = () => setMostrarForm(false);

    return (
        <div className="flex min-h-screen">
            <Sidebar />

            {/* Main content */}
            <div className="flex-grow p-6 bg-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Gestión de Eventos</h2>
                        <p className="text-gray-600">Administra todos los eventos de la plataforma</p>
                    </div>
                    <button 
                        onClick={handleMostrarForm} 
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                    >
                        Agregar eventos
                    </button>
                </div>

                <div className="mb-6">
                    <Resumen />
                    <Outlet />
                </div>

                {/* Modal */}
                <Dialog open={mostrarForm} onClose={handleClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <Dialog.Panel className="bg-white w-full max-w-5xl rounded-lg shadow-lg p-6">
                        <Dialog.Title className="text-xl font-bold mb-4">Nuevo Evento</Dialog.Title>
                        <Formulario2 closeModal={handleClose} />
                        <div className="flex justify-end mt-4">
                            <button 
                                onClick={handleClose} 
                                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
                            >
                                Cerrar
                            </button>
                        </div>
                    </Dialog.Panel>
                </Dialog>
            </div>
        </div>
    )
}