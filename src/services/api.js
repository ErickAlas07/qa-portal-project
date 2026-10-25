import { ESTADOS_UI } from '../utils/constants';

const SCRIPT_URL = import.meta.env.VITE_GAS_URL;

export const apiService = {
  /**
   * Obtiene la lista de proyectos desde el "Master Hub"
   */
  async getProjects() {
    try {
      const response = await fetch(`${SCRIPT_URL}?action=getProjects`);
      if (!response.ok) throw new Error('Error de red al conectar con Apps Script');
      
      const data = await response.json();
      return data; // Retornará { status, items }
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },

  /**
   * Obtiene la lista de carpetas de Drive
   */
  async getFolders() {
    try {
      const response = await fetch(`${SCRIPT_URL}?action=getFolders`);
      if (!response.ok) throw new Error('Error de red al conectar con Apps Script');
      
      const data = await response.json();
      return data; 
    } catch (error) {
      console.error('Error fetching folders:', error);
      throw error;
    }
  },

  /**
   *  Pide la matriz de un proyecto específico
   */
  async getTestCases(projectId) {
    try {
      const response = await fetch(`${SCRIPT_URL}?action=getMatrix&projectId=${projectId}`);
      if (!response.ok) throw new Error('Error de red al conectar con Apps Script');
      
      const data = await response.json();
      return data; 
    } catch (error) {
      console.error('Error fetching test cases:', error);
      throw error; 
    }
  },

  /**
   * NUEVO: Crea un proyecto duplicando la plantilla
   */
  async createProject(nombre, descripcion, miembros, folderId) {
    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          action: 'createProject',
          payload: {
            nombre,
            descripcion,
            miembros: Number(miembros) || 0,
            folderId: folderId || null
          }
        })
      });
      const result = await response.json();
      if (result.status === 'error') throw new Error(result.message);
      return result;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },

  /**
   * Envía el ID del proyecto junto con los datos a actualizar
   */
  async updateTestCase(projectId, id_caso, estado, observaciones) {
    try {
      const porcentajeAutomatico = ESTADOS_UI[estado]?.porcentaje || 0;

      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8', 
        },
        body: JSON.stringify({
          action: 'updateItem',
          projectId: projectId, 
          payload: {
            id_caso,
            estado,
            porcentaje: porcentajeAutomatico,
            observaciones
          }
        })
      });

      const result = await response.json();
      if (result.status === 'error') throw new Error(result.message);
      
      return result;
    } catch (error) {
      console.error('Error updating test case:', error);
      throw error;
    }
  },

  /**
   * NUEVO: Crea un caso de prueba en la matriz
   */
  async createTestCase(projectId, id_caso, modulo, descripcion) {
    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'createTestCase',
          projectId: projectId,
          payload: { id_caso, modulo, descripcion }
        })
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating test case:', error);
      throw error;
    }
  },

  /**
   * NUEVO: Edita la información base de un caso de prueba
   */
  async editTestCase(projectId, id_caso_original, id_caso_nuevo, modulo, descripcion) {
    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'editTestCase',
          projectId: projectId,
          payload: { id_caso_original, id_caso_nuevo, modulo, descripcion }
        })
      });
      return await response.json();
    } catch (error) {
      console.error('Error editing test case:', error);
      throw error;
    }
  },

  /**
   * NUEVO: Elimina un caso de prueba de la matriz
   */
  async deleteTestCase(projectId, id_caso) {
    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'deleteTestCase',
          projectId: projectId,
          id_caso: id_caso
        })
      });
      return await response.json();
    } catch (error) {
      console.error('Error deleting test case:', error);
      throw error;
    }
  }
};