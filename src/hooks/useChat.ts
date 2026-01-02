import { useCallback } from 'react';
import { useAsync } from './useAsync';
import { chatService } from '../services/chat.service';

export const useConversations = () => {
    const fetchConversations = useCallback(() => chatService.getConversations(), []);
    return useAsync(fetchConversations);
};
