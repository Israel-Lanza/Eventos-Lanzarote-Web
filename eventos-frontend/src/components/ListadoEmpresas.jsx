import { useState, useRef, useEffect } from "react";
import { Edit, MoreVertical, Trash, X } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { deleteEmpresa } from "../services/empresas";
import FormularioEmpresa from "./FormularioEmpresas";


export default function ListadoEmpresas() {
    const { empresas, onActualizarDashboard } = useOutletContext();
    const [busqueda, setBusqueda] = useState("");
    const [mostrarForm, setMostrarForm] = useState(false);
    const [empresaEditar, setEmpresaEditar] = useState(null);
    const [menuActivo, setMenuActivo] = useState(null);
    const [empresaAEliminar, setEmpresaAEliminar] = useState(null);
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

    const menuRefs = useRef({});

    const handleClose = () => {
        setMostrarForm(false);
        setEmpresaEditar(null);
    };

    const handleEditar = (empresa) => {
        setEmpresaEditar(empresa);
        setMostrarForm(true);
        setMenuActivo(null);
    };

    const handleClickOutside = (event) => {
        if (menuActivo && menuRefs.current[menuActivo] && !menuRefs.current[menuActivo].contains(event.target)) {
            setMenuActivo(null);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuActivo]);

    const empresasFiltradas = empresas.filter((e) =>
        e.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

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
                    className="border border-gray-300 rounded-md p-2 w-72"
                    placeholder="Buscar empresas..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
                <button
                    onClick={() => setMostrarForm(true)}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                >
                    Agregar empresa
                </button>
            </div>

            <div className="overflow-visible h-96 mb-3">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr>
                            <th className="border-b py-2 px-4">Nombre</th>
                            <th className="border-b py-2 px-4">Email</th>
                            <th className="border-b py-2 px-4">CIF</th>
                            <th className="border-b py-2 px-4"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {empresasFiltradas.length > 0 ? (
                            empresasFiltradas.map((empresa) => (
                                <tr key={empresa.id} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 font-medium">{empresa.nombre}</td>
                                    <td className="py-2 px-4">{empresa.email}</td>
                                    <td className="py-2 px-4">{empresa.cif}</td>
                                    <td className="py-2 px-4">
                                        <div className="relative" ref={(el) => (menuRefs.current[empresa.id] = el)}>
                                            <button
                                                className="p-2 rounded-full hover:bg-gray-200 transition"
                                                aria-label="Opciones"
                                                onClick={() => setMenuActivo(menuActivo === empresa.id ? null : empresa.id)}
                                            >
                                                <MoreVertical size={18} />
                                            </button>
                                            {menuActivo === empresa.id && (
                                                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                                    <div className="py-1">
                                                        <button
                                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                                                            onClick={() => handleEditar(empresa)}
                                                        >
                                                            <Edit size={16} className="mr-2" />
                                                            Editar
                                                        </button>
                                                        <button
                                                            className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full"
                                                            onClick={() => {
                                                                setEmpresaAEliminar(empresa);
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
                                <td colSpan={4} className="text-center py-4 text-gray-500">No hay resultados</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal agregar/editar empresa */}
            <Modal open={mostrarForm} onClose={handleClose}>
                <Box sx={modalStyle}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">
                            {empresaEditar ? 'Editar Empresa' : 'Nueva Empresa'}
                        </h2>
                        <button onClick={handleClose}>
                            <X size={24} />
                        </button>
                    </div>
                     <FormularioEmpresa
                        closeModal={handleClose}
                        empresaEditar={empresaEditar}
                        onActualizar={onActualizarDashboard}
                    /> 
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
                        ¿Estás seguro de que quieres eliminar la empresa <strong>{empresaAEliminar?.nombre}</strong>?
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
                                const exito = await deleteEmpresa(empresaAEliminar.id);
                                if (exito && onActualizarDashboard) {
                                    onActualizarDashboard();
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
