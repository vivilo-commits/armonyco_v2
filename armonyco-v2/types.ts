
export interface NavItem {
  label: string;
  id: string;
}

export interface MetricCardProps {
  label: string;
  value: string;
  subtext: string;
  target?: string;
  isGold?: boolean;
}

export enum ConstructType {
  AEM = 'AEM',
  AOS = 'AOS',
  ARS = 'ARS',
  AGS = 'AGS'
}

export enum UserRole {
  EXECUTIVE = 'Executive', // Full Access
  AUDITOR = 'Auditor',     // Read Only, Full Access to Logs/Constructs
  OPERATOR = 'Operator'    // Restricted Access (No Constructs Config)
}

export interface LogEntry {
  id: string;
  timestamp: string;
  policy: string;
  verdict: 'ALLOW' | 'DENY' | 'MODIFY';
  evidenceHash: string;
  responsible: string;
  credits: number; // New field for cost calculation
}

export interface Notification {
  id: string;
  type: 'ALERT' | 'WARNING' | 'INFO';
  message: string;
  timestamp: string;
  read: boolean;
  metric?: string;
}

export interface PillarData {
  title: string;
  description: string;
  unlocks: string[];
  footer: string;
}

export interface ProductModule {
  id: string;
  code: string;
  name: string;
  category: 'GUEST' | 'REVENUE' | 'OPS' | 'PLAYBOOK';
  description: string;
  what: string;
  why: string[];
  how: string;
  isActive: boolean;
  requiresExternal: boolean; // If true, Amelia handles WhatsApp
}