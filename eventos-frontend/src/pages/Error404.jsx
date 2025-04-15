import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Error404(){

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-gradient-to-br from-blue-50 to-white text-center">
          <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-md border border-blue-100">
            <h1 className="text-7xl font-extrabold text-blue-600 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Página no encontrada
            </h2>
            <p className="text-gray-600 mb-6">
              Lo sentimos, la página que estás buscando no existe o ha sido movida.
            </p>
            <Link to="/" className="inline-flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
              <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al inicio
            </Link>
          </div>
        </div>
    );
}