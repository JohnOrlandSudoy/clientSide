import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AuthView } from './components/AuthView';
import { PublicProfileView } from './components/PublicProfileView';
import { PrivateProfileEdit } from './components/PrivateProfileEdit';
import { initializeStorage } from './utils/storage';

function App() {
  useEffect(() => {
    initializeStorage();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header />
        
        <Routes>
          <Route path="/" element={<AuthView />} />
          <Route path="/myprofile/:uniqueCode" element={<PublicProfileView />} />
          <Route path="/edit/:uniqueCode" element={<PrivateProfileEdit />} />
        </Routes>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;
