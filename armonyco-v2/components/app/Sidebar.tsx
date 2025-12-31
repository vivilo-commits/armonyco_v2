import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Layers, 
  Package, 
  Settings, 
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  X,
  LogOut
} from '../ui/Icons';
import { UserRole } from '../../types';
import { AnimatedButton } from '../ui/AnimatedButton';

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
  description: string;
  icon: any;
  children: { id: string; label: string; badge?: number }[];
  action?: () => void; 
};

interface SidebarContentProps {
  menuStructure: MenuItem[];
  activeView: string;
  setView: (view: string) => void;
  onLogout: () => void;
  currentRole: UserRole;
  isCollapsed: boolean;
  expandedMenu: string | null;
  setExpandedMenu: (id: string | null) => void;
  setIsMobileOpen: (isOpen: boolean) => void;
  userProfile: UserProfile;
  organization: Organization;
}

const SidebarContent: React.FC<SidebarContentProps> = ({
  menuStructure,
  activeView,
  setView,
  onLogout,
  currentRole,
  isCollapsed,
  expandedMenu,
  setExpandedMenu,
  setIsMobileOpen,
  userProfile,
  organization
}) => {
  
  const handleParentClick = (item: MenuItem) => {
    if (item.children && item.children.length > 0) {
        if (isCollapsed) {
          setExpandedMenu(item.id);
        } else {
          setExpandedMenu(expandedMenu === item.id ? null : item.id);
        }
    } else {
        if (item.action) {
            item.action();
            setIsMobileOpen(false);
        }
    }
  };

  const userInitials = `${userProfile.firstName?.[0] || ''}${userProfile.lastName?.[0] || ''}`.toUpperCase();

  return (
    <div className="flex flex-col h-full bg-white border-r border-stone-200 text-stone-900 shadow-sm">
      {/* Header */}
      <div className={`h-[80px] flex flex-col justify-center px-4 border-b border-stone-100 transition-all ${isCollapsed ? 'items-center px-0' : ''}`}>
        <div className="flex items-center justify-between w-full">
           {isCollapsed ? (
             <div className="w-10 h-10 rounded-xl bg-stone-900 flex items-center justify-center text-armonyco-gold font-bold text-xs shadow-lg">
               A
             </div>
           ) : (
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-stone-900 flex items-center justify-center text-armonyco-gold font-bold text-[10px] shadow-lg">A</div>
                <span className="font-bold tracking-tight text-stone-900 text-lg">ARMONYCO</span>
             </div>
           )}
           {/* Mobile Close */}
           <button onClick={() => setIsMobileOpen(false)} className="md:hidden text-stone-400">
             <X size={20} />
           </button>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-hide py-6 px-4 space-y-2">
        {menuStructure.map((item) => {
          const isExpanded = expandedMenu === item.id;
          const hasChildren = item.children && item.children.length > 0;
          const isActiveParent = hasChildren 
            ? item.children.some(child => child.id === activeView) 
            : activeView === item.id;

          return (
            <div key={item.id} className="mb-2">
              {/* Parent Item */}
              <button
                type="button"
                onClick={() => handleParentClick(item)}
                className={`
                  w-full flex items-center transition-all duration-300 rounded-xl group relative overflow-hidden
                  ${isCollapsed ? 'justify-center py-4' : 'px-4 py-3.5 text-left'}
                  ${isActiveParent && isCollapsed ? 'bg-stone-50 shadow-sm' : ''}
                  ${!isCollapsed ? 'hover:bg-stone-50' : ''}
                  ${isActiveParent && !isCollapsed && !hasChildren ? 'bg-stone-50 shadow-sm' : ''} 
                `}
              >
                {/* Active Indicator Line */}
                {isActiveParent && !isCollapsed && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-armonyco-gold rounded-r-full"></div>
                )}

                {/* Icon */}
                <div className={`
                  flex items-center justify-center transition-colors
                  ${isActiveParent ? 'text-armonyco-gold' : 'text-stone-400 group-hover:text-stone-900'}
                `}>
                  <item.icon size={20} strokeWidth={isActiveParent ? 2 : 1.5} />
                </div>

                {/* Text Content */}
                {!isCollapsed && (
                  <div className="ml-4 flex-1">
                    <div className={`text-sm font-medium ${isActiveParent ? 'text-stone-900' : 'text-stone-600'}`}>
                      {item.label}
                    </div>
                    <div className="text-[10px] text-stone-400 leading-tight mt-0.5 font-medium opacity-80">
                      {item.description}
                    </div>
                  </div>
                )}

                {/* Chevron */}
                {!isCollapsed && hasChildren && (
                  <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                     <ChevronDown size={14} className="text-stone-300" />
                  </div>
                )}
              </button>

              {/* Children (Submenu) */}
              {!isCollapsed && isExpanded && hasChildren && (
                <div className="mt-2 ml-4 pl-4 border-l border-stone-100 space-y-1">
                  {item.children.map((child) => {
                    const isChildActive = activeView === child.id;
                    return (
                      <button
                        type="button"
                        key={child.id}
                        onClick={() => {
                          setView(child.id);
                          setIsMobileOpen(false);
                        }}
                        className={`
                          w-full text-left py-2.5 px-4 rounded-lg text-xs transition-all flex justify-between items-center
                          ${isChildActive 
                            ? 'text-stone-900 bg-stone-50 font-medium' 
                            : 'text-stone-500 hover:text-stone-900 hover:bg-stone-50'}
                        `}
                      >
                        <span className="truncate">{child.label}</span>
                        {child.badge ? (
                          <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full ml-2 shadow-sm">
                            {child.badge}
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer / Profile */}
      <div className="p-4 border-t border-stone-100 bg-stone-50/50">
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
          {userProfile.photo ? (
             <img src={userProfile.photo} alt="User Avatar" className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm" />
          ) : (
             <div className="w-9 h-9 rounded-full bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center text-stone-600 font-bold text-xs border-2 border-white shadow-sm">
               {userInitials}
             </div>
          )}
          {!isCollapsed && (
            <div className="flex-1 overflow-hidden">
              <div className="text-[13px] font-bold text-stone-900 truncate">
                {userProfile.firstName} {userProfile.lastName}
              </div>
              <div className="text-[10px] text-stone-500 truncate font-medium">{organization.name}</div>
            </div>
          )}
        </div>
        
        <div className={`mt-4 flex ${isCollapsed ? 'justify-center' : 'justify-end'}`}>
            <AnimatedButton 
                text="Logout"
                icon={<LogOut size={18} />}
                onClick={onLogout}
                variant="danger"
                width={isCollapsed ? '45px' : '110px'} 
            />
        </div>
      </div>
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeView, 
  setView, 
  onLogout, 
  currentRole, 
  notificationCount,
  isCollapsed,
  toggleCollapse,
  isMobileOpen,
  setIsMobileOpen,
  userProfile,
  organization
}) => {
  
  const [expandedMenu, setExpandedMenu] = useState<string | null>('governance');

  const menuStructure: MenuItem[] = useMemo(() => [
    {
      id: 'governance',
      label: 'Control Tower',
      description: 'Proof Infrastructure',
      icon: LayoutDashboard,
      children: [
        { id: 'dashboard', label: 'Overview' },
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
      description: 'Truth Infrastructure',
      icon: Layers,
      children: [
        { id: 'aem', label: 'AEM Event Model™' },
        { id: 'aos', label: 'AOS Operating System™' },
        { id: 'ars', label: 'ARS Reliability™' },
        { id: 'ags', label: 'AGS Scorecard™' },
      ]
    },
    {
      id: 'products',
      label: 'Products',
      description: 'Commercial Modules',
      icon: Package,
      children: [
          { id: 'products-guest', label: 'Guest Experience' },
          { id: 'products-revenue', label: 'Revenue Gen' },
          { id: 'products-ops', label: 'Operational Efficiency' },
          { id: 'products-response', label: 'Incident Response' },
          { id: 'conversations', label: 'Conversations' },
      ]
    },
    {
      id: 'settings',
      label: 'Settings',
      description: 'Configuration',
      icon: Settings,
      children: [
        { id: 'settings-profile', label: 'Profile' },
        { id: 'settings-org', label: 'Organization' },
        { id: 'settings-activation', label: 'Activation' },
        { id: 'settings-notifications', label: 'Notifications' },
        { id: 'settings-billing', label: 'Billing' },
        { id: 'documentation', label: 'Documentation' },
        { id: 'support', label: 'Support' },
      ]
    }
  ], []);

  useEffect(() => {
    const parent = menuStructure.find(item => item.children.some(child => child.id === activeView));
    if (parent && !isCollapsed) {
      setExpandedMenu(parent.id);
    }
  }, [activeView, isCollapsed, menuStructure]);

  const handleParentClickWrapper = (id: string | null) => {
    if (isCollapsed && id) {
       toggleCollapse();
       setExpandedMenu(id);
    } else {
       setExpandedMenu(id);
    }
  };

  const contentProps = {
    menuStructure,
    activeView,
    setView,
    onLogout,
    currentRole,
    expandedMenu,
    setExpandedMenu: handleParentClickWrapper,
    setIsMobileOpen,
    userProfile,
    organization
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col fixed left-0 top-0 h-screen z-50 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${isCollapsed ? 'w-24' : 'w-72'}`}>
        <SidebarContent {...contentProps} isCollapsed={isCollapsed} />
        {/* Collapse Toggle */}
        <button 
          onClick={toggleCollapse}
          className="absolute -right-3 top-20 bg-white border border-stone-200 rounded-full p-1.5 shadow-lg text-stone-400 hover:text-armonyco-gold transition-all z-50 hover:scale-110"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </aside>

      {/* Mobile Sidebar (Drawer) */}
      <div className={`md:hidden fixed inset-0 z-50 transition-transform duration-300 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="absolute inset-0 bg-stone-900/20 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
        <div className="relative w-72 h-full shadow-2xl">
          <SidebarContent {...contentProps} isCollapsed={false} />
        </div>
      </div>
    </>
  );
};