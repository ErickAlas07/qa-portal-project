import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, FileText, CheckSquare, Bell, Home, ClipboardList, GraduationCap, User, Bug, Plus, X, Folder, Loader2 } from 'lucide-react';
import { apiService } from '../services/api';

// CREDENCIALES GOOGLE CLOUD
const CLIENT_ID = '243141768455-9gp9nrkoipt6ck3vjeb5sr1gf1knnaou.apps.googleusercontent.com';
const API_KEY = 'AIzaSyBytq6IbcPKO0lQLDhafOfpjJpoEPHRtyA';
const APP_ID = '243141768455'; // Número de proyecto

export default function Dashboard() {
  const navigate = useNavigate();
  const [proyectos, setProyectos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados del Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  // Añadimos folderName para mostrar visualmente la carpeta seleccionada
  const [newProject, setNewProject] = useState({ nombre: '', descripcion: '', miembros: '', folderId: '', folderName: '' });
  const [reloadKey, setReloadKey] = useState(0);

  // Inicializar GAPI para el Google Picker
  useEffect(() => {
    if (window.gapi) {
      window.gapi.load('picker', () => console.log('Google Picker cargado'));
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const fetchProjects = async () => {
      try {
        const data = await apiService.getProjects();
        if (cancelled) return;
        if (data.status === 'success') {
          setProyectos(data.items);
        } else {
          alert("Error desde Apps Script: " + data.message);
        }
      } catch (error) {
        console.error("Error cargando proyectos", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchProjects();
    return () => { cancelled = true; };
  }, [reloadKey]);

  const handleOpenMatrix = (projectId) => {
    navigate(`/matrix?projectId=${projectId}`);
  };

  // Función para detonar el Picker nativo de Google Drive
  const handleOpenPicker = () => {
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/drive.readonly',
      callback: (tokenResponse) => {
        if (tokenResponse && tokenResponse.access_token) {
          createPicker(tokenResponse.access_token);
        }
      }
    });
    tokenClient.requestAccessToken();
  };

  const createPicker = (accessToken) => {
    const view = new window.google.picker.DocsView(window.google.picker.ViewId.FOLDERS)
      .setSelectFolderEnabled(true)
      .setMimeTypes('application/vnd.google-apps.folder');

    const picker = new window.google.picker.PickerBuilder()
      .addView(view)
      .setOAuthToken(accessToken)
      .setDeveloperKey(API_KEY)
      .setAppId(APP_ID)
      .setCallback((data) => {
        if (data.action === window.google.picker.Action.PICKED) {
          const folder = data.docs[0];
          setNewProject({ ...newProject, folderId: folder.id, folderName: folder.name });
        }
      })
      .build();
      
    picker.setVisible(true);
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      await apiService.createProject(newProject.nombre, newProject.descripcion, newProject.miembros, newProject.folderId);
      setIsModalOpen(false);
      setNewProject({ nombre: '', descripcion: '', miembros: '', folderId: '', folderName: '' });
      setIsLoading(true);
      setReloadKey((k) => k + 1);
    } catch (error) {
      alert("Error al crear el proyecto. Revisa la consola. " + error.message);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <div className="max-w-md mx-auto bg-slate-50 min-h-screen relative">
        <header className="flex items-center justify-between p-5 bg-white border-b border-slate-200 sticky top-0 z-10">
          <h1 className="text-xl font-extrabold text-[#5c3e58] leading-tight">Odoo QA<br/>Portal</h1>
          <div className="flex items-center gap-3">
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full text-center leading-tight">Manager /<br/>Admin</span>
            <Bell className="w-6 h-6 text-slate-600" />
            <div className="w-10 h-10 rounded-full bg-slate-300 border-2 border-white shadow-sm overflow-hidden">
              <img src="https://i.pravatar.cc/150?img=47" alt="Profile" className="w-full h-full object-cover"/>
            </div>
          </div>
        </header>

        <main className="p-4 space-y-4">
          {/* Tarjetas de Resumen Omitidas por brevedad (mantén tu código) */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
            <TrendingUp className="absolute top-4 right-4 w-6 h-6 text-[#5c3e58]" />
            <h2 className="text-xs font-bold text-slate-500 tracking-wider mb-1">TOTAL PROGRESS</h2>
            <p className="text-3xl font-extrabold text-[#5c3e58] mb-4">85%</p>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div className="bg-[#5c3e58] h-full w-[85%] rounded-full" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm relative">
              <FileText className="absolute top-4 right-4 w-5 h-5 text-slate-400" />
              <h2 className="text-xs font-bold text-slate-500 tracking-wider mb-1">ACTIVE SHEETS</h2>
              <p className="text-2xl font-extrabold text-slate-900">{proyectos.length} <span className="text-sm font-normal text-slate-500">sheets</span></p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm relative">
              <CheckSquare className="absolute top-4 right-4 w-5 h-5 text-slate-400" />
              <h2 className="text-xs font-bold text-slate-500 tracking-wider mb-1">TEST CASES</h2>
              <p className="text-2xl font-extrabold text-slate-900">- <span className="text-sm font-normal text-slate-500">total</span></p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-8 mb-4">
            <h2 className="text-lg font-bold text-slate-900">Active Projects</h2>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#5c3e58] hover:bg-[#4a3247] text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition shadow-sm"
            >
              <Plus className="w-4 h-4" /> Nuevo
            </button>
          </div>

          {isLoading ? (
            <p className="text-center text-slate-500 animate-pulse text-sm">Cargando proyectos...</p>
          ) : (
            proyectos.map((proyecto) => (
              <div key={proyecto.id_proyecto} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-4">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-xl shrink-0"></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900">{proyecto.nombre}</h3>
                      <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase">{proyecto.estado}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{proyecto.descripcion}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs font-medium text-slate-500">
                      <span> {proyecto.issues} Open Issues</span>
                      <span>•</span>
                      <span> {proyecto.miembros} Members</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <button 
                    onClick={() => handleOpenMatrix(proyecto.id_proyecto)}
                    className="w-full bg-[#7a5b74] hover:bg-[#5c3e58] text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition"
                  >
                    <Bug className="w-4 h-4" /> Fase de Pruebas
                  </button>
                  <button className="w-full bg-slate-50 border border-slate-200 text-slate-700 font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-100 transition">
                    <GraduationCap className="w-4 h-4" /> Fase de Capacitación
                  </button>
                </div>
              </div>
            ))
          )}
        </main>
        
        {/* Modal de Creación */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 z-50 backdrop-blur-sm transition-opacity flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
              <div className="flex justify-between items-center px-4 py-3 border-b border-slate-100">
                <h2 className="text-base font-bold text-slate-800">Crear Nuevo Proyecto</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleCreateProject} className="p-5 space-y-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nombre del Proyecto</label>
                    <input 
                    required
                    type="text" 
                    value={newProject.nombre}
                    onChange={(e) => setNewProject({...newProject, nombre: e.target.value})}
                    placeholder="Ej. Proyecto Retail X" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-[#5c3e58] focus:ring-1 focus:ring-[#5c3e58] transition" 
                    />
                </div>
                
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Descripción</label>
                    <input 
                    required
                    type="text" 
                    value={newProject.descripcion}
                    onChange={(e) => setNewProject({...newProject, descripcion: e.target.value})}
                    placeholder="Ej. Implementación ERP" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-[#5c3e58] focus:ring-1 focus:ring-[#5c3e58] transition" 
                    />
                </div>

                {/* BOTÓN GOOGLE PICKER */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Ubicación (Drive)</label>
                    <button 
                      type="button" 
                      onClick={handleOpenPicker}
                      className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl p-3 text-sm flex items-center justify-between transition group"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <Folder className={`w-4 h-4 shrink-0 ${newProject.folderId ? 'text-[#5c3e58] fill-[#5c3e58]/20' : 'text-slate-400'}`} />
                        <span className={`truncate font-medium ${newProject.folderId ? 'text-slate-700' : 'text-slate-400'}`}>
                          {newProject.folderId ? newProject.folderName : 'Seleccionar Carpeta...'}
                        </span>
                      </div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 group-hover:text-slate-600">Cambiar</span>
                    </button>
                </div>

                <button 
                    type="submit" 
                    disabled={isCreating || !newProject.folderId}
                    className="w-full mt-2 bg-[#5c3e58] hover:bg-[#4a3247] text-white font-bold py-3.5 rounded-xl shadow-md transition active:scale-[0.98] disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isCreating && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isCreating ? 'Generando Plantilla...' : 'Crear Proyecto'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}