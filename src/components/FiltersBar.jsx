import { Filter } from 'lucide-react';
import { getEstadoUI } from '../utils/constants';

export default function FiltersBar({ 
  modulos = ['Todos'], 
  estados = [], 
  selectedModule = 'Todos', 
  selectedState = 'TODOS', 
  onModuleChange, 
  onStateChange 
}) {
  return (
    <div className="bg-white border-b border-slate-200 dark:bg-dark-bg dark:border-slate-800 sticky top-[72px] z-10">
      
      {/* Tabs Horizontales por Módulo */}
      <div className="flex space-x-2 overflow-x-auto px-4 pt-3 pb-2 no-scrollbar">
        {modulos.map(mod => (
          <button
            key={mod}
            onClick={() => onModuleChange?.(mod)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
              selectedModule === mod 
                ? 'bg-slate-900 text-white shadow-sm dark:bg-dark-emerald dark:text-slate-900' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            {mod}
          </button>
        ))}
      </div>

      {/* Chips de Filtros de Estado dinámicos */}
      <div className="flex items-center space-x-2 overflow-x-auto px-4 py-2 text-xs no-scrollbar">
        <Filter className="w-4 h-4 text-slate-400 shrink-0" />
        {estados.map(estadoKey => {
          // Extraemos la etiqueta limpia del mapeo o el comodín
          const label = estadoKey === 'TODOS' ? 'Ver Todos' : getEstadoUI(estadoKey).label.toUpperCase();
          
          return (
            <button
              key={estadoKey}
              onClick={() => onStateChange?.(estadoKey)}
              className={`px-2.5 py-1 rounded-md font-medium shrink-0 transition ${
                selectedState === estadoKey 
                  ? 'bg-purple-100 text-odoo-purple border border-purple-300 dark:bg-purple-900/30 dark:border-purple-700 dark:text-purple-300' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 dark:bg-dark-bg dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
      
    </div>
  );
}
