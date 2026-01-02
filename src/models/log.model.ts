export interface LogEntry {
    id: string;
    timestamp: string;
    policy: string;
    verdict: 'ALLOW' | 'DENY' | 'MODIFY';
    evidenceHash: string;
    responsible: string;
    credits: number;
}

export interface Notification {
    id: string;
    type: 'ALERT' | 'WARNING' | 'INFO';
    message: string;
    timestamp: string;
    read: boolean;
    metric?: string;
}

export interface Agent {
    id: string;
    name: string;
    role: string;
    status: 'active' | 'learning' | 'idle';
    decisionCount: number;
    accuracy: string;
    avatar: string; // URL or Initials
}
