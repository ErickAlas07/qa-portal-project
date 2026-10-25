import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { apiService } from '../services/api';

export default function CaseFormModal({ mode, item, modulos, existingIds, projectId, onClose, onSaved }) {
  const isEdit = mode === 'edit';

  const [form, setForm] = useState({
    id_caso: item?.id_caso || '',
    modulo: item?.modulo || '',
    descripcion: item?.descripcion || '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.modulo) {
        setError('Selecciona un módulo.');
        return;
    }
    const id = form.id_caso.trim();
    const idChanged = !isEdit || id !== item.id_caso;

    if (idChanged && existingIds.includes(id)) {
      setError(`El ID "${id}" ya existe en esta matriz.`);
      return;
    }

    setIsSaving(true);
    setError('');
    try {
      const result = isEdit
        ? await apiService.editTestCase(projectId, item.id_caso, id, form.modulo.trim(), form.descripcion.trim())
        : await apiService.createTestCase(projectId, id, form.modulo.trim(), form.descripcion.trim());

      if (result.status === 'error') throw new Error(result.message);
      if (!isEdit && result.id_caso && result.id_caso !== id) {
        alert(`Se usó un espacio libre de la plantilla: el caso quedó como ${result.id_caso}.`);
      }
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass =
    'w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-[#5c3e58] focus:ring-1 focus:ring-[#5c3e58] transition dark:bg-slate-900 dark:border-slate-700 dark:text-white';
  const labelClass = 'block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5';

  return (
    <div className="fixed inset-0 bg-slate-900/50 z-[60] backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
        <div className="flex justify-between items-center px-4 py-3 border-b border-slate-100 dark:border-slate-700">
          <h2 className="text-base font-bold text-slate-800 dark:text-white">
            {isEdit ? 'Editar Caso de Prueba' : 'Nuevo Caso de Prueba'}
          </h2>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className={labelClass}>ID del Caso</label>
            <input
              required
              type="text"
              value={form.id_caso}
              onChange={(e) => setForm({ ...form, id_caso: e.target.value })}
              placeholder="Ej. CP-045"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Módulo</label>
            {isEdit ? (
                <div className={`${inputClass} opacity-60`}>{form.modulo}</div>
            ) : (
                <div className="flex flex-wrap gap-2">
                {modulos.map((m) => (
                    <button
                    key={m}
                    type="button"
                    onClick={() => setForm({ ...form, modulo: m })}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold border transition ${
                        form.modulo === m
                        ? 'bg-indigo-100 text-[#5c3e58] border-indigo-300 ring-1 ring-indigo-200'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                    >
                    {m}
                    </button>
                ))}
                </div>
            )}
          </div>

          <div>
            <label className={labelClass}>Descripción</label>
            <textarea
              required
              rows={3}
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              placeholder="¿Qué se debe probar?"
              className={inputClass}
            />
          </div>

          {error && <p className="text-sm font-medium text-rose-600">{error}</p>}

          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-[#5c3e58] hover:bg-[#4a3247] text-white font-bold py-3.5 rounded-xl shadow-md transition active:scale-[0.98] disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSaving ? 'Guardando...' : isEdit ? 'Guardar Cambios' : 'Crear Caso'}
          </button>
        </form>
      </div>
    </div>
  );
}