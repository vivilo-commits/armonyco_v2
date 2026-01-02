import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  Shield,
  Database,
  Package,
  CreditCard,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  X,
  LogOut,
  Users,
  TrendingUp,
  Activity,
  Zap,
  Settings,
  IconSizes
} from '../ui/Icons';
import { UserRole } from '../../types';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  photo?: string | null;
}

interface Organization {
  name: string;
}

interface SidebarProps {
  activeView: string;
  setView: (view: string) => void;
  onLogout: () => void;
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  notificationCount: number;
  isCollapsed: boolean;
  toggleCollapse: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (isOpen: boolean) => void;
  userProfile: UserProfile;
  organization: Organization;
}

type MenuItem = {
  id: string;
  label: string;
  description?: string;
  icon: any;
  children: { id: string; label: string; badge?: number }[];
  action?: () => void; // For items without children that trigger an action/view directly
};

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setView,
  onLogout,
  currentRole,
  isCollapsed,
  toggleCollapse,
  isMobileOpen,
  setIsMobileOpen,
  userProfile,
  organization
}) => {
  const [expandedMenu, setExpandedMenu] = useState<string | null>('governance');

  // Corrected Menu Structure matching WebApp.tsx IDs exactly
  const menuStructure: MenuItem[] = useMemo(() => [
    {
      id: 'dashboard',
      label: 'Overview',
      icon: LayoutDashboard,
      children: [],
      action: () => setView('dashboard')
    },
    {
      id: 'governance',
      label: 'Control Tower',
      icon: Shield,
      children: [
        { id: 'value', label: 'Governed Value™' },
        { id: 'log', label: 'Decision Log' },
        { id: 'compliance', label: 'Compliance Rate™' },
        { id: 'human-risk', label: 'Human Risk' },
        { id: 'residual-risk', label: 'Residual Risk' },
      ]
    },
    {
      id: 'core',
      label: 'Core Constructs',
      icon: Database,
      children: [
        { id: 'aem', label: 'Armonyco Event Model™' },
        { id: 'aos', label: 'Armonyco Operating System™' },
        { id: 'ars', label: 'Armonyco Reliability Standard™' },
        { id: 'ags', label: 'Armonyco Governance Scorecard™' },
      ]
    },
    {
      id: 'products',
      label: 'Products',
      icon: Package,
      children: [
        { id: 'products-guest', label: 'Guest Experience' },
        { id: 'products-revenue', label: 'Revenue Generation' },
        { id: 'products-ops', label: 'Operational Efficiency' },
        { id: 'products-response', label: 'Incident Response' },
      ]
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      children: [
        { id: 'settings-profile', label: 'General' },
        { id: 'settings-company', label: 'Profile' },
        { id: 'settings-billing', label: 'Pricing & Billing' },
      ]
    }
  ], [setView]);

  const handleItemClick = (item: MenuItem) => {
    // Logic: 
    // If it has children: toggle expansion (if expanded, close; if closed, open). 
    // If collapsed sidebar: Open sidebar maybe? Or just expand submenu in popover? 
    // User requested "Pricing & Billing" (no children) to work when paused.

    if (item.children.length > 0) {
      if (isCollapsed) {
        // If collapsed, clicking a parent with children usually does nothing or opens a tooltip/popover. 
        // For simplicity and to match "standard" sidebar behavior often requested:
        setExpandedMenu(item.id);
        // We might want to auto-expand sidebar here if user finds it annoying, but "liquid glass" usually implies hover menus. 
        // However, user said "menu colapsável tá rolando junto". 
      } else {
        setExpandedMenu(expandedMenu === item.id ? null : item.id);
      }
    } else {
      // No children (Overview, Pricing & Billing)
      if (item.action) {
        item.action();
        setIsMobileOpen(false);
      }
    }
  };

  const userInitials = `${userProfile.firstName?.[0] || ''}${userProfile.lastName?.[0] || ''}`.toUpperCase();

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container - FIXED POSITIONING */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50
          h-full bg-[var(--color-surface)]/80 backdrop-blur-xl border-r border-[var(--color-border)] 
          transform transition-all duration-300 ease-in-out shadow-2xl md:shadow-none
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${isCollapsed ? 'w-[80px]' : 'w-[280px]'}
          flex flex-col
        `}
      >
        {/* Header */}
        <div className={`h-[80px] flex items-center shrink-0 border-b border-[var(--color-border)] transition-all ${isCollapsed ? 'justify-center px-0' : 'px-6 justify-between'}`}>
          <div className="flex items-center gap-3 overflow-hidden">
            {isCollapsed ? (
              <img src="/assets/logo-icon.png" alt="Armonyco" className="w-14 h-14 object-contain hover:scale-110 transition-transform cursor-pointer" onClick={() => setView('dashboard')} />
            ) : (
              <img src="/assets/logo-full.png" alt="Armonyco" className="h-14 object-contain hover:opacity-80 transition-opacity cursor-pointer" onClick={() => setView('dashboard')} />
            )}
          </div>
          <button onClick={() => setIsMobileOpen(false)} className="md:hidden text-[var(--color-text-muted)]">
            <X size={24} />
          </button>
        </div>

        {/* Navigation - SCROLLABLE */}
        <nav className="flex-1 overflow-y-auto scrollbar-hide py-6 px-3 space-y-2">
          {menuStructure.map(item => {
            const isActive = item.children.length > 0
              ? item.children.some(child => child.id === activeView)
              : (activeView === item.id || (item.id === 'settings' && activeView.startsWith('settings-'))); // Handle settings group

            const isExpanded = expandedMenu === item.id;

            return (
              <div key={item.id} className="mb-2">
                <button
                  onClick={() => handleItemClick(item)}
                  className={`
                                w-full flex items-center transition-all duration-200 rounded-xl group relative overflow-hidden
                                ${isCollapsed ? 'justify-center h-12 w-12 mx-auto' : 'px-4 py-3 text-left'}
                                ${isActive
                      ? 'bg-[var(--color-surface-hover)] text-[var(--color-text-main)] shadow-inner'
                      : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-main)]'
                    }
                            `}
                  title={isCollapsed ? item.label : undefined}
                >
                  {/* Active Indicator */}
                  {isActive && !isCollapsed && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[var(--color-brand-accent)] rounded-r-full"></div>
                  )}

                  {/* Icon */}
                  <div className={`shrink-0 transition-colors ${isActive ? 'text-[var(--color-brand-accent)]' : ''}`}>
                    <item.icon size={isCollapsed ? 22 : 18} strokeWidth={isActive ? 2 : 1.5} />
                  </div>

                  {/* Label */}
                  {!isCollapsed && (
                    <>
                      <span className="ml-3 text-sm font-medium flex-1 truncate">{item.label}</span>
                      {item.children.length > 0 && (
                        <ChevronDown size={14} className={`text-[var(--color-text-subtle)] transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                      )}
                    </>
                  )}
                </button>

                {/* Submenu */}
                {!isCollapsed && isExpanded && item.children.length > 0 && (
                  <div className="mt-1 ml-4 pl-4 border-l border-[var(--color-border)] space-y-0.5 animate-slide-down">
                    {item.children.map(child => (
                      <button
                        key={child.id}
                        onClick={() => {
                          setView(child.id);
                          setIsMobileOpen(false);
                        }}
                        className={`
                                            w-full text-left py-2 px-3 rounded-lg text-xs transition-all flex justify-between items-center
                                            ${activeView === child.id
                            ? 'text-[var(--color-text-main)] bg-[var(--color-surface-active)] font-medium'
                            : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-hover)]'
                          }
                                        `}
                      >
                        {child.label}
                        {child.badge && (
                          <span className="bg-[var(--color-brand-accent)] text-[var(--color-background)] px-1.5 py-0.5 rounded-full text-[9px] font-bold">
                            {child.badge}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer / Profile - FIXED AT BOTTOM */}
        <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-surface)]/50 backdrop-blur-md shrink-0">
          {!isCollapsed ? (
            <button
              onClick={() => setView('settings-profile')}
              className="flex items-center gap-3 mb-4 w-full text-left p-2 rounded-xl border border-transparent hover:border-white/10 hover:bg-white/[0.03] transition-all group"
            >
              <div className="w-9 h-9 rounded-full bg-[var(--color-surface-hover)] border border-[var(--color-border)] flex items-center justify-center text-xs font-bold text-[var(--color-text-main)] group-hover:scale-110 transition-transform">
                {userProfile.photo ? <img src={userProfile.photo} className="w-full h-full rounded-full object-cover" /> : userInitials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-[var(--color-text-main)] truncate group-hover:text-[var(--color-brand-accent)] transition-colors">{userProfile.firstName} {userProfile.lastName}</div>
                <div className="text-[10px] text-[var(--color-text-muted)] truncate">{organization.name}</div>
              </div>
            </button>
          ) : (
            <button
              onClick={() => setView('settings-profile')}
              className="flex justify-center mb-4 p-2 rounded-xl hover:bg-white/[0.03] transition-colors group mx-auto"
            >
              <div className="w-8 h-8 rounded-full bg-[var(--color-surface-hover)] border border-[var(--color-border)] flex items-center justify-center text-xs font-bold text-[var(--color-text-main)] group-hover:scale-110 transition-transform" title={`${userProfile.firstName} ${userProfile.lastName}`}>
                {userInitials}
              </div>
            </button>
          )}

          <button
            onClick={onLogout}
            className={`
                    flex items-center justify-center gap-2 w-full rounded-xl transition-all duration-300 group
                    ${isCollapsed
                ? 'h-10 w-10 mx-auto text-[var(--color-text-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10'
                : 'py-2.5 bg-[var(--color-surface-hover)] hover:bg-[var(--color-danger)] text-[var(--color-text-muted)] hover:text-white border border-[var(--color-border)] hover:border-transparent'
              }
                `}
            title="Logout"
          >
            <LogOut size={18} />
            {!isCollapsed && <span className="text-xs font-bold uppercase tracking-wider">Logout</span>}
          </button>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={toggleCollapse}
          className="absolute top-1/2 -right-3 w-6 h-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-brand-accent)] shadow-md z-50 hidden md:flex transition-colors cursor-pointer"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>
    </>
  );
};