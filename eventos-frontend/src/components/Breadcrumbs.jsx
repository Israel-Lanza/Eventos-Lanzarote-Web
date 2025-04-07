import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const Breadcrumbs = ({ rutas }) => {
  return (
    <nav className="text-sm text-gray-600 mb-4 flex items-center">
      {rutas.map((ruta, index) => (
        <span key={index} className="flex items-center">
          {index > 0 && <ChevronRight size={14} className="mx-1" />}
          {ruta.to ? (
            <Link to={ruta.to} className="hover:underline hover:text-black">
              {ruta.label}
            </Link>
          ) : (
            <span className="font-semibold text-gray-800">{ruta.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
