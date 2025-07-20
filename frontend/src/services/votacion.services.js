
import axios from './root.services.js';

export const votacionService = {
  // Obtener todas las votaciones
  obtenerVotaciones: async () => {
    try {
      const response = await axios.get('/votacion');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.mensaje || 'Error al obtener votacion');
    }
  },

  // Crear nueva votación 
  crearVotacion: async (titulo, opciones) => {
    try {
      const response = await axios.post('/votacion', {
        titulo,
        opciones // Array de strings con las opciones
      });
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.errors?.[0] || 'Error desconocido';
      // Opcional: loguearlo
      throw new Error(msg);

    }
  },

  // Obtener votación por ID
  obtenerVotacionPorId: async (id) => {
    try {
      const response = await axios.get(`/votacion/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.mensaje || 'Error al obtener votación');
    }
  },

  // Cerrar votación
  cerrarVotacion: async (votacionId) => {
    try {
      const response = await axios.patch(`/votacion/${votacionId}/cerrar`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.mensaje || 'Error al cerrar votación');
    }
  },

  // Obtener resultados de votación
  obtenerResultados: async (votacionId) => {
    try {
      const response = await axios.get(`/votacion/${votacionId}/resultados`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.mensaje || 'Error al obtener resultados');
    }
  }
  // Obtener participantes de votación
  , obtenerParticipantes: async (votacionId) => {
    try {
      const response = await axios.get(`/votacion/${votacionId}/participantes`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.mensaje || 'Error al obtener participantes');
    }
  },
  publicarResultados: async (votacionId) => {
    try {
      const response = await axios.put(`/votacion/${votacionId}/publicar-resultados`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.mensaje || 'Error al publicar resultados');
    }
  }
};
