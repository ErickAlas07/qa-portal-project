import { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import FiltersBar from './components/FiltersBar';
import TestCaseCard from './components/TestCaseCard';
import Drawer from './components/Drawer';
import { ESTADOS_PRUEBA } from './utils/constants';
import { apiService } from './services/api';

function App() {
  const [activeModule, setActiveModule] = useState('Todos');
  const [activeFilter, setActiveFilter] = useState('TODOS');
  const [selectedItem, setSelectedItem] = useState(null);

  const [items, setItems] = useState([]);
  const [modulos, setModulos] = useState(['Todos']);
  const [estadosFiltro, setEstadosFiltro] = useState(['TODOS']);
  const [metrics, setMetrics] = useState({ total: 0, completed: 0, progress: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(15);

  // Procesa la respuesta de la API y actualiza el estado.
  // Los setters de useState son estables, por eso las dependencias van vacías.
  const applyData = useCallback((data) => {
    // La conversión de 0-1 a 0-100 se hace SOLO aquí.
    // Los componentes (TestCaseCard, Drawer) ya reciben el valor en 0-100.
    const correctedItems = data.items.map(item => ({
      ...item,
      porcentaje: Math.round((item.porcentaje || 0) * 100)
    }));

    setItems(correctedItems);
    setMetrics({
      total: data.summary.total,
      completed: data.summary.completed,
      progress: Math.round((data.summary.avgProgress || 0) * 100)
    });

    const uniqueModules = ['Todos', ...new Set(correctedItems.map(item => item.modulo).filter(Boolean))];
    setModulos(uniqueModules);

    const estadosBase = [
      ESTADOS_PRUEBA.EXITO,
      ESTADOS_PRUEBA.EN_PROCESO,
      ESTADOS_PRUEBA.OBSERVACIONES,
      ESTADOS_PRUEBA.FALLIDO
    ];
    const estadosDelExcel = correctedItems.map(item => item.estado).filter(Boolean);

    const combinedStates = ['TODOS', ESTADOS_PRUEBA.PENDIENTE, ...estadosBase, ...estadosDelExcel];
    setEstadosFiltro([...new Set(combinedStates)]);
  }, []);

  // Carga de datos disparada por el usuario (botón Refrescar o al cerrar el Drawer)
  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getTestCases();
      if (data.status === 'success') applyData(data);
    } catch (error) {
      console.error("Error cargando los datos", error);
      alert("Hubo un error al conectar con Google Sheets.");
    } finally {
      setIsLoading(false);
    }
  };

  // Carga inicial: la lógica vive dentro del efecto, con bandera de cancelación
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        const data = await apiService.getTestCases();
        if (cancelled) return;
        if (data.status === 'success') applyData(data);
      } catch (error) {
        if (cancelled) return;
        console.error("Error cargando los datos", error);
        alert("Hubo un error al conectar con Google Sheets.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    init();

    return () => {
      cancelled = true;
    };
  }, [applyData]);

  const handleModuleChange = (mod) => {
    setActiveModule(mod);
    setVisibleCount(15);
  };

  const handleFilterChange = (filtro) => {
    setActiveFilter(filtro);
    setVisibleCount(15);
  };

  const filteredItems = items.filter(item => {
    const matchesModule = activeModule === 'Todos' || item.modulo === activeModule;
    const matchesFilter = activeFilter === 'TODOS' || item.estado === activeFilter;
    return matchesModule && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-slate-100 font-sans dark:bg-slate-900 pb-10">
      <div className="max-w-md mx-auto bg-slate-100 dark:bg-slate-900 min-h-screen shadow-2xl relative">
        <Navbar 
          progress={metrics.progress} 
          total={metrics.total} 
          completed={metrics.completed} 
          onRefresh={handleRefresh} 
        />
        
        <FiltersBar 
          modulos={modulos}
          estados={estadosFiltro}
          selectedModule={activeModule}
          selectedState={activeFilter}
          onModuleChange={handleModuleChange}
          onStateChange={handleFilterChange}
        />
        
        <main className="p-4 space-y-3">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center pt-20 text-odoo-purple dark:text-dark-emerald animate-pulse">
              <span className="font-bold text-sm">Cargando matriz de pruebas...</span>
            </div>
          ) : filteredItems.length > 0 ? (
            <>
              {filteredItems.slice(0, visibleCount).map((item) => (
                <TestCaseCard 
                  key={item.id_caso} 
                  item={item} 
                  onClick={(clickedItem) => setSelectedItem(clickedItem)}
                />
              ))}

              {visibleCount < filteredItems.length && (
                <button 
                  onClick={() => setVisibleCount(prev => prev + 15)}
                  className="w-full py-3 mt-4 text-sm font-bold text-slate-500 bg-slate-200 rounded-xl hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 transition"
                >
                  Cargar más casos ({filteredItems.length - visibleCount} restantes)
                </button>
              )}
            </>
          ) : (
            <p className="text-center text-slate-500 mt-10 text-sm font-medium">No hay casos para estos filtros.</p>
          )}
        </main>
      </div>

      <Drawer 
        key={selectedItem ? selectedItem.id_caso : 'drawer-closed'} 
        isOpen={selectedItem !== null} 
        item={selectedItem} 
        estadosDisponibles={estadosFiltro.filter(e => e !== 'TODOS' && e !== ESTADOS_PRUEBA.PENDIENTE)}
        onClose={() => {
          setSelectedItem(null);
          handleRefresh(); 
        }} 
      />
    </div>
  );
}

export default App;