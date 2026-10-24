import { ChevronRight, AlertCircle } from 'lucide-react';
import { ESTADOS_PRUEBA, getEstadoUI } from '../utils/constants';

export default function TestCaseCard({ item, onClick }) {
  const currentStatus = getEstadoUI(item.estado || ESTADOS_PRUEBA.PENDIENTE);
  const StatusIcon = currentStatus.icon;

  const leftBorderColor = currentStatus.color.split(' ')[0];

  return (
    <div
      onClick={() => onClick?.(item)}
      className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm active:scale-[0.99] transition cursor-pointer dark:bg-dark-bg dark:border-slate-800 relative overflow-hidden"
    >
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${leftBorderColor}`} />

      <div className="flex justify-between items-start mb-2 pl-2">
        <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded dark:bg-slate-800 dark:text-slate-400">
          {item.id_caso}
        </span>
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1 ${currentStatus.color}`}>
          <StatusIcon className="w-3 h-3" />
          {currentStatus.label}
        </span>
      </div>

      <p className="text-sm font-medium text-slate-800 leading-snug mb-3 pl-2 dark:text-slate-200">
        {item.descripcion}
      </p>

      <div className="flex justify-between items-center text-xs text-slate-500 border-t border-slate-100 pt-3 mt-2 pl-2 dark:border-slate-800 dark:text-slate-400">
        <span className="truncate max-w-[140px] font-medium text-slate-600 dark:text-slate-400">
           {item.modulo}
        </span>
        
        <div className="flex items-center gap-2">
          {item.observaciones && (
            <span className="text-amber-600 font-medium flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded dark:bg-amber-900/30 dark:text-amber-400">
              <AlertCircle className="w-3 h-3" /> Nota
            </span>
          )}
          {/* MULTIPLICAMOS POR 100 PARA CORREGIR LA VISTA DE GOOGLE SHEETS */}
          <span className="font-bold text-slate-700 dark:text-slate-300">
            {item.porcentaje}%
          </span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>
      </div>
    </div>
  );
}