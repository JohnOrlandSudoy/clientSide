import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AuthView } from './components/AuthView';
import { ProfileView } from './components/ProfileView';
import { initializeStorage } from './utils/storage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    initializeStorage();
  }, []);

  const handleAuthenticate = (id: string) => {
    setUserId(id);
    setIsAuthenticated(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      {!isAuthenticated ? (
        <AuthView onAuthenticate={handleAuthenticate} />
      ) : (
        <ProfileView userId={userId} />
      )}

      <Footer />
    </div>
  );
}

export default App;
