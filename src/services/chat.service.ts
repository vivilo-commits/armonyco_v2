import { apiClient } from './api';
import { mockConversations } from '../mocks/chat.mocks';
import { Conversation } from '../models/chat.model';

export const chatService = {
    getConversations: () => apiClient.get<Conversation[]>('/chat/conversations', mockConversations),

    getConversationById: (id: string) => apiClient.get<Conversation | undefined>(
        `/chat/conversations/${id}`,
        mockConversations.find(c => c.id === id)
    ),

    sendMessage: (conversationId: string, content: string) => apiClient.post(
        `/chat/conversations/${conversationId}/messages`,
        { content },
        { success: true }
    )
};
