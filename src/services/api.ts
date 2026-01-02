import { API_CONFIG, isMock } from '../config/api.config';

/**
 * Simulates a network request with latency and potential random errors.
 */
export async function mockFetch<T>(data: T, minDelay = API_CONFIG.MOCK_DELAY.MIN, maxDelay = API_CONFIG.MOCK_DELAY.MAX): Promise<T> {
    const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(data);
        }, delay);
    });
}

/**
 * Standard API Client that switches between MOCK and REAL data.
 */
export const apiClient = {
    async get<T>(endpoint: string, mockData: T): Promise<T> {
        if (isMock()) {
            return mockFetch(mockData);
        }

        const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                // Add Authorization header if needed
                // 'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        return response.json();
    },

    async post<T, R>(endpoint: string, body: T, mockData: R): Promise<R> {
        if (isMock()) {
            return mockFetch(mockData);
        }

        const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        return response.json();
    }
};
