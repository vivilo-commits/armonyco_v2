export type ApiMode = 'mock' | 'real';

export const API_CONFIG = {
    MODE: 'mock' as ApiMode,
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.armonyco.com',
    TIMEOUT: 15000,
    MOCK_DELAY: {
        MIN: 400,
        MAX: 1200
    }
};

export const isMock = () => API_CONFIG.MODE === 'mock';
