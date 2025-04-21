import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from "../services/api";

const Header = () => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  /*   const dropdownRef = useRef(null); */
  useEffect(() => {
    setSearchTerm("");
  }, [location.pathname]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.get("/user")
        .then(res => {
          setUser(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
        })
        .catch(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        });
    }
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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/buscar?query=${encodeURIComponent(searchTerm)}`);
    }
  };

  const cambiarIdioma = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('lang', lang);
  };

  return (
    <header className="border-b">
      {/* Logo */}
      <div className="flex justify-center py-4">
        <Link to="/" className="inline-block">
          <div className="logo w-24 h-10" />
        </Link>
      </div>

      {/* Mobile Menu Toggle */}
      <div className="flex justify-between items-center px-4 sm:hidden">
        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Menu lateral mobile */}
      {menuOpen && (
        <div className="sm:hidden px-4 py-2 space-y-2">
          <Link to="/about" className="block text-gray-700 mb-2">{t('about_us')}</Link>
          {!user ? (
            <Link to="/login" className="py-1 px-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">{t('login')}</Link>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="py-1 px-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                {t("hello")}, {user.nombre}
              </button>

              {dropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {t('dashboard')}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    {t('logout')}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Botones de idioma */}
          <div className="flex items-center space-x-2">
            {i18n.language === 'es' ? (
              <button
                onClick={() => cambiarIdioma('en')}
                className="text-sm px-2 py-1 flex items-center gap-1"
              >
                &#x1f1ec;&#x1f1e7; {t('english')}
              </button>
            ) : (
              <button
                onClick={() => cambiarIdioma('es')}
                className="text-sm px-2 py-1 flex items-center gap-1"
              >
                &#x1f1ea;&#x1f1e6; {t('spanish')}
              </button>
            )}
          </div>

        </div>
      )}

      {/* Desktop navbar */}
      <nav className="hidden sm:flex justify-between items-center px-6 py-2">
        <Link to="/about" className="text-gray-700 hover:text-gray-900">{t('about_us')}</Link>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {i18n.language === 'es' ? (
              <button
                onClick={() => cambiarIdioma('en')}
                className="text-sm px-2 py-1 flex items-center gap-1"
              >
                🇬🇧 {t('english')}
              </button>
            ) : (
              <button
                onClick={() => cambiarIdioma('es')}
                className="text-sm px-2 py-1 flex items-center gap-1"
              >
                🇪🇸 {t('spanish')}
              </button>
            )}
          </div>

          {!user ? (
            <Link to="/login" className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600">{t('login')}</Link>
          ) : (

            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="py-1 px-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                {t("hello")}, {user.nombre}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {t('dashboard')}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    {t('logout')}
                  </button>
                </div>
              )}
            </div>


          )}
        </div>
      </nav>

      {/* Buscador debajo */}
      <div className="flex justify-center py-4 px-4">
        <form onSubmit={handleSearchSubmit} className="flex items-center w-full max-w-2xl">
          <input
            type="text"
            name="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("search_placeholder") || "Buscar eventos..."}
            className="flex-grow border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600">
            <Search className="w-5 h-5" />
          </button>
        </form>
      </div>
    </header>
  );
};

export default Header;
