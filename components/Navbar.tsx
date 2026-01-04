import React, { useState } from 'react';
import { ChefHat, Search, Menu, User, ShoppingBag, Globe, Heart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useWishlist } from '../contexts/WishlistContext';
import { Language } from '../constants/translations';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { t, language, setLanguage } = useLanguage();
  const { wishlistIds } = useWishlist();
  const [showLangMenu, setShowLangMenu] = useState(false);
  
  return (
    <nav className="fixed top-0 w-full z-50 glass-panel border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-copper to-orange-700 rounded-lg flex items-center justify-center shadow-lg shadow-orange-900/50 group-hover:shadow-orange-600/50 transition-all duration-300">
              <ChefHat className="text-white w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl tracking-wide text-white">RESCA</span>
              <span className="text-[10px] text-silver uppercase tracking-[0.2em]">Kitchen Queen</span>
            </div>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-silver group-focus-within:text-copper transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2.5 bg-surface border border-border rounded-xl leading-5 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-slate-900 focus:ring-1 focus:ring-copper focus:border-copper sm:text-sm transition-all duration-300"
                placeholder={t('common.search_placeholder')}
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-6">
            
            {/* Language Switcher */}
            <div className="relative">
              <button 
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1 text-silver hover:text-white transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span className="uppercase text-xs font-bold">{language}</span>
              </button>
              
              <AnimatePresence>
                {showLangMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowLangMenu(false)}></div>
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-8 w-32 bg-surface border border-border rounded-xl overflow-hidden shadow-2xl z-20"
                    >
                      {(['en', 'am', 'ar'] as Language[]).map((lang) => (
                        <button
                          key={lang}
                          onClick={() => {
                            setLanguage(lang);
                            setShowLangMenu(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors ${language === lang ? 'text-copper font-bold' : 'text-silver'}`}
                        >
                          {lang === 'en' ? 'English' : lang === 'am' ? 'አማርኛ' : 'العربية'}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <Link to="/marketplace" className={`hidden md:block text-sm font-medium hover:text-white transition-colors ${location.pathname === '/marketplace' ? 'text-copper' : 'text-silver'}`}>
              {t('nav.marketplace')}
            </Link>

            <Link to="/shops" className={`hidden md:block text-sm font-medium hover:text-white transition-colors ${location.pathname.startsWith('/shop') ? 'text-copper' : 'text-silver'}`}>
              {t('nav.shops')}
            </Link>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Link to="/login" className="text-sm font-medium text-silver hover:text-white transition-colors">
                {t('nav.login')}
              </Link>
              <Link to="/register" className="px-5 py-2 text-sm font-bold text-white copper-gradient rounded-xl shadow-lg shadow-copper/20 hover:scale-105 transition-transform">
                {t('nav.register')}
              </Link>
            </div>

            {/* Separator for demo controls */}
            <div className="hidden md:block h-6 w-px bg-white/10"></div>

            {/* User/Cart Icons */}
            <div className="hidden md:flex items-center gap-4">
              {/* Wishlist Icon */}
              <button className="relative text-silver hover:text-red-500 transition-colors">
                <Heart className={`w-5 h-5 ${wishlistIds.length > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                {wishlistIds.length > 0 && (
                   <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>

              <Link to="/dashboard" className={`hover:text-white transition-colors ${location.pathname === '/dashboard' ? 'text-copper' : 'text-silver'}`} title={t('nav.dashboard')}>
                <User className="w-5 h-5" />
              </Link>
              <button className="relative text-silver hover:text-copper transition-colors">
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-copper rounded-full"></span>
              </button>
            </div>
            
            {/* Mobile Menu */}
            <button className="md:hidden text-silver">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;