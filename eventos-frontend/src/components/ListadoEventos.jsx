import { useEffect, useState, useRef } from "react";
import { Edit, MoreVertical, Trash, X } from "lucide-react";
import { deleteEvento, cambiarEstadoEvento } from "../services/eventos";
import Formulario2 from './Formulario';
import Modal from '@mui/material/Modal';
import { useOutletContext } from "react-router-dom";
import Box from '@mui/material/Box';
import { getEventoById } from "../services/eventos";

export default function ListadoEventos() {
    /*     const [eventos, setEventos] = useState(eventosIniciales || []); */
    const [mostrarForm, setMostrarForm] = useState(false);
    const [editarEvento, setEditarEvento] = useState(null);
    const [menuActivo, setMenuActivo] = useState(null);
    const [eventoAEliminar, setEventoAEliminar] = useState(null);
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
    const [user, setUser] = useState(null);
    const [busqueda, setBusqueda] = useState("");
    const [cargandoEvento, setCargandoEvento] = useState(false);
    

    const menuRefs = useRef({});

    const { eventos, onActualizarDashboard } = useOutletContext();

    const handleMostrarForm = () => setMostrarForm(true);
    const handleClose = () => {
        setMostrarForm(false);
        setEditarEvento(null);
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                menuActivo &&
                menuRefs.current[menuActivo] &&
                !menuRefs.current[menuActivo].contains(event.target)
            ) {
                setMenuActivo(null);
            }
        };


        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuActivo]);

    const handleToggleMenu = (id) => {
        setMenuActivo(menuActivo === id ? null : id);
    };

    const handleEditar = async (evento) => {
        setEditarEvento(evento);
        setMostrarForm(true);
      
        setCargandoEvento(true);
      
        try {
          const eventoCompleto = await getEventoById(evento.nombre);
          if (eventoCompleto) {
            setEditarEvento(prev => ({
              ...prev,
              ...eventoCompleto,
              categorias: eventoCompleto.categorias || prev.categorias || [],
            }));
          } else {
            console.warn("No se encontró evento completo, se mantiene el básico");
          }
        } catch (error) {
          console.error("Error al obtener el evento completo:", error);
        } finally {
          setCargandoEvento(false);
        }
    };
      

    const actualizarEventos = () => {
        if (user && user.nombre) {
            if (onActualizarDashboard) onActualizarDashboard();
        }
    };

    const eventosFiltrados = eventos.filter(evento =>
        evento.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser && onActualizarDashboard) {
            onActualizarDashboard();
        }
    }, []);

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        maxWidth: 800,
        bgcolor: 'background.paper',
        borderRadius: '16px',
        boxShadow: 24,
        p: 4,
        maxHeight: '90vh',
        overflowY: 'auto',
    };

    return (
        <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="mb-4 flex justify-between items-center">
                <input
                    type="text"
                    className="border border-gray-300 rounded-md px-4 py-2 text-base w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Buscar eventos por nombre"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
                <button onClick={handleMostrarForm} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
                    Agregar eventos
                </button>
            </div>

            <div className="overflow-visible h-96 mb-3">
                <table className="w-full text-left border-collapse ">
                    <thead>
                        <tr>
                            <th className="border-b py-2 px-4">Evento</th>
                            <th className="border-b py-2 px-4">Empresa</th>
                            <th className="border-b py-2 px-4">Fecha</th>
                            <th className="border-b py-2 px-4">Ubicación</th>
                            <th className="border-b py-2 px-4">Estado</th>
                            <th className="border-b py-2 px-4"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {eventosFiltrados.length > 0 ? (
                            eventosFiltrados.map(evento => (
                                <tr key={evento.id} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 font-medium">{evento.nombre}</td>
                                    <td className="py-2 px-4">{evento.autor}</td>
                                    <td className="py-2 px-4">{evento.fecha}</td>
                                    <td className="py-2 px-4">{evento.ubicacion}</td>
                                    <td className="py-2 px-4">
                                        {user?.roles?.includes("admin") ? (
                                            <select
                                                value={evento.estado}
                                                onChange={async (e) => {
                                                    const nuevoEstado = e.target.value;

                                                    //Opcional: si quieres ver cambios al instante en UI (mejor experiencia)
                                                    evento.estado = nuevoEstado;

                                                    const res = await cambiarEstadoEvento(evento.id, nuevoEstado);

                                                    if (!res && onActualizarDashboard) {
                                                        onActualizarDashboard(); //solo si falla el guardado
                                                    }
                                                }}
                                                className={`
                                                custom-select
                                                px-2 py-1 text-sm rounded-md cursor-pointer
                                                border border-gray-300
                                                focus:outline-none focus:ring-1 focus:ring-blue-300
                                                transition
                                                ${evento.estado === "A"
                                                        ? "bg-green-100 text-green-800"
                                                        : evento.estado === "P"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-red-100 text-red-800"
                                                    }
                                            `}
                                            >
                                                <option value="A">Aprobado</option>
                                                <option value="P">Pendiente</option>
                                                <option value="D">Denegado</option>
                                            </select>
                                        ) : (
                                            <span
                                                className={`
                                                px-2 py-1 text-sm rounded-md 
                                                ${evento.estado === "A"
                                                        ? "bg-green-100 text-green-800"
                                                        : evento.estado === "P"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-red-100 text-red-800"
                                                    }
                                            `}
                                            >
                                                {evento.estado === "A"
                                                    ? "Aprobado"
                                                    : evento.estado === "P"
                                                        ? "Pendiente"
                                                        : "Denegado"}
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-2 px-4">
                                        <div className="relative" ref={(el) => (menuRefs.current[evento.id] = el)}>
                                            <button
                                                className="p-2 rounded-full hover:bg-gray-200 transition"
                                                aria-label="Opciones"
                                                onClick={() => handleToggleMenu(evento.id)}
                                            >
                                                <MoreVertical size={18} />
                                            </button>
                                            {menuActivo === evento.id && (
                                                <div
                                                    className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 transition duration-150 ease-in-out"
                                                >
                                                    <div className="py-1">
                                                        <button
                                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                                                            onClick={() => handleEditar(evento)}
                                                        >
                                                            <Edit size={16} className="mr-2" />
                                                            Editar
                                                        </button>
                                                        <button
                                                            className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full"
                                                            onClick={() => {
                                                                setEventoAEliminar(evento);
                                                                setMostrarConfirmacion(true);
                                                                setMenuActivo(null);
                                                            }}
                                                        >
                                                            <Trash size={16} className="mr-2" />
                                                            Eliminar
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center py-4 text-gray-500">No hay resultados</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal para agregar o editar evento */}
            <Modal open={mostrarForm} onClose={handleClose}>
                <Box sx={modalStyle}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">
                            {editarEvento ? 'Editar Evento' : 'Nuevo Evento'}
                        </h2>
                        <button onClick={handleClose}>
                            <X size={24} />
                        </button>
                    </div>
                    {cargandoEvento ? (
                        <div className="text-center text-gray-500 py-8">Cargando evento...</div>
                    ) : (
                        <Formulario2
                            closeModal={handleClose}
                            eventoEditar={editarEvento}
                            onActualizar={actualizarEventos}
                        />
                    )}
                    <div className="flex justify-end mt-4">
                        <button
                            onClick={handleClose}
                            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
                        >
                            Cerrar
                        </button>
                    </div>
                </Box>
            </Modal>

            {/* Modal de confirmación de eliminación */}
            <Modal open={mostrarConfirmacion} onClose={() => setMostrarConfirmacion(false)}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    borderRadius: '12px',
                    boxShadow: 24,
                    p: 4
                }}>
                    <h2 className="text-lg font-bold mb-4 text-gray-800">Confirmar eliminación</h2>
                    <p className="mb-6 text-gray-600">
                        ¿Estás seguro de que quieres eliminar el evento <strong>{eventoAEliminar?.nombre}</strong>?
                    </p>
                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={() => setMostrarConfirmacion(false)}
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={async () => {
                                const exito = await deleteEvento(eventoAEliminar.id);
                                if (exito) {
                                    if (onActualizarDashboard) onActualizarDashboard();
                                }
                                setMostrarConfirmacion(false);
                            }}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Eliminar
                        </button>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}
