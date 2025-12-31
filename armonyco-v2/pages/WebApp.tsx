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
import { ProductsView } from './app/Products';
import { ConversationsView } from './app/Conversations';
import { RoleManagement } from './app/RoleManagement';
import { SettingsView } from './app/Settings';
import { DocumentationView } from './app/Documentation';
import { SupportView } from './app/Support';
import { UserRole, Notification } from '../types';
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
    firstName: 'Executive',
    lastName: 'Admin',
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

  const [currentCredits, setCurrentCredits] = useState(initialData?.credits || 124.5000);

  // Mock Notifications
  const [notifications, setNotifications] = useState<Notification[]>([
      { id: '1', type: 'ALERT', message: 'Autonomous Compliance Rate drop detected', timestamp: '10m ago', read: false, metric: '94.2%' },
      { id: '2', type: 'WARNING', message: 'Human Risk Exposure spike > 5%', timestamp: '1h ago', read: false, metric: 'Risk' },
      { id: '3', type: 'INFO', message: 'Weekly Governance Report generated', timestamp: '1d ago', read: true },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
      setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getPageTitle = (view: string) => {
      switch(view) {
          case 'dashboard': return 'Control Tower';
          case 'value': return 'Governed Value™';
          case 'log': return 'Immutable Log';
          case 'compliance': return 'Compliance Rate';
          case 'human-risk': return 'Human Risk';
          case 'residual-risk': return 'Residual Risk';
          case 'aem': return 'AEM Event Model';
          case 'aos': return 'AOS Operating System';
          case 'ars': return 'ARS Reliability';
          case 'ags': return 'AGS Scorecard';
          case 'products-guest': return 'Products / Guest';
          case 'products-revenue': return 'Products / Revenue';
          case 'products-ops': return 'Products / Ops';
          case 'products-response': return 'Products / Response';
          case 'conversations': return 'Conversations';
          // Settings Sub-menus
          case 'settings-profile': return 'Settings / Profile';
          case 'settings-org': return 'Settings / Organization';
          case 'settings-activation': return 'Settings / Activation';
          case 'settings-notifications': return 'Settings / Notifications';
          case 'settings-billing': return 'Settings / Billing';
          case 'documentation': return 'Documentation';
          case 'support': return 'Support';
          case 'roles': return 'Role Management';
          default: return 'Armonyco';
      }
  };

  const renderView = () => {
      switch (activeView) {
          case 'dashboard': return <Dashboard />;
          case 'value': return <GovernedValueView />;
          case 'log': return <DecisionLog />;
          case 'compliance': return <RiskComplianceView view="compliance" />;
          case 'human-risk': return <RiskComplianceView view="human-risk" />;
          case 'residual-risk': return <RiskComplianceView view="residual-risk" />;
          case 'aem': return <AEMView />;
          case 'aos': return <AOSView />;
          case 'ars': return <ARSView />;
          case 'ags': return <AGSView />;
          case 'products-guest': return <ProductsView block="GUEST" />;
          case 'products-revenue': return <ProductsView block="REVENUE" />;
          case 'products-ops': return <ProductsView block="OPS" />;
          case 'products-response': return <ProductsView block="PLAYBOOK" />;
          case 'conversations': return <ConversationsView />;
          case 'roles': return <RoleManagement />;
          
          // Settings sub-routes all go to SettingsView with activeView prop to switch internal tabs
          case 'settings-profile':
          case 'settings-org':
          case 'settings-activation':
          case 'settings-notifications':
          case 'settings-billing':
              return <SettingsView 
                activeView={activeView} 
                userProfile={userProfile}
                onUpdateProfile={(p) => setUserProfile({...userProfile, ...p})}
                organization={organization}
                onUpdateOrganization={(o) => setOrganization({...organization, ...o})}
                billingDetails={billingDetails}
                onUpdateBillingDetails={(b) => setBillingDetails({...billingDetails, ...b})}
                currentCredits={currentCredits}
                onUpdateCredits={setCurrentCredits}
              />;
              
          case 'documentation': return <DocumentationView />;
          case 'support': return <SupportView />;
          default: return <Dashboard />;
      }
  };

  return (
    <div className="flex min-h-screen bg-stone-50 font-sans text-stone-900 selection:bg-armonyco-gold/30">
      
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
      />

      <main className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        
        {/* Mobile Header */}
        <div className="md:hidden h-16 bg-white border-b border-stone-200 flex items-center justify-between px-6 sticky top-0 z-30">
            <div className="flex items-center gap-3">
                <button onClick={() => setIsMobileOpen(true)} className="text-stone-500">
                    <Menu size={24} />
                </button>
                <span className="font-bold text-lg text-stone-900">{getPageTitle(activeView)}</span>
            </div>
            <div className="w-8 h-8 bg-stone-900 rounded-full flex items-center justify-center text-armonyco-gold font-bold text-xs">
                A
            </div>
        </div>

        <AppHeader 
            title={getPageTitle(activeView)} 
            onNavigate={setActiveView} 
            notifications={notifications}
            markAsRead={markAsRead}
            markAllAsRead={markAllAsRead}
        />

        <div className="flex-1 overflow-x-hidden">
            {renderView()}
        </div>

      </main>
    </div>
  );
};