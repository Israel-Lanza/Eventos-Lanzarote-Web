import { useEffect, useState, useRef } from "react";
import { Edit, MoreVertical, Trash, X, Loader2 } from "lucide-react";
import { deleteEvento, cambiarEstadoEvento, getDashboardData } from "../services/eventos";
import Formulario from './Formulario';
import Modal from '@mui/material/Modal';
import { useOutletContext } from "react-router-dom";
import Box from '@mui/material/Box';
import { getEventoById } from "../services/eventos";
import Paginacion from "../components/Paginacion";
import { toast } from 'react-hot-toast';


export default function ListadoEventos({ eventosIniciales, actualizarDashboard }) {
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editarEvento, setEditarEvento] = useState(null);
  const [menuActivo, setMenuActivo] = useState(null);
  const [eventoAEliminar, setEventoAEliminar] = useState(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [user, setUser] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [cargandoEvento, setCargandoEvento] = useState(false);
  const [cargandoId, setCargandoId] = useState(null);
  const [estadosActualizados, setEstadosActualizados] = useState({});
  const [paginaActual, setPaginaActual] = useState(1);
  const eventosPorPagina = 5;
  const menuRefs = useRef({});


  const outletContext = useOutletContext() || {};
  const eventosDesdeOutlet = outletContext.eventos;
  const onActualizarDashboard = outletContext.onActualizarDashboard;

  const [eventos, setEventos] = useState(eventosIniciales || []);

  useEffect(() => {
    if (eventosDesdeOutlet) {
      setEventos(eventosDesdeOutlet);
    }
  }, [eventosDesdeOutlet, eventosIniciales]);

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
    getDashboardData().then((data) => {
      setEventos(data.eventos);
      if (actualizarDashboard) {
        actualizarDashboard();
      } else if (onActualizarDashboard) {
        onActualizarDashboard();
      }
    });
  };

  const eventosFiltrados = eventos.filter(evento =>
    evento.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const indiceInicio = (paginaActual - 1) * eventosPorPagina;
  const indiceFin = indiceInicio + eventosPorPagina;
  const eventosPaginados = eventosFiltrados.slice(indiceInicio, indiceFin);

  const totalPaginas = Math.ceil(eventosFiltrados.length / eventosPorPagina);

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
    p: 1,
    maxHeight: '90vh',
    overflowY: 'auto',
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6">
      {/* Buscador y botón */}
      <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <input
          type="text"
          className="border border-gray-300 rounded-md px-4 py-2 text-sm w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Buscar eventos por nombre"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <button
          onClick={handleMostrarForm}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition text-sm"
        >
          Agregar eventos
        </button>
      </div>

      {/* Tabla con scroll horizontal en móvil */}
      <div className="overflow-visible h-96 mb-3">
        <table className="min-w-full text-left border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b py-2 px-4">Evento</th>
              <th className="border-b py-2 px-4">Empresa</th>
              <th className="border-b py-2 px-4">Fecha</th>
              <th className="border-b py-2 px-4">Ubicación</th>
              <th className="border-b py-2 px-4">Estado</th>
              <th className="border-b py-2 px-4 text-right"></th>
            </tr>
          </thead>
          <tbody>
            {eventosPaginados.length > 0 ? (
              eventosPaginados.map((evento) => (
                <tr key={evento.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 font-medium">{evento.nombre}</td>
                  <td className="py-2 px-4">{evento.autor}</td>
                  <td className="py-2 px-4">{evento.fecha}</td>
                  <td className="py-2 px-4">{evento.ubicacion}</td>
                  <td className="py-2 px-4 text-right">
                    {user?.roles?.includes("admin") ? (
                      <select
                        value={estadosActualizados[evento.id] ?? evento.estado}
                        onChange={async (e) => {
                          const nuevoEstado = e.target.value;
                          setCargandoId(evento.id);
                          setEstadosActualizados((prev) => ({
                            ...prev,
                            [evento.id]: nuevoEstado,
                          }));
                          const res = await cambiarEstadoEvento(evento.id, nuevoEstado);
                          if (res && onActualizarDashboard) onActualizarDashboard();
                          setCargandoId(null);
                        }}
                        disabled={cargandoId === evento.id}
                        className={`px-2 py-1 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-300 transition
                            ${(estadosActualizados[evento.id] ?? evento.estado) === "A"
                            ? "bg-green-100 text-green-800"
                            : (estadosActualizados[evento.id] ?? evento.estado) === "P"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                      >
                        {cargandoId === evento.id ? (
                          <option>Cargando...</option>
                        ) : (
                          <>
                            <option value="A">Aprobado</option>
                            <option value="P">Pendiente</option>
                            <option value="D">Denegado</option>
                          </>
                        )}
                      </select>
                    ) : (
                      <span
                        className={`px-2 py-1 text-sm rounded-md ${evento.estado === "A"
                            ? "bg-green-100 text-green-800"
                            : evento.estado === "P"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                      >
                        {evento.estado === "A"
                          ? "Aprobado"
                          : evento.estado === "P"
                            ? "Pendiente"
                            : "Denegado"}
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-4 text-right">
                    <div
                      className="relative inline-block"
                      ref={(el) => (menuRefs.current[evento.id] = el)}
                    >
                      <button
                        className="p-2 rounded-full hover:bg-gray-200 transition"
                        aria-label="Opciones"
                        onClick={() => handleToggleMenu(evento.id)}
                      >
                        <MoreVertical size={18} />
                      </button>
                      {menuActivo === evento.id && (
                        <div className="absolute right-0 mt-2 w-44 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
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
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  No hay resultados
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="mt-4">
          <Paginacion
            currentPage={paginaActual}
            lastPage={totalPaginas}
            onPageChange={setPaginaActual}
          />
        </div>
      </div>

      {/* Modal para agregar/editar */}
      <Modal open={mostrarForm} onClose={handleClose}>
        <Box sx={modalStyle}>
          <button onClick={handleClose} className="absolute right-3">
            <X size={24} />
          </button>
          <div className="flex justify-center items-center mb-4">
            <h2 className="text-lg sm:text-xl font-semibold">
              {editarEvento ? "Editar Evento" : "Nuevo Evento"}
            </h2>

          </div>
          {cargandoEvento ? (
            <div className="text-center text-gray-500 py-8">Cargando evento...</div>
          ) : (
            <Formulario
              closeModal={handleClose}
              eventoEditar={editarEvento}
              onActualizar={actualizarEventos}
            />
          )}
        </Box>
      </Modal>

      {/* Modal de confirmación de eliminación */}
      <Modal open={mostrarConfirmacion} onClose={() => setMostrarConfirmacion(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: "12px",
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2 className="text-lg font-bold mb-4 text-gray-800">Confirmar eliminación</h2>
          <p className="mb-6 text-gray-600">
            ¿Estás seguro de que quieres eliminar el evento{" "}
            <strong>{eventoAEliminar?.nombre}</strong>?
          </p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setMostrarConfirmacion(false)}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 text-sm"
            >
              Cancelar
            </button>
            <button
              onClick={async () => {
                const exito = await deleteEvento(eventoAEliminar.id);
                if (exito){
                  toast.success("Evento eliminado correctamente.");
                  actualizarEventos();
                } else{
                  toast.error("Error al eliminar el evento.");
                } 
                setMostrarConfirmacion(false);
              }}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
            >
              Eliminar
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );

}
