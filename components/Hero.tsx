import React from 'react';
import { ArrowRight, Zap, Star, Flame, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

const Hero: React.FC = () => {
  const { t, isRTL } = useLanguage();

  return (
    <div className="relative min-h-[85vh] flex items-center overflow-hidden py-12 md:py-0">
      {/* Background with abstract kitchen vibe */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-void opacity-90 z-10"></div>
        {/* Simulating a blurry video background of a busy kitchen */}
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
          src="https://picsum.photos/id/431/1920/1080" 
          alt="Kitchen Background" 
          className="w-full h-full object-cover grayscale opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/50 to-transparent z-10"></div>
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
          
          {/* Main Text Content */}
          <div className="max-w-3xl lg:flex-1">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-copper/10 border border-copper/20 mb-6 backdrop-blur-md"
            >
              <Zap className="w-4 h-4 text-copper animate-pulse" />
              <span className="text-xs font-medium text-copper uppercase tracking-wider">{t('hero.tagline')}</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="font-display text-5xl md:text-7xl font-bold text-white leading-tight mb-6"
            >
              {t('hero.title_start')} <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-copper to-orange-300">
                {t('hero.title_end')}
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xl text-silver mb-8 leading-relaxed max-w-2xl"
            >
              {t('hero.subtitle')}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/marketplace" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-200 copper-gradient rounded-xl hover:shadow-[0_0_30px_-5px_rgba(249,115,22,0.4)] hover:scale-105 group">
                {t('hero.cta_browse')}
                <ArrowRight className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${isRTL ? 'ml-0 mr-2 rotate-180' : 'ml-2'}`} />
              </Link>
              <Link to="/sell" className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white transition-all duration-200 bg-surface border border-border rounded-xl hover:bg-slate-800 hover:border-silver/30 backdrop-blur-sm">
                {t('hero.cta_sell')}
              </Link>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-12 flex items-center gap-8 text-sm text-silver font-medium opacity-60"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                {t('hero.verified')}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-copper rounded-full"></div>
                {t('hero.fayda')}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-burner rounded-full"></div>
                {t('hero.phase3')}
              </div>
            </motion.div>
          </div>

          {/* Right Advertisement Banner */}
          <div className="hidden lg:block w-80 xl:w-96 shrink-0">
             <motion.div 
               initial={{ opacity: 0, x: 50, rotate: 5 }}
               animate={{ opacity: 1, x: 0, rotate: 0 }}
               transition={{ delay: 0.8, duration: 0.8, type: "spring" }}
               className="relative aspect-square w-full rounded-3xl bg-surface/40 backdrop-blur-md border border-white/10 p-1 overflow-hidden group hover:border-copper/50 transition-colors shadow-2xl"
             >
                <div className="relative h-full w-full bg-slate-900/50 rounded-[22px] overflow-hidden">
                  
                  {/* Background Image */}
                  <img 
                    src="https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=600" 
                    alt="Featured Deal" 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

                  {/* Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div className="px-3 py-1 rounded-full bg-copper text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-lg shadow-copper/20">
                        <Star className="w-3 h-3 fill-white" /> Daily Deal
                      </div>
                      <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur border border-white/10 flex items-center justify-center">
                        <Flame className="w-4 h-4 text-copper animate-pulse" />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-2xl font-display font-bold text-white mb-2 leading-tight drop-shadow-xl">
                        Rational iCombi Pro 10-Pan
                      </h3>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-xl font-bold text-copper">85,000 ETB</span>
                        <span className="text-xs text-white/90 bg-white/10 px-2 py-0.5 rounded backdrop-blur-md border border-white/5">
                          10% Reserve
                        </span>
                      </div>
                      
                      <Link to="/product/1" className="flex items-center justify-center w-full py-3.5 bg-white text-void font-bold text-sm rounded-xl hover:bg-gray-100 transition-colors shadow-lg group-hover:shadow-white/10">
                        View Listing <ArrowRight className={`w-4 h-4 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
                      </Link>
                    </div>
                  </div>
                </div>
             </motion.div>

             {/* Background Decoration for Banner */}
             <div className="absolute top-1/2 right-10 -translate-y-1/2 w-64 h-64 bg-copper/20 rounded-full blur-[100px] pointer-events-none -z-10"></div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Hero;