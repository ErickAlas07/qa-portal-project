import { useState } from 'react';
import { X } from 'lucide-react';
import { ESTADOS_PRUEBA, ESTADOS_UI } from '../utils/constants';

export default function Drawer({ isOpen, onClose, item }) {
  const [selectedStatus, setSelectedStatus] = useState(item?.estado || ESTADOS_PRUEBA.PENDIENTE);
  const [observaciones, setObservaciones] = useState(item?.observaciones || '');

  if (!isOpen || !item) return null;

  return (
    <>
      {/* Overlay oscuro para el fondo */}
      <div 
        className="fixed inset-0 bg-slate-900/40 z-40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Contenedor del Drawer deslizable */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl pb-safe dark:bg-dark-bg border-t border-slate-200 dark:border-slate-800 animate-[slide-up_0.3s_ease-out]">
        
        {/* Manija superior */}
        <div className="w-full flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 bg-slate-300 rounded-full dark:bg-slate-700" />
        </div>

        {/* Cabecera */}
        <div className="flex justify-between items-center px-4 py-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs font-mono font-bold text-slate-500">{item.id_caso}</span>
            <h2 className="text-base font-bold text-slate-800 dark:text-white leading-tight">Ejecutar Prueba</h2>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo del formulario */}
        <div className="p-4 space-y-5 overflow-y-auto max-h-[70vh]">
          
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 dark:bg-slate-800/50 dark:border-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300">
            {item.descripcion}
          </div>

          {/* Selector de Estados */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 dark:text-slate-400">
              Estado de la Prueba
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[ESTADOS_PRUEBA.HECHO, ESTADOS_PRUEBA.EN_PROCESO, ESTADOS_PRUEBA.OBSERVAC, ESTADOS_PRUEBA.FALLO].map((estadoKey) => {
                const isSelected = selectedStatus === estadoKey;
                const ui = ESTADOS_UI[estadoKey];
                const Icon = ui.icon;
                
                return (
                  <button
                    key={estadoKey}
                    onClick={() => setSelectedStatus(estadoKey)}
                    className={`flex items-center gap-2 p-2 rounded-lg border text-sm font-semibold transition ${
                      isSelected 
                        ? `${ui.border} bg-slate-50 dark:bg-slate-800 ring-1 ring-inset ring-${ui.border.split('-')[1]}-500` 
                        : 'border-slate-200 bg-white text-slate-600 dark:bg-dark-bg dark:border-slate-700 dark:text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? ui.color.split(' ')[0].replace('bg-', 'text-') : 'text-slate-400'}`} />
                    {ui.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Textarea para notas */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 dark:text-slate-400">
              Observaciones
            </label>
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Detalla si hubo algún error, lentitud o duda..."
              className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-odoo-purple focus:border-odoo-purple outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-white"
              rows={3}
            />
          </div>

          {/* Botón Guardar */}
          <button 
            className="w-full bg-odoo-purple text-white font-bold py-3.5 rounded-xl shadow-md active:scale-[0.98] transition hover:bg-opacity-90 dark:bg-dark-emerald dark:text-slate-900"
            onClick={() => {
              console.log('Guardando...', { id: item.id_caso, estado: selectedStatus, observaciones });
              onClose();
            }}
          >
            Guardar Cambios
          </button>
        </div>

      </div>
    </>
  );
}