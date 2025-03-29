function Notifications() {
    return (
        <div className="container min-h-screen text-gray-800 flex p-4 space-x-4">
            {/* Resumen */}
            <div className="w-full md:w-1/3 space-y-4">
                <h2 className="font-bold text-xl mb-4">Resumen</h2>
                
                {/* Aprobados */}
                <div className="bg-white rounded-lg shadow-md text-center p-4">
                    <h2 className="text-2xl mb-2">✅ Aprobados</h2>
                    <p className="text-gray-600">Nº eventos</p>
                </div>
                
                {/* Denegados */}
                <div className="bg-white rounded-lg shadow-md text-center p-4">
                    <h2 className="text-2xl mb-2">❌ Denegados</h2>
                    <p className="text-gray-600">Nº eventos</p>
                </div>
                
                {/* Pendientes */}
                <div className="bg-white rounded-lg shadow-md text-center p-4">
                    <h2 className="text-2xl mb-2">⏳ Pendientes</h2>
                    <p className="text-gray-600">Nº eventos</p>
                </div>
            </div>
            
            {/* Notificaciones Recientes */}
            <div className="w-full md:w-2/3 space-y-4">
                <h2 className="font-bold text-xl mb-4 text-center">Notificaciones Recientes</h2>
                
                <div className="bg-white rounded-lg shadow-md p-4">
                    <p>📢 El evento <strong>NOMBRE</strong> ha cambiado a estado <strong>ESTADO</strong>.</p>
                    <small className="text-gray-500">📅 FECHA Y HORA DE ACTUALIZACIÓN</small>
                </div>
            </div>
        </div>
    )
}

export default Notifications;