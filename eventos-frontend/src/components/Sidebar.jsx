import { NavLink } from "react-router-dom";
import { Calendar, Home, LogOut, Users, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import api from "../services/api";
import { useTranslation } from 'react-i18next';

export default function Sidebar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [user, setUser] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
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

  if (!user) return null; //No mostrar el sidebar si no hay usuario

  const admin = user.roles.includes("admin");

  return (
    <div className="flex">
      <div className={`fixed inset-y-0 left-0 z-50 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform bg-gray-900 text-white w-64 p-6 h-screen flex flex-col justify-between shadow-lg`}>
        <div>
          <div className="mb-6 mt-12">
            <h5 className="text-xl font-bold">{t('dashboard')}</h5>
          </div>
          <div className="space-y-3">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md transition ${
                  isActive
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
                `flex items-center px-3 py-2 rounded-md transition ${
                  isActive
                    ? 'bg-gray-800 border-l-4 border-blue-400 text-white font-semibold'
                    : 'text-gray-300 hover:text-white'
                }`
              }
            >
              <Calendar size={18} className="mr-2" /> {t('menu.events')}
            </NavLink>

            {admin && (
              <NavLink
                to="/dashboard/empresas"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md transition ${
                    isActive
                      ? 'bg-gray-800 border-l-4 border-blue-400 text-white font-semibold'
                      : 'text-gray-300 hover:text-white'
                  }`
                }
              >
                <Users size={18} className="mr-2" /> {t('menu.business')}
              </NavLink>
            )}
          </div>
        </div>

        <div>
          <button onClick={handleLogout} className="flex items-center text-red-500 hover:text-red-700 transition">
            <LogOut size={18} className="mr-2" /> Cerrar sesión
          </button>
        </div>
      </div>

      {/* Menú hamburguesa */}
      <div className="fixed top-4 left-4 z-50">
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-md bg-gray-800 text-white shadow-lg">
          <Menu size={24} />
        </button>
      </div>

      <div className={`flex-grow ${isOpen ? 'ml-64' : ''} transition-all`}></div>
    </div>
  );
}
