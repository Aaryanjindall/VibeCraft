const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const apiUrl = (path = '') => `${API_BASE}${path}`;
export { API_BASE };

