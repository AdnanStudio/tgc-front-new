import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('adminToken');
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
      const path = window.location.pathname;
      if (path.startsWith('/admin') && path !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error.response?.data || { message: 'Network Error' });
  }
);

export default api;

export const settingsAPI = {
  get: () => api.get('/settings'),
  update: (data) => api.put('/settings', data),
  uploadLogo: (fd) => api.put('/settings/logo', fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  uploadPrincipalPhoto: (fd) => api.put('/settings/principal-photo', fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  uploadChairmanPhoto: (fd) => api.put('/settings/chairman-photo', fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

export const noticesAPI = {
  getAll: (params) => api.get('/notices', { params }),
  getScrolling: () => api.get('/notices/scrolling'),
  getById: (id) => api.get(`/notices/${id}`),
  create: (fd) => api.post('/notices', fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, fd) => api.put(`/notices/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/notices/${id}`),
};

export const teachersAPI = {
  getAll: (params) => api.get('/teachers', { params }),
  getById: (id) => api.get(`/teachers/${id}`),
  create: (fd) => api.post('/teachers', fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, fd) => api.put(`/teachers/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/teachers/${id}`),
};

export const galleryAPI = {
  getAll: (params) => api.get('/gallery', { params }),
  upload: (fd) => api.post('/gallery', fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/gallery/${id}`, data),
  delete: (id) => api.delete(`/gallery/${id}`),
};

export const committeeAPI = {
  getAll: () => api.get('/committee'),
  create: (fd) => api.post('/committee', fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, fd) => api.put(`/committee/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/committee/${id}`),
};

export const studentsAPI = {
  get: () => api.get('/students'),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
};

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
  changePassword: (data) => api.post('/auth/change-password', data),
};

export const adminMgmtAPI = {
  getAll: () => api.get('/auth/admins'),
  create: (data) => api.post('/auth/admins', data),
  toggle: (id) => api.patch(`/auth/admins/${id}/toggle`),
  delete: (id) => api.delete(`/auth/admins/${id}`),
  resetPassword: (id, data) => api.patch(`/auth/admins/${id}/reset-password`, data),
  update: (id, data) => api.patch(`/auth/admins/${id}/update`, data),
  changeMyPassword: (data) => api.post('/auth/change-password', data),
};

export const routinesAPI = {
  getAll: (params) => api.get('/routines', { params }),
  create: (fd) => api.post('/routines', fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, fd) => api.put(`/routines/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/routines/${id}`),
};

export const approvalsAPI = {
  getAll: () => api.get('/approvals'),
  getById: (id) => api.get(`/approvals/${id}`),
  create: (fd) => api.post('/approvals', fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, fd) => api.put(`/approvals/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/approvals/${id}`),
};

export const mpoAPI = {
  get: () => api.get('/mpo'),
  create: (data) => api.post('/mpo', data),
  update: (id, data) => api.put(`/mpo/${id}`, data),
};

export const themeAPI = {
  getAll: () => api.get('/themes'),
  getActive: () => api.get('/themes/active'),
  activate: (id) => api.post(`/themes/activate/${id}`),
  update: (id, data) => api.put(`/themes/${id}`, data),
  seed: () => api.post('/themes/seed'),
};

export const navMenuAPI = {
  getAll: () => api.get('/navmenus'),
  getAllAdmin: () => api.get('/navmenus/all'),
  create: (data) => api.post('/navmenus', data),
  update: (id, data) => api.put(`/navmenus/${id}`, data),
  delete: (id) => api.delete(`/navmenus/${id}`),
  reorder: (orders) => api.post('/navmenus/reorder', { orders }),
  seed: () => api.post('/navmenus/seed'),
};

export const quickLinkAPI = {
  getAll: (params) => api.get('/quicklinks', { params }),
  getAllAdmin: () => api.get('/quicklinks/all'),
  create: (data) => api.post('/quicklinks', data),
  update: (id, data) => api.put(`/quicklinks/${id}`, data),
  delete: (id) => api.delete(`/quicklinks/${id}`),
  seed: () => api.post('/quicklinks/seed'),
};

export const scrollingAPI = {
  getAll: () => api.get('/scrollingtexts'),
  getAllAdmin: () => api.get('/scrollingtexts/all'),
  create: (data) => api.post('/scrollingtexts', data),
  update: (id, data) => api.put(`/scrollingtexts/${id}`, data),
  delete: (id) => api.delete(`/scrollingtexts/${id}`),
};
