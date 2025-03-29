import React, { useState } from 'react';
import Formulario2 from '../components/Formulario2';
import { Dialog } from '@headlessui/react';

const Eventos = () => {
  const [mostrarForm, setMostrarForm] = useState(false);

  const handleMostrarForm = () => setMostrarForm(true);
  const handleClose = () => setMostrarForm(false);

  return (
    <div>
      <button 
        onClick={handleMostrarForm} 
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
      >
        Agregar eventos
      </button>

      <Dialog open={mostrarForm} onClose={handleClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <Dialog.Panel className="bg-white w-full max-w-5xl rounded-lg shadow-lg p-6">
          <Dialog.Title className="text-xl font-bold mb-4">Crear Evento</Dialog.Title>
          <Formulario2 closeModal={handleClose} />
          <div className="flex justify-end mt-4">
            <button 
              onClick={handleClose} 
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
            >
              Cerrar
            </button>
          </div>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
};

export default Eventos;