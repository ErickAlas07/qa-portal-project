import { ESTADOS_UI } from '../utils/constants';

const SCRIPT_URL = import.meta.env.VITE_GAS_URL;

export const apiService = {
  /**
   * Obtiene la lista completa de casos de prueba desde Google Sheets
   */
  async getTestCases() {
    try {
      const response = await fetch(SCRIPT_URL);
      if (!response.ok) throw new Error('Error de red al conectar con Apps Script');
      
      const data = await response.json();
      return data; // Retornará { status, summary, items, ... }
    } catch (error) {
      console.error('Error fetching test cases:', error);
      throw error; 
    }
  },

  /**
   * Envía la actualización de un caso de prueba
   */
  async updateTestCase(id_caso, estado, observaciones) {
    try {
      // Obtenemos el porcentaje automático según el estado que eligió el usuario
      const porcentajeAutomatico = ESTADOS_UI[estado]?.porcentaje || 0;

      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8', 
        },
        // Estructura exacta que espera tu doPost (action: "updateItem" + payload)
        body: JSON.stringify({
          action: 'updateItem',
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
  }
};