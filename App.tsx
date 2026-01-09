import React, { useState, useEffect, useCallback } from 'react';
import { LandingPage } from './pages/LandingPage';
import { SolutionsPage } from './pages/SolutionsPage';
import { WebApp } from './pages/WebApp';
import { PaymentSuccess } from './pages/payment/PaymentSuccess';
import { PaymentCancel } from './pages/payment/PaymentCancel';
import { PaymentFailed } from './pages/payment/PaymentFailed';
import { ResetPassword } from './pages/ResetPassword';
import { validateConfig } from './src/config/api.config';
import { getSession, onAuthStateChange, signOut, User } from './src/lib/supabase';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth and listen for changes
  useEffect(() => {
    validateConfig();

    // Check for existing session
    const initAuth = async () => {
      try {
        const session = await getSession();
        if (session?.user) {
          setIsAuthenticated(true);
          setUserData({
            userProfile: {
              id: session.user.id,
              firstName: session.user.user_metadata?.full_name?.split(' ')[0] || '',
              lastName: session.user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
              email: session.user.email || '',
              phone: '',
              photo: session.user.user_metadata?.avatar_url || null,
              role: 'Executive',
              credits: 0,
            }
          });
        }
      } catch (err) {
        console.error('[Auth] Session check failed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Subscribe to auth state changes (handles OAuth redirects)
    const { data: { subscription } } = onAuthStateChange((event, session) => {
      console.log('[Auth] State change:', event);

      if (event === 'SIGNED_IN' && session?.user) {
        setIsAuthenticated(true);
        setUserData({
          userProfile: {
            id: session.user.id,
            firstName: session.user.user_metadata?.full_name?.split(' ')[0] || '',
            lastName: session.user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
            email: session.user.email || '',
            phone: '',
            photo: session.user.user_metadata?.avatar_url || null,
            role: 'Executive',
            credits: 0,
          }
        });
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setUserData(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  type ViewState = 'landing' | 'solutions' | 'solutions-pm' | 'solutions-ins' | 'solutions-inv' | 'solutions-ent' | 'payment-success' | 'payment-cancel' | 'payment-failed' | 'reset-password';
  const [currentView, setCurrentView] = useState<ViewState>(() => {
    // Check URL path to determine initial view
    const path = window.location.pathname;
    if (path.includes('/payment/success')) return 'payment-success';
    if (path.includes('/payment/cancel')) return 'payment-cancel';
    if (path.includes('/payment/failed')) return 'payment-failed';
    if (path.includes('/reset-password')) return 'reset-password';
    return 'landing';
  });

  const handleLogin = useCallback((data?: any) => {
    // For backward compatibility with email login flow
    setUserData(data?.user ? { userProfile: data.user } : data);
    setIsAuthenticated(true);
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('[Auth] Logout failed:', err);
    }
    setIsAuthenticated(false);
    setUserData(null);
    setCurrentView('landing');
  }, []);

  // Show loading state while checking session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          <span className="text-zinc-400 text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <WebApp onLogout={handleLogout} initialData={userData} />;
  }

  const handleNavigateSection = (sectionId: string) => {
    if (sectionId.startsWith('card-') || sectionId === 'solutions-teaser' || ['governance', 'core', 'manifesto', 'faq'].includes(sectionId)) {
      setCurrentView('landing');
    }

    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const renderSolutionsView = () => {
    const parts = currentView.split('-');
    const industry = parts.length > 1 ? (parts[1] as any) : undefined;
    return (
      <SolutionsPage
        onLogin={handleLogin}
        onBack={() => setCurrentView('landing')}
        industry={industry}
        onNavigateIndustry={(ind: any) => {
          if (ind) {
            setCurrentView(`solutions-${ind}` as any);
          } else {
            setCurrentView('solutions' as any);
          }
        }}
        onNavigateSection={handleNavigateSection}
      />
    );
  };

  // Render payment pages
  if (currentView === 'payment-success') {
    return (
      <PaymentSuccess 
        onComplete={() => {
          setIsAuthenticated(true);
          setCurrentView('landing');
        }}
      />
    );
  }

  if (currentView === 'payment-cancel') {
    return (
      <PaymentCancel
        onRetry={() => setCurrentView('landing')}
        onGoHome={() => setCurrentView('landing')}
      />
    );
  }

  if (currentView === 'payment-failed') {
    return (
      <PaymentFailed
        onRetry={() => setCurrentView('landing')}
        onGoHome={() => setCurrentView('landing')}
      />
    );
  }

  if (currentView === 'reset-password') {
    return (
      <ResetPassword
        onSuccess={() => {
          // User has been signed out in ResetPassword component
          // Auth state change listener will handle the logout
          setCurrentView('landing');
        }}
        onError={() => setCurrentView('landing')}
      />
    );
  }

  return (
    <>
      {currentView === 'landing' ? (
        <LandingPage
          onLogin={handleLogin}
          onNavigateSolutions={(ind) => {
            if (ind) {
              setCurrentView(`solutions-${ind}` as any);
            } else {
              setCurrentView('solutions' as any);
            }
          }}
          onNavigateSection={handleNavigateSection}
        />
      ) : renderSolutionsView()}
    </>
  );
};

export default App;