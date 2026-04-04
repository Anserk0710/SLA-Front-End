import axios from 'axios';
import { clearAuthSession, getToken } from '../lib/auth';

const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL ??
    import.meta.env.VITE_API_URL ??
    'http://127.0.0.1:8000/api/v1';

export const api = axios.create({
    baseURL: apiBaseUrl,
    timeout: 10000,
});

api.interceptors.request.use((config) => {
    const isPublicRequest = config.url?.startsWith('/public/');
    const token = getToken();

    if (token && !isPublicRequest) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const requestUrl = typeof error.config?.url === 'string' ? error.config.url : '';
        const isPublicRequest = requestUrl.startsWith('/public/');

        if (error.response?.status === 401 && !isPublicRequest) {
            clearAuthSession();
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);
