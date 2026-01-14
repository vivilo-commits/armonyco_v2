import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Sidebar } from '../components/app/Sidebar';
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
import { UserRole, Notification, UserProfile, Organization, BillingDetails } from '../src/types';
import { Menu } from '../components/ui/Icons';
import { authService } from '../src/services/auth.service';
import { AdminUsersView } from './app/AdminUsers';
import { InviteMember } from './app/InviteMember';
import SuperAdminDashboard from '../src/pages/app/SuperAdminDashboard';
import { usePermissions } from '../src/hooks/usePermissions';

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
  // Get permissions for SuperAdmin check
  const { isAppAdmin, loading: permissionsLoading } = usePermissions();
  
  // ===== CRITICAL FIX: Compute initial view WITHOUT storing in localStorage for SuperAdmin =====
  const getInitialView = useCallback(() => {
    // ALWAYS start with 'dashboard' to avoid issues
    return 'dashboard';
  }, []);
  
  const [activeView, setActiveView] = useState(getInitialView);
  const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.EXECUTIVE);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  // Track if initial redirect was done to prevent loops
  const hasInitialRedirect = useRef(false);

  console.log('[WebApp] 🔄 Render - permissionsLoading:', permissionsLoading, 'isAppAdmin:', isAppAdmin, 'activeView:', activeView);

  // Save view to localStorage when it changes (ONLY for non-SuperAdmin)
  useEffect(() => {
    if (!permissionsLoading && !isAppAdmin) {
      console.log('[WebApp] 💾 Saving view to localStorage:', activeView);
      localStorage.setItem('armonyco_active_view', activeView);
    }
  }, [activeView, isAppAdmin, permissionsLoading]);

  // ===== SUPER ADMIN: ONE-TIME redirect on initial load ONLY =====
  useEffect(() => {
    console.log('[WebApp] ⚡ SuperAdmin check useEffect - loading:', permissionsLoading, 'hasRedirect:', hasInitialRedirect.current);
    
    // Skip if still loading OR already did initial redirect
    if (permissionsLoading || hasInitialRedirect.current) {
      return;
    }

    // Mark that we've done the initial check
    hasInitialRedirect.current = true;

    if (isAppAdmin) {
      console.log('[WebApp] 👑 SuperAdmin detected - ONE-TIME check');
      if (activeView !== 'dashboard') {
        console.log('[WebApp] 👑 Setting view to dashboard (one-time)');
        setActiveView('dashboard');
      } else {
        console.log('[WebApp] 👑 Already on dashboard - no change');
      }
    } else {
      console.log('[WebApp] 👤 Normal user detected');
      // Normal user: restore from localStorage if exists
      const savedView = localStorage.getItem('armonyco_active_view');
      if (savedView && savedView !== activeView) {
        console.log('[WebApp] 👤 Restoring saved view:', savedView);
        setActiveView(savedView);
      }
    }
  }, [permissionsLoading]); // ← ONLY permissionsLoading, nothing else!

  // ===== WRAPPER: Prevent SuperAdmin from navigating away from dashboard =====
  const handleSetView = useCallback((view: string) => {
    console.log('[WebApp] 🎯 handleSetView called - view:', view, 'isAppAdmin:', isAppAdmin);
    
    // If SuperAdmin, block navigation to anything other than dashboard
    if (!permissionsLoading && isAppAdmin && view !== 'dashboard') {
      console.log('[WebApp] 🚫 SuperAdmin BLOCKED from navigating to:', view);
      return; // Block navigation
    }
    
    console.log('[WebApp] ✅ Setting view to:', view);
    setActiveView(view);
  }, [isAppAdmin, permissionsLoading]);

  // State for User, Organization, Billing (loaded from database)
  const [userProfile, setUserProfile] = useState<UserProfile>(initialData?.userProfile || {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    photo: null,
    role: 'Executive',
    credits: 0
  });

  const [organization, setOrganization] = useState<Organization>(initialData?.organization || {
    id: '',
    name: '',
    billingEmail: '',
    language: 'EN',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });

  const [billingDetails, setBillingDetails] = useState<BillingDetails>(initialData?.billingDetails || {
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

  const [currentCredits, setCurrentCredits] = useState(initialData?.userProfile?.credits || 0);
  const [activePlanId, setActivePlanId] = useState(1);

  // Load data from database on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const [profile, org, billing] = await Promise.all([
          authService.getUserProfile(),
          authService.getOrganization(),
          authService.getBillingDetails()
        ]);

        setUserProfile(profile);
        setOrganization(org);
        setBillingDetails(billing);
        setCurrentCredits(profile.credits);
      } catch (error) {
        console.error('[WebApp] Failed to load user data:', error);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadUserData();
  }, []);

  // Handlers that save to database
  const handleUpdateProfile = useCallback(async (data: Partial<UserProfile>) => {
    try {
      const updated = await authService.updateProfile(data);
      setUserProfile(prev => ({ ...prev, ...updated }));
      console.log('[WebApp] Profile updated');
    } catch (error) {
      console.error('[WebApp] Failed to update profile:', error);
    }
  }, []);

  const handleUpdateOrganization = useCallback(async (data: Partial<Organization>) => {
    try {
      const updated = await authService.updateOrganization(data);
      setOrganization(prev => ({ ...prev, ...updated }));
      console.log('[WebApp] Organization updated');
    } catch (error) {
      console.error('[WebApp] Failed to update organization:', error);
    }
  }, []);

  const handleUpdateBillingDetails = useCallback(async (data: Partial<BillingDetails>) => {
    try {
      const updated = await authService.updateBillingDetails(data);
      setBillingDetails(prev => ({ ...prev, ...updated }));
      console.log('[WebApp] Billing details updated');
    } catch (error) {
      console.error('[WebApp] Failed to update billing:', error);
    }
  }, []);

  const handleUpdateCredits = useCallback(async (newAmount: number) => {
    try {
      const diff = newAmount - currentCredits;
      if (diff > 0) {
        await authService.addCredits(diff);
      }
      setCurrentCredits(newAmount);
    } catch (error) {
      console.error('[WebApp] Failed to update credits:', error);
    }
  }, [currentCredits]);

  // Notifications (still local for now)
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
    console.log('[WebApp] 🎨 renderView called - activeView:', activeView, 'isLoadingData:', isLoadingData, 'isAppAdmin:', isAppAdmin);
    
    // Show loading while fetching data
    if (isLoadingData) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
            <span className="text-zinc-500 text-sm">Loading data...</span>
          </div>
        </div>
      );
    }

    // ===== SUPER ADMIN: ALWAYS show SuperAdminDashboard, ignore activeView =====
    if (!permissionsLoading && isAppAdmin) {
      console.log('[WebApp] 👑 Rendering SuperAdminDashboard (forced)');
      return <SuperAdminDashboard />;
    }

    // ===== NORMAL USERS: Render based on activeView =====
    console.log('[WebApp] 👤 Rendering normal view:', activeView);
    
    switch (activeView) {
      case 'dashboard': 
        // Normal users see Dashboard
        return <Dashboard onNavigate={handleSetView} />;
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

      case 'settings-profile':
      case 'settings-company':
      case 'settings-billing':
        return <SettingsView
          activeView={activeView}
          userProfile={userProfile}
          onUpdateProfile={handleUpdateProfile}
          organization={organization}
          onUpdateOrganization={handleUpdateOrganization}
          billingDetails={billingDetails}
          onUpdateBillingDetails={handleUpdateBillingDetails}
          currentCredits={currentCredits}
          onUpdateCredits={handleUpdateCredits}
          activePlanId={activePlanId}
          onUpdatePlanId={setActivePlanId}
        />;

      case 'documentation': return <DocumentationView />;
      case 'support': return <SupportView />;
      case 'admin-users': return <AdminUsersView />;
      case 'invite-member': return <InviteMember onBack={() => handleSetView('admin-users')} />;
      default: return <Dashboard onNavigate={handleSetView} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--color-background)] font-sans text-[var(--color-text-main)] selection:bg-[var(--color-brand-accent)]/30">

      <Sidebar
        activeView={activeView}
        setView={handleSetView}
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