import { Link } from "react-router-dom";
import NavCategoria from "./NavCategoria";

const Header = () => {
    return (
        <>
            <header className="border-b py-3">
                <div className="flex justify-between items-center">
                    {/* Enlace Sobre Nosotros */}
                    <div className="flex-1">
                        <Link to="/about" className="text-gray-600 hover:text-gray-900 transition">Sobre Nosotros</Link>
                    </div>

                    {/* Logo */}
                    <div className="flex-1 text-center">
                        <div className="logo">
                            <a href="#" className="text-2xl font-bold text-gray-800">Nombre del sitio</a>
                        </div>
                    </div>

                    {/* Buscador y Botón de Login */}
                    <div className="flex-1 flex justify-end items-center space-x-4">
                        <form action="" method="GET" className="flex items-center space-x-2">
                            <input
                                type="text"
                                name="search"
                                id="search"
                                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                                placeholder="Buscar..."
                            />
                            <button
                                type="submit"
                                className="text-gray-600 hover:text-gray-900 transition"
                            >
                                🔍
                            </button>
                        </form>
                        <Link to="login" className="py-1 px-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">Iniciar Sesión</Link>
                    </div>
                </div>
            </header>
            <NavCategoria/>
        </>
    );
};

export default Header;