import React, { useEffect, useState } from 'react';
import LandingPage from './pages/LandingPage';
import AdminUsers from './pages/AdminUsers';

const resolvePath = () => {
  if (typeof window === 'undefined') {
    return '/';
  }
  return window.location.pathname || '/';
};

const shouldRenderAdmin = (path) => path === '/admin' || path.startsWith('/admin/');

function App() {
  const [currentPath, setCurrentPath] = useState(resolvePath);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(resolvePath());
    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', handlePopState);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('popstate', handlePopState);
      }
    };
  }, []);

  const navigate = (nextPath) => {
    if (typeof window === 'undefined') {
      setCurrentPath(nextPath);
      return;
    }
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, '', nextPath);
    }
    setCurrentPath(nextPath);
  };

  const PageComponent = shouldRenderAdmin(currentPath) ? AdminUsers : LandingPage;
  return <PageComponent onNavigate={navigate} />;
}

export default App;
