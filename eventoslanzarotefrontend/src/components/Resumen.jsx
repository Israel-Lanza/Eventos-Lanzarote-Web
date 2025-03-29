export default function Resumen() {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
            <div>
                <h5 className="text-xl font-bold mb-2">Resumen</h5>
                <p className="text-gray-500 mb-4">Vista general de los eventos</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Total Eventos */}
                    <div className="border border-gray-200 rounded-lg p-4 text-center">
                        <div className="text-gray-500 text-sm">Total Eventos</div>
                        <div className="text-2xl font-bold">24</div>
                    </div>

                    {/* Eventos Activos */}
                    <div className="border border-gray-200 rounded-lg p-4 text-center">
                        <div className="text-gray-500 text-sm">Eventos Activos</div>
                        <div className="text-2xl font-bold">18</div>
                    </div>

                    {/* Pendientes */}
                    <div className="border border-gray-200 rounded-lg p-4 text-center">
                        <div className="text-gray-500 text-sm">Pendientes</div>
                        <div className="text-2xl font-bold">6</div>
                    </div>
                </div>
            </div>
        </div>
    )
}