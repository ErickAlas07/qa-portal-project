import { useNavigate } from 'react-router-dom';
import { Eye, LayoutGrid } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/dashboard'); 
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white/50 border border-slate-200 rounded-2xl p-8 w-full max-w-sm shadow-sm">
        
        {/* Header del Login */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-[#5c3e58] p-3 rounded-lg mb-4">
            <LayoutGrid className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Odoo Matrix Portal</h1>
          <p className="text-sm text-slate-500 mt-1">QA & Training Matrix Synchronization</p>
        </div>

        {/* Botón de Google */}
        <button className="w-full flex items-center justify-center gap-2 bg-slate-100/50 border border-slate-300 text-slate-700 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-100 transition mb-6">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
          Sign in with Google Workspace
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="h-px bg-slate-200 flex-1"></div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">or continue with credentials</span>
          <div className="h-px bg-slate-200 flex-1"></div>
        </div>

        {/* Formulario Tradicional */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Correo Electrónico / Usuario</label>
            <input 
              type="email" 
              placeholder="usuario@odoo.com" 
              className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5c3e58]/50"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Token de Acceso / Contraseña</label>
            <div className="relative">
              <input 
                type="password" 
                defaultValue="password123" 
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5c3e58]/50"
              />
              <Eye className="absolute right-3 top-2.5 w-5 h-5 text-slate-400" />
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" className="rounded border-slate-300 text-[#5c3e58] focus:ring-[#5c3e58]" />
              Recordar sesión
            </label>
            <button type="button" className="text-sm font-semibold text-[#5c3e58]">Olvidé mi contraseña</button>
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#5c3e58] hover:bg-[#4a3247] text-white font-bold py-3 rounded-xl transition shadow-md active:scale-[0.98]"
          >
            Iniciar Sesión
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs font-bold text-slate-600">RBAC Protected · Manager & Implementer Access</p>
          <p className="text-xs text-slate-400 mt-1">v1.0.0 MVP</p>
        </div>
      </div>
    </div>
  );
}