import axios, { type AxiosError } from 'axios';
import { clearAuthSession, getToken } from '../lib/auth';

const fallbackApiBaseUrl = 'http://127.0.0.1:8000/api/v1';
const fallbackRequestTimeoutMs = 30000;
const fallbackUploadTimeoutMs = 120000;

function normalizeApiBaseUrl(value: string) {
    return value.replace(/\/+$/, '');
}

function parsePositiveInt(value: string | undefined, fallbackValue: number) {
    const parsedValue = Number.parseInt(value ?? '', 10);
    return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : fallbackValue;
}

function isTimeoutError(error: unknown): error is AxiosError {
    if (!axios.isAxiosError(error)) {
        return false;
    }

    const timeoutCode = error.code?.toUpperCase() ?? '';
    return timeoutCode === 'ECONNABORTED' || error.message.toLowerCase().includes('timeout');
}

function getFriendlyTimeoutMessage(error: AxiosError, defaultTimeoutMs: number) {
    const requestPath = typeof error.config?.url === 'string' ? error.config.url : 'endpoint API';
    const timeoutMs = typeof error.config?.timeout === 'number' ? error.config.timeout : defaultTimeoutMs;
    const timeoutSeconds = Math.max(1, Math.round(timeoutMs / 1000));

    return `Permintaan ke ${requestPath} melewati batas waktu ${timeoutSeconds} detik. Coba lagi. Untuk upload file/video, pastikan koneksi stabil atau ukuran file lebih kecil.`;
}

export const apiBaseUrl = normalizeApiBaseUrl(
    import.meta.env.VITE_API_BASE_URL ??
    import.meta.env.VITE_API_URL ??
    fallbackApiBaseUrl
);

export const requestTimeoutMs = parsePositiveInt(
    import.meta.env.VITE_API_TIMEOUT_MS,
    fallbackRequestTimeoutMs
);

export const uploadTimeoutMs = parsePositiveInt(
    import.meta.env.VITE_API_UPLOAD_TIMEOUT_MS,
    fallbackUploadTimeoutMs
);

export const api = axios.create({
    baseURL: apiBaseUrl,
    timeout: requestTimeoutMs,
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
        if (isTimeoutError(error)) {
            error.message = getFriendlyTimeoutMessage(error, requestTimeoutMs);
        } else if (axios.isAxiosError(error) && !error.response) {
            error.message = `Backend tidak merespons. Periksa koneksi jaringan atau pastikan server aktif di ${apiBaseUrl}.`;
        }

        const requestUrl = axios.isAxiosError(error) && typeof error.config?.url === 'string'
            ? error.config.url
            : '';
        const isPublicRequest = requestUrl.startsWith('/public/');

        if (axios.isAxiosError(error) && error.response?.status === 401 && !isPublicRequest) {
            clearAuthSession();
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);
