import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include token from localStorage
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Device APIs
export const deviceService = {
  getAllDevices: () => apiClient.get('/devices'),
  getDevicesByRoom: (room) => apiClient.get(`/devices/room/${room}`),
  addDevice: (deviceData) => apiClient.post('/devices', deviceData),
  updateDevice: (id, updateData) => apiClient.put(`/devices/${id}`, updateData),
  deleteDevice: (id) => apiClient.delete(`/devices/${id}`)
};

// Automation APIs
export const automationService = {
  getAllAutomations: () => apiClient.get('/automations'),
  toggleAutomation: (id) => apiClient.put(`/automations/${id}/toggle`),
  addAutomation: (automationData) => apiClient.post('/automations', automationData),
  updateAutomation: (id, automationData) => apiClient.put(`/automations/${id}`, automationData),
  deleteAutomation: (id) => apiClient.delete(`/automations/${id}`)
};

// Scene APIs
export const sceneService = {
  getAllScenes: () => apiClient.get('/scenes'),
  addScene: (sceneData) => apiClient.post('/scenes', sceneData),
  deleteScene: (id) => apiClient.delete(`/scenes/${id}`)
};

// Energy APIs
export const energyService = {
  getAllEnergy: () => apiClient.get('/energy'),
  addEnergy: (energyData) => apiClient.post('/energy', energyData),
  deleteEnergy: (id) => apiClient.delete(`/energy/${id}`)
};

// Member APIs
export const memberService = {
  getAllMembers: () => apiClient.get('/members'),
  getMemberById: (id) => apiClient.get(`/members/${id}`),
  addMember: (formData) => {
    // Use multipart/form-data for file uploads
    return apiClient.post('/members', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  updateMember: (id, formData) => {
    return apiClient.put(`/members/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  deleteMember: (id) => apiClient.delete(`/members/${id}`)
};

// Clustering APIs
export const clusteringService = {
  analyzeDevices: () => apiClient.get('/clustering/analysis')
};

export default apiClient;
