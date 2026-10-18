import { useState } from 'react';
import Navbar from './components/Navbar';
import FiltersBar from './components/FiltersBar';

function App() {
  const [activeModule, setActiveModule] = useState('Todos');
  const [activeFilter, setActiveFilter] = useState('TODOS');

  const mockModules = ['Todos', 'Contactos & CRM', 'Inventario', 'Ventas', 'POS'];

  return (
    <div className="min-h-screen bg-slate-100 font-sans dark:bg-slate-900">
      <Navbar progress={42} total={189} completed={80} />
      
      <FiltersBar 
        modulos={mockModules}
        selectedModule={activeModule}
        selectedState={activeFilter}
        onModuleChange={setActiveModule}
        onStateChange={setActiveFilter}
      />
      
      <main className="p-4">
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 text-center">
          
        </p>
      </main>
    </div>
  );
}

export default App;