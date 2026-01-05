export type ApiMode = 'mock' | 'real';

export const API_CONFIG = {
    MODE: (import.meta.env.VITE_API_MODE || 'mock') as ApiMode,
    BASE_URL: import.meta.env.VITE_API_URL || 'https://api.armonyco.com',
    TIMEOUT: 15000,
    MAX_RETRIES: 2,
    MOCK_DELAY: {
        MIN: 400,
        MAX: 1200
    }
};

export const isMock = () => API_CONFIG.MODE === 'mock';

export const validateConfig = () => {
    if (!isMock()) {
        if (!import.meta.env.VITE_API_URL) {
            console.warn('[ARM-SYS] WARNING: Running in REAL mode without VITE_API_URL. Falling back to default.');
        }
        // Add more critical checks here for production readiness
    }
};
