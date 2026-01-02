import { useCallback } from 'react';
import { useAsync } from './useAsync';
import { logService } from '../services/log.service';

export const useLogs = () => {
    const fetchLogs = useCallback(() => logService.getLogs(), []);
    return useAsync(fetchLogs);
};

export const useAgents = () => {
    const fetchAgents = useCallback(() => logService.getAgents(), []);
    return useAsync(fetchAgents);
};

export const useNotifications = () => {
    const fetchNotifications = useCallback(() => logService.getNotifications(), []);
    return useAsync(fetchNotifications);
}
