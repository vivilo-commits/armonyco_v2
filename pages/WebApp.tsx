import React, { useState } from 'react';
import { Sidebar } from '../components/app/Sidebar';
import { AppHeader } from '../components/app/AppHeader';
import { Dashboard } from './app/Dashboard';
import { DecisionLog } from './app/DecisionLog';
import { GovernedValueView } from './app/GovernedValue';
import { RiskComplianceView } from './app/RiskCompliance';
import { AEMView } from './app/AEM';
import { AOSView } from './app/AOS';
import { ARSView } from './app/ARS';
import { AGSView } from './app/AGS';
import { AIMView } from './app/AIM';
import { ProductManagement } from './app/ProductManagement';
import { ConversationsView } from './app/Conversations';
import { RoleManagement } from './app/RoleManagement';
import { SettingsView } from './app/Settings';
import { DocumentationView } from './app/Documentation';
import { SupportView } from './app/Support';
import { UserRole, Notification } from '../src/types';
import { Menu } from '../components/ui/Icons';

interface WebAppProps {
  onLogout: () => void;
  initialData?: {
    userProfile: any;
    organization: any;
    billingDetails: any;
    credits: number;
  }
}

export const WebApp: React.FC<WebAppProps> = ({ onLogout, initialData }) => {
  const [activeView, setActiveView] = useState('dashboard');
  const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.EXECUTIVE);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Shared State for User & Organization (Source of Truth)
  // Initialize with initialData if present, otherwise default mock data
  const [userProfile, setUserProfile] = useState(initialData?.userProfile || {
    firstName: 'First',
    lastName: 'Name',
    email: 'admin@armonyco.com',
    phone: '+1 (555) 0123-4567',
    photo: null as string | null
  });

  const [organization, setOrganization] = useState(initialData?.organization || {
    name: 'Acme Hospitality Group',
    billingEmail: 'billing@acme.com',
    language: 'EN',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });

  const [billingDetails, setBillingDetails] = useState(initialData?.billingDetails || {
    legalName: '',
    vatNumber: '',
    fiscalCode: '',
    address: '',
    city: '',
    zip: '',
    country: '',
    sdiCode: '',
    pecEmail: ''
  });

  const [currentCredits, setCurrentCredits] = useState(initialData?.credits || 12500);
  const [activePlanId, setActivePlanId] = useState(1);

  // Mock Notifications
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', type: 'ALERT', message: 'Armonyco AGS - Governance Scorecard™ drop detected', timestamp: '10m ago', read: false, metric: '94.2%' },
    { id: '2', type: 'WARNING', message: 'Armonyco Human Risk™ spike > 5%', timestamp: '1h ago', read: false, metric: 'Risk' },
    { id: '3', type: 'INFO', message: 'Weekly Armonyco AGS - Scorecard Report generated', timestamp: '1d ago', read: true },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getPageTitle = (view: string) => {
    switch (view) {
      case 'dashboard': return 'Armonyco Control Tower™';
      case 'value': return 'Governed Cashflow™';
      case 'log': return 'Decision Log';
      case 'compliance': return 'Compliance Rate™';
      case 'human-risk': return 'Human Risk';
      case 'residual-risk': return 'Residual Risk';
      case 'aem': return 'AEM - Armonyco Event Model™';
      case 'aos': return 'AOS - Armonyco Operating System™';
      case 'ars': return 'ARS - Armonyco Reliability System™';
      case 'ags': return 'AGS - Armonyco Governance Scorecard™';
      case 'aim': return 'AIM - Armonyco Intelligence Matrix™';
      case 'products': return 'My Services';
      case 'conversations': return 'Conversations';
      // Settings Sub-menus
      // Settings Sub-menus
      case 'settings-profile':
      case 'settings-company':
      case 'settings-billing':
        return 'System Settings';
      case 'documentation': return 'Documentation';
      case 'support': return 'Support';
      case 'roles': return 'Role Management';
      default: return 'Armonyco';
    }
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard onNavigate={setActiveView} />;
      case 'value': return <GovernedValueView />;
      case 'log': return <DecisionLog />;
      case 'compliance': return <RiskComplianceView view="compliance" />;
      case 'human-risk': return <RiskComplianceView view="human-risk" />;
      case 'residual-risk': return <RiskComplianceView view="residual-risk" />;
      case 'aem': return <AEMView />;
      case 'aos': return <AOSView />;
      case 'ars': return <ARSView />;
      case 'aim': return <AIMView />;
      case 'ags': return <AGSView />;
      case 'products': return <ProductManagement />;
      case 'conversations': return <ConversationsView />;
      case 'roles': return <RoleManagement />;

      // Settings sub-routes all go to SettingsView with activeView prop to switch internal tabs
      case 'settings-profile':
      case 'settings-company':
      case 'settings-billing':
        return <SettingsView
          activeView={activeView}
          userProfile={userProfile}
          onUpdateProfile={(p) => setUserProfile({ ...userProfile, ...p })}
          organization={organization}
          onUpdateOrganization={(o) => setOrganization({ ...organization, ...o })}
          billingDetails={billingDetails}
          onUpdateBillingDetails={(b) => setBillingDetails({ ...billingDetails, ...b })}
          currentCredits={currentCredits}
          onUpdateCredits={setCurrentCredits}
          activePlanId={activePlanId}
          onUpdatePlanId={setActivePlanId}
        />;

      case 'documentation': return <DocumentationView />;
      case 'support': return <SupportView />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--color-background)] font-sans text-[var(--color-text-main)] selection:bg-[var(--color-brand-accent)]/30">

      <Sidebar
        activeView={activeView}
        setView={setActiveView}
        onLogout={onLogout}
        currentRole={currentRole}
        setRole={setCurrentRole}
        notificationCount={unreadCount}
        isCollapsed={isCollapsed}
        toggleCollapse={() => setIsCollapsed(!isCollapsed)}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        userProfile={userProfile}
        organization={organization}
        activePlanId={activePlanId}
      />

      <main className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'md:ml-[80px]' : 'md:ml-[280px]'}`}>

        {/* Mobile Header */}
        <div className="md:hidden h-16 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMobileOpen(true)} className="text-[var(--color-text-muted)]">
              <Menu size={24} />
            </button>
            <span className="font-bold text-lg text-[var(--color-text-main)]">{getPageTitle(activeView)}</span>
          </div>
          <img src="/assets/logo-icon.png" alt="Armonyco" className="w-10 h-10 object-contain" />
        </div>

        {/* AppHeader Removed */}

        <main className="flex-1 overflow-y-auto relative bg-[var(--color-background)] p-4 md:p-6 lg:p-8">
          {/* Premium Application Shell */}
          <div className="w-full max-w-[1600px] mx-auto bg-zinc-950 text-white app-shell-theme rounded-[2.5rem] overflow-hidden min-h-[calc(100vh-6rem)] flex shadow-2xl border border-white/5 relative">
            {/* Shell Ambient Glow */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--color-brand-primary)]/5 blur-[120px] pointer-events-none rounded-full mix-blend-screen" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[var(--color-brand-accent)]/5 blur-[120px] pointer-events-none rounded-full mix-blend-screen" />

            {/* Content */}
            <div className="relative z-10 w-full min-h-full">
              {renderView()}
            </div>
          </div>
        </main>

      </main>
    </div>
  );
};