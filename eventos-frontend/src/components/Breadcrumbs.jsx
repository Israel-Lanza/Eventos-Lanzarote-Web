import { Link } from "react-router-dom";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const Breadcrumbs = ({ rutas }) => {
  return (
    <nav className="text-sm text-gray-600 mb-6" aria-label="breadcrumb">
      <ol className="flex items-center flex-wrap space-x-1">
        {rutas.map((ruta, index) => {
          const isLast = index === rutas.length - 1;

          return (
            <li key={index} className="flex items-center">
              {!isLast ? (
                <>
                  <Link
                    to={ruta.to}
                    className="text-blue-600 hover:underline font-medium transition"
                  >
                    {ruta.label}
                  </Link>
                  <ChevronRightIcon className="mx-1 text-gray-400" fontSize="small" />
                </>
              ) : (
                <span className="text-gray-500 font-semibold">{ruta.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;

