import { Link } from "react-router-dom";

const NavCategoria = () => {
    return (
        <div className="border-b py-2 mb-4">
            <nav className="flex flex-wrap justify-center gap-4 text-sm font-medium">
                <Link to="eventos/categoria/musicales" className="text-gray-700 hover:text-blue-600 transition">Musicales</Link>
                <Link to="eventos/categoria/talleres&cursos&conferencias" className="text-gray-700 hover:text-blue-600 transition">Talleres, cursos y conferencias</Link>
                <Link to="eventos/categoria/exposiciones" className="text-gray-700 hover:text-blue-600 transition">Exposiciones</Link>
                <Link to="eventos/categoria/gastrononicos" className="text-gray-700 hover:text-blue-600 transition">Gastronómicos</Link>
                <Link to="eventos/categoria/infantiles" className="text-gray-700 hover:text-blue-600 transition">Infantiles</Link>
                <Link to="eventos/categoria/tradicionales" className="text-gray-700 hover:text-blue-600 transition">Tradicionales</Link>
                <Link to="eventos/categoria/ferias&galas&festivales" className="text-gray-700 hover:text-blue-600 transition">Ferias, galas y festivales</Link>
                <Link to="eventos/categoria/artes-escenicas" className="text-gray-700 hover:text-blue-600 transition">Artes Escénicas</Link>
                <Link to="eventos/categoria/deportivos" className="text-gray-700 hover:text-blue-600 transition">Deportivos</Link>
            </nav>
        </div>
    );
};

export default NavCategoria;
