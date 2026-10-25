import { RefreshCw } from 'lucide-react';

export default function Navbar({ title, progress = 0, total = 0, completed = 0, onRefresh }) {
  return (
    <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-4 py-3 shadow-sm dark:bg-dark-bg dark:border-slate-800">
      <div className="flex justify-between items-center mb-2">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-odoo-purple bg-purple-50 px-2 py-0.5 rounded dark:bg-purple-900/30 dark:text-purple-300">
            {/* Título de la aplicación */}
            {title}
          </span>
          <h1 className="text-sm font-bold text-slate-900 mt-0.5 dark:text-white">Matriz de Pruebas y Capacitación</h1>
        </div>
        <button 
          onClick={onRefresh}
          className="p-2 text-slate-500 hover:text-odoo-purple rounded-full hover:bg-slate-50 transition dark:hover:bg-slate-800 dark:hover:text-dark-emerald"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Barra de progreso global */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs font-semibold">
          <span className="dark:text-slate-300">Progreso Global</span>
          <span className="text-odoo-purple dark:text-dark-emerald">{progress}%</span>
        </div>
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden dark:bg-slate-700">
          <div 
            className="bg-odoo-purple h-full transition-all duration-300 rounded-full dark:bg-dark-emerald"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-slate-500 pt-0.5 dark:text-slate-400">
          <span>{total} Casos totales</span>
          <span>{completed} Completados</span>
        </div>
      </div>
    </header>
  );
}