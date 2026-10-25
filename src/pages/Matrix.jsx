import { useSearchParams } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import FiltersBar from '../components/FiltersBar';
import TestCaseCard from '../components/TestCaseCard';
import Drawer from '../components/Drawer';
import { ESTADOS_PRUEBA } from '../utils/constants';
import { apiService } from '../services/api';
import { ChevronLeft, ChevronRight } from 'lucide-react'; 

function Matrix() {
  const [activeModule, setActiveModule] = useState('Todos');
  const [activeFilter, setActiveFilter] = useState('TODOS');
  const [selectedItem, setSelectedItem] = useState(null);

  const [items, setItems] = useState([]);
  const [modulos, setModulos] = useState(['Todos']);
  const [estadosFiltro, setEstadosFiltro] = useState(['TODOS']);
  const [metrics, setMetrics] = useState({ total: 0, completed: 0, progress: 0 });
  const [isLoading, setIsLoading] = useState(true);
  
  const [tituloApp, setTituloApp] = useState('Cargando...');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 15;

  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');

  const applyData = useCallback((data) => {
    if (data.title) setTituloApp(data.title);

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
      ESTADOS_PRUEBA.PENDIENTE,
      ESTADOS_PRUEBA.EXITO,
      ESTADOS_PRUEBA.EN_PROCESO,
      ESTADOS_PRUEBA.OBSERVACIONES,
      ESTADOS_PRUEBA.FALLIDO,
      ESTADOS_PRUEBA.NO_APLICA
    ];
    const estadosDelExcel = correctedItems.map(item => item.estado).filter(Boolean);

    const combinedStates = ['TODOS', ESTADOS_PRUEBA.PENDIENTE, ...estadosBase, ...estadosDelExcel];
    setEstadosFiltro([...new Set(combinedStates)]);
  }, []);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getTestCases(projectId);
      if (data.status === 'success') applyData(data);
    } catch (error) {
      console.error("Error cargando los datos", error);
      alert("Hubo un error al conectar con Google Sheets.");
    } finally {
      setIsLoading(false);
    }
  };

  // 1. Carga inicial
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        const data = await apiService.getTestCases(projectId);
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
  }, [projectId, applyData]);

  // 2. NUEVO: Polling (Actualización silenciosa automática)
  useEffect(() => {
    if (!projectId) return;
    
    const intervalId = setInterval(async () => {
      try {
        // Petición silenciosa (sin activar setIsLoading)
        const data = await apiService.getTestCases(projectId);
        if (data.status === 'success') {
          applyData(data); // Si hay cambios, React actualizará solo lo necesario
        }
      } catch (error) {
        console.error("Error en la actualización automática (polling)", error);
      }
    }, 15000); // Se ejecuta cada 15 segundos

    return () => clearInterval(intervalId); // Limpieza al salir del componente
  }, [projectId, applyData]);

  // Al cambiar de filtro, regresamos a la página 1
  const handleModuleChange = (mod) => {
    setActiveModule(mod);
    setCurrentPage(1); 
  };

  const handleFilterChange = (filtro) => {
    setActiveFilter(filtro);
    setCurrentPage(1);
  };

  const filteredItems = items.filter(item => {
    const matchesModule = activeModule === 'Todos' || item.modulo === activeModule;
    const matchesFilter = activeFilter === 'TODOS' || item.estado === activeFilter;
    return matchesModule && matchesFilter;
  });

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const currentItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-slate-100 font-sans dark:bg-slate-900 pb-10">
      <div className="max-w-md mx-auto bg-slate-100 dark:bg-slate-900 min-h-screen shadow-2xl relative">
        <Navbar 
          title={tituloApp} 
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
              {/* 15 registros de la página actual */}
              {currentItems.map((item) => (
                <TestCaseCard 
                  key={item.id_caso} 
                  item={item} 
                  onClick={(clickedItem) => setSelectedItem(clickedItem)}
                />
              ))}

              {/* Controles de Paginación */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <button 
                    onClick={() => {
                      setCurrentPage(prev => Math.max(prev - 1, 1));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 transition active:scale-95"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    Página {currentPage} de {totalPages}
                  </span>
                  
                  <button 
                    onClick={() => {
                      setCurrentPage(prev => Math.min(prev + 1, totalPages));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 transition active:scale-95"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
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
        projectId={projectId}
        estadosDisponibles={estadosFiltro.filter(e => e !== 'TODOS')}
        onClose={() => {
          setSelectedItem(null);
          handleRefresh(); 
        }} 
      />
    </div>
  );
}

export default Matrix;