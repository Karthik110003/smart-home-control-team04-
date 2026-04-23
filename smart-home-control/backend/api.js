import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

export const deviceService = {
  getAllDevices: () => API.get('/devices'),
  addDevice: (data) => API.post('/devices', data),
  updateDevice: (id, data) => API.put(`/devices/${id}`, data),
  deleteDevice: (id) => API.delete(`/devices/${id}`)
};