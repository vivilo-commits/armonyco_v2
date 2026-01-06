import { apiClient } from './api';

export interface ContactFormData {
    fullName: string;
    company?: string;
    email: string;
    phone?: string;
    unitsManaged?: string;
    message: string;
}

export const contactService = {
    async submitContactForm(data: ContactFormData): Promise<{ success: boolean }> {
        return apiClient.post<{ data: ContactFormData }, { success: boolean }>(
            '/contact',
            { data },
            { success: true }
        );
    }
};
