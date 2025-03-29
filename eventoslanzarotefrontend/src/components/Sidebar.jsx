import { Link } from "react-router-dom"
import { Calendar, Home, LogOut, Users, Menu } from "lucide-react"
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import api from "../services/api";


export default function Sidebar() {
    const navigate = useNavigate();  //Hook para redirigir al usuario
    const [isOpen, setIsOpen] = useState(true);

    const handleLogout = async () => {
        try {
            const response = await api.post('/logout');

            if (response.status === 200) {
                localStorage.removeItem('token');
                navigate('/login');  // Redirige al usuario a la página de login
            }
        } catch (error) {
            console.error('Error al cerrar sesión', error);
        }
    };

    return (

        <div className="flex">
            <div className={`fixed inset-y-0 left-0 z-50 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform bg-gray-900 text-white w-64 p-6 h-screen flex flex-col justify-between shadow-lg`}>
                {/* Encabezado */}
                <div>
                    <div className="mb-6 mt-12">
                        <h5 className="text-xl font-bold">Panel de Administración</h5>
                    </div>
                    <div className="space-y-3">
                        <Link to="/" className="flex items-center text-gray-300 hover:text-white transition">
                            <Home size={18} className="mr-2" /> Inicio
                        </Link>
                        <Link to="/eventos" className="flex items-center text-gray-300 hover:text-white transition">
                            <Calendar size={18} className="mr-2" /> Eventos
                        </Link>
                        <Link to="/empresas" className="flex items-center text-gray-300 hover:text-white transition">
                            <Users size={18} className="mr-2" /> Empresas
                        </Link>
                    </div>
                </div>
                <div>
                    <button onClick={handleLogout} className="flex items-center text-red-500 hover:text-red-700 transition">
                        <LogOut size={18} className="mr-2" /> Cerrar sesión
                    </button>
                </div>
            </div>

            {/* Botón del menú hamburguesa */}
            <div className="fixed top-4 left-4 z-50">
                <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-md bg-gray-800 text-white shadow-lg">
                    <Menu size={24} />
                </button>
            </div>

            {/* Espacio reservado para el Sidebar oculto */}
            <div className={`flex-grow ${isOpen ? 'ml-64' : ''} transition-all`}></div>
        </div>
    )
}