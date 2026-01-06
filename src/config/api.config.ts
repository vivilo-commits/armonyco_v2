export type ApiMode = 'mock' | 'real';

export const API_CONFIG = {
    MODE: (import.meta.env.VITE_API_MODE || 'mock') as ApiMode,
    BASE_URL: import.meta.env.VITE_API_URL || 'https://api.armonyco.com',
    TOKEN: import.meta.env.VITE_API_TOKEN || '',
    TIMEOUT: 15000,
    MAX_RETRIES: 2,
    MOCK_DELAY: {
        MIN: 400,
        MAX: 1200
    }
};

export const isMock = () => API_CONFIG.MODE === 'mock';

export const getAuthToken = () => {
    return localStorage.getItem('armonyco_token') || API_CONFIG.TOKEN;
};

export const validateConfig = () => {
    console.log(`[ARM-SYS] Initializing Decision OS Data Substrate... (Mode: ${API_CONFIG.MODE.toUpperCase()})`);

    if (!isMock()) {
        if (!import.meta.env.VITE_API_URL) {
            console.error('[ARM-SYS] CRITICAL: Running in REAL mode without VITE_API_URL. Data streams may fail.');
        }
        if (!getAuthToken()) {
            console.warn('[ARM-SYS] WARNING: No Authorization Token detected. Ingress might be restricted.');
        }
    }
};
