import { NavLink } from "react-router-dom";
import { Calendar, Home, LogOut, Users, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import api from "../services/api";
import { useTranslation } from 'react-i18next';
import SettingsIcon from '@mui/icons-material/Settings';

export default function Sidebar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 1024);
  const [user, setUser] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  if (!user) return null;

  const admin = user.roles.includes("admin");

  return (
    <>
      {/* Botón hamburguesa siempre visible */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-md bg-gray-800 text-white shadow-lg">
          <Menu size={24} />
        </button>
      </div>

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-40 transform 
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          transition-transform bg-gray-900 text-white 
          w-64 p-6 h-screen flex flex-col justify-between shadow-lg
          lg:translate-x-0
        `}>
          <div>
            <div className="flex flex-col items-center gap-3 mb-6 mt-12">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm sm:text-lg">
                {user.nombre.trim().slice(0, 2).toUpperCase()}
              </div>
              <h5 className="text-base sm:text-xl font-semibold truncate max-w-[150px]">
                Hola {user.nombre}
              </h5>
            </div>
            <div className="space-y-3">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md transition ${isActive
                    ? 'bg-gray-800 border-l-4 border-blue-400 text-white font-semibold'
                    : 'text-gray-300 hover:text-white'
                  }`
                }
              >
                <Home size={18} className="mr-2" /> {t('menu.home')}
              </NavLink>

              <NavLink
                to="/dashboard"
                end
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md transition ${isActive
                    ? 'bg-gray-800 border-l-4 border-blue-400 text-white font-semibold'
                    : 'text-gray-300 hover:text-white'
                  }`
                }
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    setIsOpen(false);
                  }
                }}
              >
                <Calendar size={18} className="mr-2" /> {t('menu.events')}
              </NavLink>

              {admin && (
                <NavLink
                  to="/dashboard/empresas"
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-md transition ${isActive
                      ? 'bg-gray-800 border-l-4 border-blue-400 text-white font-semibold'
                      : 'text-gray-300 hover:text-white'
                    }`
                  }
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      setIsOpen(false);
                    }
                  }}
                >
                  <Users size={18} className="mr-2" /> {t('menu.business')}
                </NavLink>
              )}


              <NavLink
                to="/dashboard/settings"
                end
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md transition ${isActive
                    ? 'bg-gray-800 border-l-4 border-blue-400 text-white font-semibold'
                    : 'text-gray-300 hover:text-white'
                  }`
                }
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    setIsOpen(false);
                  }
                }}
              >
                <SettingsIcon size={18} className="mr-2" />Ajustes
              </NavLink>
            </div>
          </div>

          <div>
            <button onClick={handleLogout} className="flex items-center text-red-500 hover:text-red-700 transition">
              <LogOut size={18} className="mr-2" /> Cerrar sesión
            </button>
          </div>
        </div>

        {/* Contenido principal ajustable según el estado del sidebar */}
        <div className={`flex-grow transition-all duration-300 ${isOpen ? 'lg:ml-64' : 'ml-0'}`}></div>
      </div>
    </>
  );
}