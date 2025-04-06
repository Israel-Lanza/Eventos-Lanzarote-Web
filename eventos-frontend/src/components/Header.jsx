import { Link, useNavigate } from "react-router-dom";
import NavCategoria from "./NavCategoria";
import { Search } from 'lucide-react';
import { useEffect, useState, useRef } from "react";
import api from "../services/api";

const Header = () => {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Cerrar dropdown si se hace clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  //Buscador por nombre funcionalidad
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const termino = e.target.search.value;
    if (termino.trim()) {
      navigate(`/buscar?query=${encodeURIComponent(termino)}`);
    }
  };

  return (
    <header className="border-b py-3">
      <div className="flex justify-between items-center">
        {/* Enlace Sobre Nosotros */}
        <div className="flex-1">
          <Link to="/about" className="text-gray-600 hover:text-gray-900 transition">Sobre Nosotros</Link>
        </div>

        {/* Logo */}
        <div className="flex-1 text-center">
          <Link to="/" className="inline-block">
            <div className="logo" />
          </Link>
        </div>


        {/* Buscador y Botón dinámico */}
        <div className="flex-1 flex justify-end items-center space-x-4 relative" ref={dropdownRef}>
          <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2">
            <input
              type="text"
              name="search"
              id="search"
              className="border border-gray-300 rounded-md px-6 py-2 text-base w-64 sm:w-72 md:w-80 lg:w-72 transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Buscar por nombre de evento"
            />
            <button
              type="submit"
              className="text-gray-600 hover:text-gray-900 transition"
            >
              <Search />
            </button>
          </form>

          {!user ? (
            <Link
              to="/login"
              className="py-1 px-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              Iniciar Sesión
            </Link>
            ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="py-1 px-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                Hola, {user.nombre}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Ir al Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
