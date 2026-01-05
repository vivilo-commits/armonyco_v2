import React, { useState } from 'react';
import { LandingPage } from './pages/LandingPage';
import { SolutionsPage } from './pages/SolutionsPage';
import { WebApp } from './pages/WebApp';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  type ViewState = 'landing' | 'solutions' | 'solutions-pm' | 'solutions-ins' | 'solutions-inv' | 'solutions-ent';
  const [currentView, setCurrentView] = useState<ViewState>('landing');

  const handleLogin = (data?: any) => {
    setUserData(data);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserData(null);
    setCurrentView('landing');
  };

  if (isAuthenticated) {
    return <WebApp onLogout={handleLogout} initialData={userData} />;
  }

  const handleNavigateSection = (sectionId: string) => {
    // If we're navigating to a section that exists only on landing, ensure we're there
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