import React from 'react';
import { useCompare } from '../contexts/CompareContext';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Scale } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const CompareDock: React.FC = () => {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show dock on the actual compare page
  if (location.pathname === '/compare') return null;
  if (compareList.length === 0) return null;

  return (
    <AnimatePresence>
      <div className="fixed bottom-0 left-0 w-full z-[40] pointer-events-none flex justify-center pb-6 px-4">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="pointer-events-auto bg-surface/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-4 w-full max-w-2xl flex items-center gap-4"
        >
          {/* Header / Icon */}
          <div className="hidden md:flex flex-col items-center justify-center px-4 border-r border-white/10">
            <Scale className="w-6 h-6 text-copper mb-1" />
            <span className="text-[10px] text-silver uppercase tracking-wider font-bold">
              {compareList.length} / 3
            </span>
          </div>

          {/* Thumbnails */}
          <div className="flex-1 flex items-center gap-3 overflow-x-auto no-scrollbar">
            <AnimatePresence>
              {compareList.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="relative group shrink-0"
                >
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden border border-border group-hover:border-copper transition-colors">
                    <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                  </div>
                  <button
                    onClick={() => removeFromCompare(product.id)}
                    className="absolute -top-2 -right-2 bg-slate-900 text-white rounded-full p-0.5 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {/* Empty slots placeholders */}
            {[...Array(3 - compareList.length)].map((_, i) => (
              <div key={i} className="w-12 h-12 md:w-16 md:h-16 rounded-lg border border-dashed border-white/10 flex items-center justify-center shrink-0">
                <span className="text-white/10 text-xs">{i + 1 + compareList.length}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pl-4 border-l border-white/10">
            <button 
              onClick={clearCompare}
              className="hidden md:block text-xs text-silver hover:text-white transition-colors"
            >
              {t('compare.clear_all')}
            </button>
            <button
              onClick={() => navigate('/compare')}
              disabled={compareList.length < 2}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                compareList.length >= 2 
                  ? 'copper-gradient text-white shadow-lg shadow-copper/20 hover:scale-105' 
                  : 'bg-slate-700 text-silver cursor-not-allowed'
              }`}
            >
              {t('compare.compare_now')}
              <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CompareDock;