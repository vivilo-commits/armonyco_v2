import { API_CONFIG, isMock, getAuthToken } from '../config/api.config';

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
 * Standard API Client with production features (Timeouts, Retries, Auth)
 */
export const apiClient = {
    async request<T>(endpoint: string, options: RequestInit = {}, mockData: T, retryCount = 0): Promise<T> {
        if (isMock()) {
            return mockFetch(mockData);
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
                ...options,
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAuthToken()}`,
                    ...options.headers,
                }
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                // Handle specific status codes if needed
                if (response.status === 401) {
                    localStorage.removeItem('armonyco_token');
                    window.location.reload(); // Force re-authentication
                }
                throw new Error(`[API ERROR] ${response.status}: ${response.statusText}`);
            }

            return response.json();
        } catch (error: any) {
            clearTimeout(timeoutId);

            // Simple retry logic for network errors or timeouts
            if (retryCount < API_CONFIG.MAX_RETRIES && (error.name === 'AbortError' || !window.navigator.onLine)) {
                console.warn(`[API RETRY] Attempt ${retryCount + 1} for ${endpoint}`);
                return this.request(endpoint, options, mockData, retryCount + 1);
            }

            console.error(`[API FATAL] ${endpoint}:`, error);
            throw error;
        }
    },

    async get<T>(endpoint: string, mockData: T): Promise<T> {
        return this.request(endpoint, { method: 'GET' }, mockData);
    },

    async post<T, R>(endpoint: string, body: T, mockData: R): Promise<R> {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body)
        }, mockData);
    }
};
