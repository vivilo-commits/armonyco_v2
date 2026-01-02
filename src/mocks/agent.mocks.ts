import { Agent } from '../types';

export const mockAgents: Agent[] = [
    {
        id: 'agt-001',
        name: 'AMELIA',
        role: 'Cognitive Governor',
        status: 'ONLINE',
        productivity: '99.4%',
        uptime: '342d',
        decisions: 12450
    },
    {
        id: 'agt-002',
        name: 'JAMES',
        role: 'Market Strategist',
        status: 'ONLINE',
        productivity: '98.1%',
        uptime: '156d',
        decisions: 8902
    },
    {
        id: 'agt-003',
        name: 'SOFIA',
        role: 'Risk Compliance',
        status: 'BUSY',
        productivity: '99.9%',
        uptime: '890d',
        decisions: 45678
    },
    {
        id: 'agt-004',
        name: 'LIAM',
        role: 'Ops Optimization',
        status: 'OFFLINE',
        productivity: '97.2%',
        uptime: '45d',
        decisions: 1200
    }
];
