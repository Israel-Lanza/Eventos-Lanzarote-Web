import { Link } from "react-router-dom"
import { Calendar, Home, LogOut, Users } from "lucide-react"
import { useNavigate } from "react-router-dom";
import api from "../services/api";


export default function Sidebar() { 
    const navigate = useNavigate();  //Hook para redirigir al usuario
    
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
        <div className="bg-gray-100 border-r p-6 h-screen w-64 flex flex-col justify-between">
            {/* Encabezado */}
            <div>
                <div className="mb-6">
                    <h5 className="text-xl font-bold text-gray-800">Admin Dashboard</h5>
                    <p className="text-gray-500 text-sm">Gestión de eventos</p>
                </div>

                {/* Links de navegación */}
                <div className="space-y-3">
                    <Link href="/" className="flex items-center text-gray-700 hover:text-blue-600 transition">
                        <Home size={18} className="mr-2" />
                        Inicio
                    </Link>

                    <button className="flex items-center text-gray-700 hover:text-blue-600 transition w-full">
                        <Calendar size={18} className="mr-2" />
                        Eventos
                    </button>

                    <button className="flex items-center text-gray-700 hover:text-blue-600 transition w-full">
                        <Users size={18} className="mr-2" />
                        Empresas
                    </button>
                </div>
            </div>

            {/* Cerrar sesión */}
            <div>
                <button onClick={handleLogout} className="flex items-center text-red-600 hover:text-red-800 transition">
                    <LogOut size={18} className="mr-2" />
                    Cerrar sesión
                </button>
            </div>
        </div>
    )
}