import { useState } from 'react';
import Navbar from './components/Navbar';
import FiltersBar from './components/FiltersBar';
import TestCaseCard from './components/TestCaseCard';
import Drawer from './components/Drawer';
import { ESTADOS_PRUEBA } from './utils/constants';

const mockItems = [
  {
    id_caso: 'COM-001',
    modulo: 'Compras',
    descripcion: 'Registrar compra con proveedor local validando impuestos.',
    estado: ESTADOS_PRUEBA.HECHO,
    porcentaje: 100,
    observaciones: ''
  },
  {
    id_caso: 'COM-002',
    modulo: 'Compras',
    descripcion: 'Carga de XML de factura externa con diferencias de centavos.',
    estado: ESTADOS_PRUEBA.OBSERVAC,
    porcentaje: 90,
    observaciones: 'El sistema redondeó mal 1 centavo.'
  },
  {
    id_caso: 'COM-003',
    modulo: 'Compras',
    descripcion: 'Aprobar orden de compra masiva superando límite de crédito.',
    estado: ESTADOS_PRUEBA.EN_PROCESO,
    porcentaje: 50,
    observaciones: ''
  },
  {
    id_caso: 'VEN-014',
    modulo: 'Ventas',
    descripcion: 'Cálculo de impuestos con cliente exento.',
    estado: ESTADOS_PRUEBA.FALLO,
    porcentaje: 0,
    observaciones: 'Mostró el IVA en la factura impresa.'
  }
];

function App() {
  const [activeModule, setActiveModule] = useState('Todos');
  const [activeFilter, setActiveFilter] = useState(ESTADOS_PRUEBA.TODOS);
  const [selectedItem, setSelectedItem] = useState(null);

  const mockModules = ['Todos', 'Compras', 'Ventas', 'POS', 'Inventario'];

  return (
    <div className="min-h-screen bg-slate-100 font-sans dark:bg-slate-900 pb-10">
      <Navbar progress={68} total={40} completed={28} />
      
      <FiltersBar 
        modulos={mockModules}
        selectedModule={activeModule}
        selectedState={activeFilter}
        onModuleChange={setActiveModule}
        onStateChange={setActiveFilter}
      />
      
      <main className="p-4 space-y-3">
          {mockItems.map((item) => (
            <TestCaseCard 
              key={item.id_caso} 
              item={item} 
              onClick={(clickedItem) => setSelectedItem(clickedItem)}
            />
          ))}
        </main>

      <Drawer 
        key={selectedItem ? selectedItem.id_caso : 'drawer-closed'} 
        isOpen={selectedItem !== null} 
        item={selectedItem} 
        onClose={() => setSelectedItem(null)} 
      />
    </div>
  );
}

export default App;