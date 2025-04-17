/* import { Link } from "react-router-dom";
import { FaBullhorn } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className=" py-12">
            <div className="container mx-auto px-4 text-center mt-2 py-2">
                <div className="flex flex-col items-center space-y-4">
                    <FaBullhorn className="text-4xl text-blue-500" />
                    <h2 className="text-2xl font-bold">¿Tienes un evento?</h2>
                    <p className=" max-w-md">
                        Comparte tu evento con miles de personas en Lanzarote. Es fácil, rápido y totalmente gratuito.
                    </p>
                    <Link
                        to="/registro"
                        className="mt-4 bg-blue-500 text-white font-semibold px-6 py-2 rounded-full hover:bg-blue-600 transition"
                    >
                        Regístrate
                    </Link>
                </div>

                <hr className="mt-5 mb-0 static bottom-0" />

                <p className="text-sm text-gray-800">
                    © 2025 eventoslanzarote.es — Todos los derechos reservados.
                </p>
            </div>
        </footer>
    );
};

export default Footer; */


import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="text-gray-800 pt-16 pb-8 mt-4">
            <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-extrabold mb-2">¿Quieres publicar tu evento?</h2>
                <p className="text-gray-700 mb-4">
                    Regístrate gratis o escríbenos a <a href="mailto:info@eventoslanzarote.es" className="text-blue-600 underline">info@eventoslanzarote.es</a>
                </p>
                
                <Link
                    to="/registro"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-md transition"
                >
                    Regístrate
                </Link>

                <div className="mt-16 border-t border-gray-300 pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-600">
                    <div className="mb-4 md:mb-0 font-semibold text-lg">
                        Eventos Lanzarote
                    </div>

                    <div className="flex space-x-6 mb-4 md:mb-0">
                        <Link to="/" className="hover:text-blue-600">INICIO</Link>
                        <Link to="/about" className="hover:text-blue-600">SOBRE NOSOTROS</Link>
                    </div>

                    <div className="text-xs">&copy; 2025 eventoslanzarote.es. Todos los derechos reservados.</div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

/* 
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="py-10">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold mb-2">¿Organizas un evento?</h2>
                <p className="text-gray-700 mb-4">
                    Regístrate gratis o escríbenos a <a href="mailto:info@eventoslanzarote.es" className="text-blue-600 underline">info@eventoslanzarote.es</a>
                </p>
                <Link
                    to="/registro"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-full"
                >
                    Regístrate
                </Link>

                <div className="mt-10 text-sm text-gray-500">
                    © 2025 eventoslanzarote.es — Todos los derechos reservados
                </div>
            </div>
        </footer>


    );
};

export default Footer;  */
