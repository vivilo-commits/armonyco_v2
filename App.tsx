import React, { useState } from 'react';
import { LandingPage } from './pages/LandingPage';
import { WebApp } from './pages/WebApp';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const handleLogin = (data?: any) => {
      setUserData(data);
      setIsAuthenticated(true);
  };

  const handleLogout = () => {
      setIsAuthenticated(false);
      setUserData(null);
  };

  return (
    <>
      {isAuthenticated ? (
        <WebApp onLogout={handleLogout} initialData={userData} />
      ) : (
        <LandingPage onLogin={handleLogin} />
      )}
    </>
  );
};

export default App;