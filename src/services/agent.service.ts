import { apiClient } from './api';
import { mockAgents } from '../mocks/agent.mocks';
import { Agent } from '../types';

export const agentService = {
    getAgents: (): Promise<Agent[]> => {
        return apiClient.get('/agents', mockAgents);
    }
};
