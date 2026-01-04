import React from 'react';
import { ChefHat, ArrowRight, Instagram, Twitter, Facebook, Mail, Phone, MapPin, Star, Globe, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t, isRTL } = useLanguage();

  return (
    <footer className="relative bg-void border-t border-white/5 pt-10">
      
      {/* Advertisement Banner: City Movers */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-800 to-slate-900 border border-white/10 p-8 md:p-12 shadow-2xl">
          {/* Abstract Background Shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-copper/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row items-center gap-4 justify-center md:justify-start">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
                  City Movers
                </h2>
                <div className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/30 px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  <span className="text-yellow-200 font-bold text-sm">4.5</span>
                  <span className="text-xs text-silver ml-1">(Star rating)</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-3 text-silver text-sm md:text-base">
                 <div className="flex items-center justify-center md:justify-start gap-2">
                    <MapPin className="w-4 h-4 text-blue-400" /> 
                    <span>Bole, Addis Ababa</span>
                 </div>
                 <div className="flex items-center justify-center md:justify-start gap-2">
                    <Phone className="w-4 h-4 text-blue-400" /> 
                    <span>+251 93 845 8888</span>
                 </div>
                 <div className="flex items-center justify-center md:justify-start gap-2">
                    <Clock className="w-4 h-4 text-red-400" /> 
                    <span className="text-red-300 font-medium">Closed · Opens Sunday 9:00 AM</span>
                 </div>
              </div>
            </div>
            
            <a 
              href="https://citymoverset.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 font-bold rounded-xl shadow-xl hover:scale-105 transition-transform whitespace-nowrap"
            >
              <Globe className="w-5 h-5" />
              Visit citymoverset.com
              <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-surface border border-border rounded-lg flex items-center justify-center transition-all duration-300">
                <ChefHat className="text-white w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-xl tracking-wide text-white">RESCA</span>
                <span className="text-[10px] text-silver uppercase tracking-[0.2em]">Kitchen Queen</span>
              </div>
            </Link>
            <p className="text-silver text-sm leading-relaxed">
              Resca is Ethiopia's premier digital marketplace for the HoReCa industry, bridging the gap between professional kitchens and high-quality equipment.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-surface rounded-full text-silver hover:text-copper hover:bg-white/5 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-surface rounded-full text-silver hover:text-copper hover:bg-white/5 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-surface rounded-full text-silver hover:text-copper hover:bg-white/5 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-white font-bold mb-6">Marketplace</h3>
            <ul className="space-y-4 text-sm text-silver">
              <li><Link to="/marketplace" className="hover:text-copper transition-colors">All Equipment</Link></li>
              <li><Link to="/marketplace" className="hover:text-copper transition-colors">Commercial Ovens</Link></li>
              <li><Link to="/marketplace" className="hover:text-copper transition-colors">Refrigeration</Link></li>
              <li><Link to="/marketplace" className="hover:text-copper transition-colors">Verified Sellers</Link></li>
              <li><Link to="/compare" className="hover:text-copper transition-colors">Compare Items</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-6">Contact</h3>
            <ul className="space-y-4 text-sm text-silver">
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-copper" />
                <span>Bole Medhanialem, Addis Ababa</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-copper" />
                <span>+251 911 000 000</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-copper" />
                <span>support@resca.et</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-bold mb-6">{t('footer.newsletter_title')}</h3>
            <p className="text-silver text-sm mb-4">{t('footer.newsletter_desc')}</p>
            <form className="flex flex-col gap-2">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-copper"
              />
              <button className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold py-3 rounded-xl text-sm transition-colors">
                {t('footer.subscribe')}
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-silver">
          <p>&copy; {new Date().getFullYear()} Resca. {t('footer.rights')}</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;