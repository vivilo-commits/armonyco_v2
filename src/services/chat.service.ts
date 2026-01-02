import { mockFetch } from './api';
import { mockConversations } from '../mocks/chat.mocks';
import { Conversation } from '../models/chat.model';

export const chatService = {
    getConversations: () => mockFetch<Conversation[]>(mockConversations),

    getConversationById: (id: string) => mockFetch<Conversation | undefined>(
        mockConversations.find(c => c.id === id)
    ),

    // Future methods: sendMessage, markAsRead, etc.
};
