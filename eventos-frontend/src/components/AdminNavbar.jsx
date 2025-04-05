//import { useState } from "react";
import { Link } from "react-router-dom";

const AdminNavbar = () => {

    return (
        <nav className="bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center space-x-8">
                        <div className="hidden sm:flex space-x-8 ms-10">
                            <Link to="/panel" className="text-gray-700 hover:text-gray-900 transition duration-150">Panel</Link>
                            <Link to="/" className="text-gray-700 hover:text-gray-900 transition duration-150">Inicio</Link>
                            <Link to="/panel/eventos" className="text-gray-700 hover:text-gray-900 transition duration-150">Eventos</Link>
                            <Link to="/panel/empresas" className="text-gray-700 hover:text-gray-900 transition duration-150">Empresas</Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};
export default AdminNavbar
