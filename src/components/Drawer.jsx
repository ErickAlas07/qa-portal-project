import { useState } from 'react';
import { X, Pencil, Trash2 } from 'lucide-react';
import { ESTADOS_PRUEBA, getEstadoUI } from '../utils/constants';
import { apiService } from '../services/api';

export default function Drawer({ isOpen, onClose, onEdit, item, estadosDisponibles = [], projectId }) {
  const [selectedStatus, setSelectedStatus] = useState(item?.estado || ESTADOS_PRUEBA.PENDIENTE);
  const [observaciones, setObservaciones] = useState(item?.observaciones || '');
  const [isSaving, setIsSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !item) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await apiService.updateTestCase(projectId, item.id_caso, selectedStatus, observaciones);
      onClose();
    } catch (error) {
      alert('Error al guardar: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await apiService.deleteTestCase(projectId, item.id_caso);
      if (result.status === 'error') throw new Error(result.message);
      onClose();
    } catch (error) {
      alert('Error al vaciar: ' + error.message);
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-900/40 z-40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl pb-safe dark:bg-dark-bg border-t border-slate-200 dark:border-slate-800 animate-[slide-up_0.3s_ease-out]">
        <div className="w-full flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 bg-slate-300 rounded-full dark:bg-slate-700" />
        </div>

        <div className="flex justify-between items-center px-4 py-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs font-mono font-bold text-slate-500">{item.id_caso}</span>
            <h2 className="text-base font-bold text-slate-800 dark:text-white leading-tight">Ejecutar Prueba</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(item)}
              title="Editar caso"
              className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
            >
              <Pencil className="w-5 h-5" />
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              title="Vaciar caso"
              className="p-2 bg-rose-50 rounded-full text-rose-500 hover:bg-rose-100 dark:bg-slate-800"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-5 overflow-y-auto max-h-[70vh]">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 dark:bg-slate-800/50 dark:border-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300">
            {item.descripcion}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 dark:text-slate-400">
              Estado de la Prueba
            </label>
            <div className="grid grid-cols-2 gap-2">
              {estadosDisponibles.map((estadoKey) => {
                const isSelected = selectedStatus === estadoKey;
                const ui = getEstadoUI(estadoKey);
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

          {confirmDelete ? (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 space-y-3 dark:bg-rose-950/30 dark:border-rose-900">
              <p className="text-sm font-semibold text-rose-700 dark:text-rose-300">
                ¿Vaciar {item.id_caso}? Se limpiarán la descripción, el estado y las observaciones. El ID se conserva y quedará libre para reutilizarse.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setConfirmDelete(false)}
                  disabled={isDeleting}
                  className="py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 font-bold text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="py-2.5 rounded-lg bg-rose-600 text-white font-bold text-sm disabled:bg-rose-300"
                >
                  {isDeleting ? 'Vaciando...' : 'Sí, vaciar'}
                </button>
              </div>
            </div>
          ) : (
            <button
              disabled={isSaving}
              className={`w-full font-bold py-3.5 rounded-xl shadow-md transition ${
                isSaving
                  ? 'bg-slate-400 text-slate-200 cursor-not-allowed dark:bg-slate-700'
                  : 'bg-odoo-purple text-white active:scale-[0.98] hover:bg-opacity-90 dark:bg-dark-emerald dark:text-slate-900'
              }`}
              onClick={handleSave}
            >
              {isSaving ? 'Guardando en Sheets...' : 'Guardar Cambios'}
            </button>
          )}
        </div>
      </div>
    </>
  );
}