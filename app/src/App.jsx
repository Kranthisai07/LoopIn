import React, { useState } from 'react';
import Welcome from './pages/Welcome';
import Explore from './pages/Explore';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import News from './pages/News';
import NavBar from './components/NavBar';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function AppContent() {
  const [currentView, setCurrentView] = useState('news');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const { currentUser } = useAuth();

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(current => current === 'dark' ? 'light' : 'dark');
  };

  if (!currentUser) {
    return <Welcome />;
  }

  // Simple view router
  const renderView = () => {
    switch (currentView) {
      // Explore/Feed etc usually need a user. 
      // We can redirect 'welcome' to 'feed' automatically if logged in, handled by the early return above.
      case 'welcome': return <Feed />;
      case 'explore': return <Explore />;
      case 'news': return <News />;
      case 'feed': return <Feed />;
      case 'profile': return <Profile theme={theme} toggleTheme={toggleTheme} />;
      default: return <Feed />;
    }
  };

  return (
    <div className="app-container">
      {renderView()}
      <NavBar currentView={currentView} setView={setCurrentView} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
