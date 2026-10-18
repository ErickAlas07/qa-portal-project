import { CheckCircle2, Clock, AlertCircle, XCircle, HelpCircle } from 'lucide-react';

// Enumeración de estados de prueba
export const ESTADOS_PRUEBA = {
  TODOS: 'TODOS',
  HECHO: 'HECHO',
  EN_PROCESO: 'EN_PROCESO',
  OBSERVAC: 'OBSERVAC',
  FALLO: 'FALLO',
  PENDIENTE: 'PENDIENTE',
  NO_APLICA: 'N/A'
};

// Mapeo de estados a UI (etiqueta, porcentaje, color, icono)
export const ESTADOS_UI = {
  [ESTADOS_PRUEBA.HECHO]:      { label: 'Hecho',         porcentaje: 100, color: 'bg-emerald-500 text-white', border: 'border-emerald-500', icon: CheckCircle2 },
  [ESTADOS_PRUEBA.EN_PROCESO]: { label: 'En proceso',    porcentaje: 50,  color: 'bg-blue-500 text-white',    border: 'border-blue-500',    icon: Clock },
  [ESTADOS_PRUEBA.OBSERVAC]:   { label: 'Observaciones', porcentaje: 90,  color: 'bg-amber-500 text-white',   border: 'border-amber-500',   icon: AlertCircle },
  [ESTADOS_PRUEBA.FALLO]:      { label: 'Fallo',         porcentaje: 0,   color: 'bg-rose-500 text-white',    border: 'border-rose-500',    icon: XCircle },
  [ESTADOS_PRUEBA.PENDIENTE]:  { label: 'Pendiente',     porcentaje: 0,   color: 'bg-slate-200 text-slate-700',border: 'border-slate-300',  icon: HelpCircle },
  [ESTADOS_PRUEBA.NO_APLICA]:  { label: 'N/A',           porcentaje: 0,   color: 'bg-gray-300 text-gray-700', border: 'border-gray-400',    icon: XCircle }
};