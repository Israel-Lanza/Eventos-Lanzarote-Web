import { useState, useRef, useEffect } from "react";
import { Edit, MoreVertical, Trash, X } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { deleteEmpresa } from "../services/empresas";
import FormularioEmpresa from "./FormularioEmpresas";
import Paginacion from "../components/Paginacion";
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export default function ListadoEmpresas() {
    const { empresas, onActualizarDashboard } = useOutletContext();
    const [busqueda, setBusqueda] = useState("");
    const [mostrarForm, setMostrarForm] = useState(false);
    const [empresaEditar, setEmpresaEditar] = useState(null);
    const [menuActivo, setMenuActivo] = useState(null);
    const [empresaAEliminar, setEmpresaAEliminar] = useState(null);
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
    const [paginaActual, setPaginaActual] = useState(1);
    const empresasPorPagina = 5;
    const { t } = useTranslation();

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
        p: 1,
        maxHeight: '90vh',
        overflowY: 'auto',
    };


    const indiceInicio = (paginaActual - 1) * empresasPorPagina;
    const indiceFin = indiceInicio + empresasPorPagina;
    const empresasPaginadas = empresasFiltradas.slice(indiceInicio, indiceFin);

    const totalPaginas = Math.max(1, Math.ceil(empresasFiltradas.length / empresasPorPagina));

    return (
        <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6">
          {/* Buscador y botón */}
          <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <input
              type="text"
              className="border border-gray-300 rounded-md p-2 w-full sm:w-72 text-sm"
              placeholder="Buscar empresas..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <button
              onClick={() => setMostrarForm(true)}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition text-sm"
            >
              {t("add_user")}
            </button>
          </div>
      
          {/* Tabla con scroll en móvil */}
          <div className="overflow-x-auto mb-3">
            <table className="min-w-full text-left border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border-b py-2 px-4">{t("form.name")}</th>
                  <th className="border-b py-2 px-4">Email</th>
                  <th className="border-b py-2 px-4">CIF</th>
                  <th className="border-b py-2 px-4 text-right">{t("form.accions")}</th>
                </tr>
              </thead>
              <tbody>
                {empresasPaginadas.length > 0 ? (
                  empresasPaginadas.map((empresa) => (
                    <tr key={empresa.id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 font-medium">{empresa.nombre}</td>
                      <td className="py-2 px-4">{empresa.email}</td>
                      <td className="py-2 px-4">{empresa.cif}</td>
                      <td className="py-2 px-4 text-right">
                        <div
                          className="relative inline-block"
                          ref={(el) => (menuRefs.current[empresa.id] = el)}
                        >
                          <button
                            className="p-2 rounded-full hover:bg-gray-200 transition"
                            aria-label="Opciones"
                            onClick={() =>
                              setMenuActivo(menuActivo === empresa.id ? null : empresa.id)
                            }
                          >
                            <MoreVertical size={18} />
                          </button>
                          {menuActivo === empresa.id && (
                            <div className="absolute right-0 mt-2 w-44 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                              <div className="py-1">
                                <button
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                                  onClick={() => handleEditar(empresa)}
                                >
                                  <Edit size={16} className="mr-2" />
                                  {t("edit")}
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
                                  {t("delete")}
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
                    <td colSpan={4} className="text-center py-4 text-gray-500">
                      {t("no_result")}
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
      
          
      
          {/* MODAL Formulario */}
          <Modal open={mostrarForm} onClose={handleClose}>
            <Box sx={modalStyle}>
              <button onClick={handleClose} className="absolute right-3">
                  <X size={24} />
              </button>
              <div className="flex justify-center items-center">
                <h2 className="text-lg sm:text-xl font-semibold">
                  {empresaEditar ? t("edit_user") : t( "new_user")}
                </h2>
              </div>
              <FormularioEmpresa
                closeModal={handleClose}
                empresaEditar={empresaEditar}
                onActualizar={onActualizarDashboard}
              />
            </Box>
          </Modal>
      
          {/* MODAL Confirmación eliminación */}
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
              <h2 className="text-lg font-bold mb-4 text-gray-800">{t("confirm_delete")}</h2>
              <p className="mb-6 text-gray-600">
                {t("sure_user")}{" "}
                <strong>{empresaAEliminar?.nombre}</strong>?
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setMostrarConfirmacion(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 text-sm"
                >
                  {t("cancel")}
                </button>
                <button
                  onClick={async () => {
                    const exito = await deleteEmpresa(empresaAEliminar.id);
                    if (exito && onActualizarDashboard) {
                      toast.success("Empresa eliminada correctamente.");
                      onActualizarDashboard();
                    }else{
                      toast.error(t("errors.delete_user"));
                    }
                    setMostrarConfirmacion(false);
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                >
                  {t("delete")}
                </button>
              </div>
            </Box>
          </Modal>
        </div>
    );
      
}
