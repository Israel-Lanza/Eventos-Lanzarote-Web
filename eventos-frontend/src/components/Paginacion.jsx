import React from "react";

const Paginacion = ({ currentPage, lastPage, onPageChange }) => {
  return (
    <div className="flex items-center justify-between mt-6 px-4">
      {/* Botón Anterior */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Anterior
      </button>

      {/* Página actual */}
      <span className="text-gray-700 text-sm">
        Página {currentPage} de {lastPage}
      </span>

      {/* Botón Siguiente */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= lastPage || lastPage === 0}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed">
        Siguiente
      </button>
    </div>
  );
};

export default Paginacion;
