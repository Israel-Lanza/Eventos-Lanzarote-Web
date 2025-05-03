import React from "react";
import { useTranslation } from 'react-i18next';


const Paginacion = ({ currentPage, lastPage, onPageChange }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between mt-6 px-4">
      {/* Botón Anterior */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {t("navigation.before")}
      </button>

      {/* Página actual */}
      <span className="text-gray-700 text-sm">
        {t("navigation.page")} {currentPage} {t('of')} {lastPage}
      </span>

      {/* Botón Siguiente */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= lastPage || lastPage === 0}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed">
        {t("navigation.next")}
      </button>
    </div>
  );
};

export default Paginacion;
