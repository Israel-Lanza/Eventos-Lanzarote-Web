export default function Resumen({ resumen }) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
            <h5 className="text-xl font-bold mb-2">Resumen</h5>
            <p className="text-gray-500 mb-4">Vista general de los eventos</p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="border rounded-lg p-4 text-center">
                    <div className="text-gray-500 text-sm">Total Eventos</div>
                    <div className="text-2xl font-bold">{resumen.total}</div>
                </div>
                <div className="border rounded-lg p-4 text-center">
                    <div className="text-gray-500 text-sm">Eventos Activos</div>
                    <div className="text-2xl font-bold">{resumen.activos}</div>
                </div>
                <div className="border rounded-lg p-4 text-center">
                    <div className="text-gray-500 text-sm">Eventos Denegados</div>
                    <div className="text-2xl font-bold">{resumen.denegados}</div>
                </div>
                <div className="border rounded-lg p-4 text-center">
                    <div className="text-gray-500 text-sm">Pendientes</div>
                    <div className="text-2xl font-bold">{resumen.pendientes}</div>
                </div>
            </div>
        </div>
    );
}