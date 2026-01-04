
import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Hero from './components/Hero';
import Marketplace from './pages/Marketplace';
import ProductDetail from './pages/ProductDetail';
import Dashboard from './pages/Dashboard';
import Sell from './pages/Sell';
import Auth from './pages/Auth';
import Compare from './pages/Compare';
import Receipt from './pages/Receipt';
import DeliverySetup from './pages/DeliverySetup';
import Suppliers from './pages/Suppliers';
import ShopDetail from './pages/ShopDetail';
import Navbar from './components/Navbar';
import CompareDock from './components/CompareDock';
import AiAssistant from './components/AiAssistant';
import Footer from './components/Footer';
import { LanguageProvider } from './contexts/LanguageContext';
import { CompareProvider } from './contexts/CompareContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { AuthProvider } from './contexts/AuthContext';

// Wrapper to conditionally render Hero on home page only
const Home = () => {
  return (
    <div className="min-h-screen bg-void">
      <Navbar />
      <Hero />
    </div>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <WishlistProvider>
          <CompareProvider>
            <Router>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/shops" element={<Suppliers />} />
                <Route path="/shop/:id" element={<ShopDetail />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/receipt/:id" element={<Receipt />} />
                <Route path="/delivery/:orderId" element={<DeliverySetup />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/sell" element={<Sell />} />
                <Route path="/login" element={<Auth mode="login" />} />
                <Route path="/register" element={<Auth mode="register" />} />
                <Route path="/compare" element={<Compare />} />
              </Routes>
              <Footer />
              <CompareDock />
              <AiAssistant />
            </Router>
          </CompareProvider>
        </WishlistProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;