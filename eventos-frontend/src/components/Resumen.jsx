export default function Resumen({ resumen }) {
    return (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4">
          <h5 className="text-lg sm:text-xl font-bold mb-1">Resumen</h5>
          <p className="text-gray-500 text-sm mb-4">Vista general de los eventos</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Eventos */}
            <div className="border rounded-lg p-4 text-center bg-gray-50 hover:shadow transition">
              <div className="text-gray-500 text-sm mb-1">Total Eventos</div>
              <div className="text-xl sm:text-2xl font-bold">{resumen.total}</div>
            </div>
            {/* Activos */}
            <div className="border rounded-lg p-4 text-center bg-gray-50 hover:shadow transition">
              <div className="text-gray-500 text-sm mb-1">Eventos Activos</div>
              <div className="text-xl sm:text-2xl font-bold">{resumen.activos}</div>
            </div>
            {/* Denegados */}
            <div className="border rounded-lg p-4 text-center bg-gray-50 hover:shadow transition">
              <div className="text-gray-500 text-sm mb-1">Eventos Denegados</div>
              <div className="text-xl sm:text-2xl font-bold">{resumen.denegados}</div>
            </div>
            {/* Pendientes */}
            <div className="border rounded-lg p-4 text-center bg-gray-50 hover:shadow transition">
              <div className="text-gray-500 text-sm mb-1">Pendientes</div>
              <div className="text-xl sm:text-2xl font-bold">{resumen.pendientes}</div>
            </div>
          </div>
        </div>
    );
}