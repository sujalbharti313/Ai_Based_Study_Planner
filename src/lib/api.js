/**
 * Typed API service layer.
 * Every frontend component imports from here — never calls axios directly.
 */
import api from './axios';

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authApi = {
  register:       (data)          => api.post('/auth/register', data),
  login:          (data)          => api.post('/auth/login', data),
  logout:         ()              => api.post('/auth/logout'),
  refresh:        ()              => api.post('/auth/refresh'),
  me:             ()              => api.get('/auth/me'),
  forgotPassword: (email)         => api.post('/auth/forgot-password', { email }),
  resetPassword:  (token, password) => api.post('/auth/reset-password', { token, password }),
  verifyEmail:    (token)         => api.get(`/auth/verify-email?token=${token}`),
};

// ── Dashboard ─────────────────────────────────────────────────────────────────
export const dashboardApi = {
  getStats: () => api.get('/dashboard'),
};

// ── Subjects ──────────────────────────────────────────────────────────────────
export const subjectsApi = {
  list:         (params)              => api.get('/subjects', { params }),
  get:          (id)                  => api.get(`/subjects/${id}`),
  create:       (data)                => api.post('/subjects', data),
  update:       (id, data)            => api.patch(`/subjects/${id}`, data),
  delete:       (id)                  => api.delete(`/subjects/${id}`),
  archive:      (id)                  => api.patch(`/subjects/${id}/archive`),
  listModules:  (id)                  => api.get(`/subjects/${id}/modules`),
  createModule: (id, data)            => api.post(`/subjects/${id}/modules`, data),
  toggleModule: (id, moduleId)        => api.patch(`/subjects/${id}/modules/${moduleId}/toggle`),
};

// ── Tasks ─────────────────────────────────────────────────────────────────────
export const tasksApi = {
  list:   (params)     => api.get('/tasks', { params }),
  get:    (id)         => api.get(`/tasks/${id}`),
  create: (data)       => api.post('/tasks', data),
  update: (id, data)   => api.patch(`/tasks/${id}`, data),
  delete: (id)         => api.delete(`/tasks/${id}`),
};

// ── Timetable ─────────────────────────────────────────────────────────────────
export const timetableApi = {
  getWeek:    (weekStart) => api.get('/timetable', { params: { weekStart } }),
  create:     (data)      => api.post('/timetable', data),
  update:     (id, data)  => api.patch(`/timetable/${id}`, data),
  delete:     (id)        => api.delete(`/timetable/${id}`),
  aiOptimize: (weekStart) => api.get('/timetable/ai-optimize', { params: { weekStart } }),
};

// ── Progress ──────────────────────────────────────────────────────────────────
export const progressApi = {
  getOverview:   ()     => api.get('/progress'),
  recordSession: (data) => api.post('/progress/session', data),
};

// ── AI Lab ────────────────────────────────────────────────────────────────────
export const aiApi = {
  listConversations:  (params) => api.get('/ai', { params }),
  getConversation:    (id)     => api.get(`/ai/${id}`),
  createConversation: (title)  => api.post('/ai', { title }),
  deleteConversation: (id)     => api.delete(`/ai/${id}`),
  sendMessage:        (id, message) => api.post(`/ai/${id}/messages`, { message }),
};

// ── Notifications ─────────────────────────────────────────────────────────────
export const notificationsApi = {
  list:       (params) => api.get('/notifications', { params }),
  markRead:   (id)     => api.patch(`/notifications/${id}/read`),
  markAllRead:()       => api.patch('/notifications/read-all'),
};

// ── User / Settings ───────────────────────────────────────────────────────────
export const userApi = {
  getProfile:     ()           => api.get('/users/me'),
  updateProfile:  (data)       => api.patch('/users/me', data),
  changePassword: (data)       => api.patch('/users/me/password', data),
  getSettings:    ()           => api.get('/users/me/settings'),
  updateSettings: (data)       => api.patch('/users/me/settings', data),
  uploadAvatar:   (formData)   => api.post('/users/me/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};
