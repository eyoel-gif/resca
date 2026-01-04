import React from 'react';
import Navbar from '../components/Navbar';
import { useCompare } from '../contexts/CompareContext';
import { useLanguage } from '../contexts/LanguageContext';
import { formatCurrency } from '../constants';
import { X, Flame, Scale, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Compare: React.FC = () => {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const { t } = useLanguage();
  const navigate = useNavigate();

  if (compareList.length === 0) {
    return (
      <div className="min-h-screen bg-void flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <Scale className="w-16 h-16 text-silver/20 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">{t('compare.empty_dock')}</h2>
          <Link to="/marketplace" className="text-copper hover:underline">
            Go to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  // Aggregate all unique spec keys from all selected products
  const allSpecKeys = Array.from(new Set(
    compareList.flatMap(p => Object.keys(p.specs))
  ));

  return (
    <div className="min-h-screen bg-void pb-20">
      <Navbar />
      
      <main className="pt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between mb-8">
           <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
             <Scale className="w-8 h-8 text-copper" /> {t('compare.dock_title')}
           </h1>
           <button 
             onClick={clearCompare}
             className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm font-medium"
           >
             <Trash2 className="w-4 h-4" /> {t('compare.clear_all')}
           </button>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-surface/30 shadow-2xl">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full min-w-[800px] border-collapse">
              <thead className="bg-slate-900/80">
                <tr>
                  <th className="p-6 text-left text-sm font-medium text-silver w-48 sticky left-0 bg-slate-900 z-10 border-r border-white/5">
                    Product Details
                  </th>
                  {compareList.map((product) => (
                    <th key={product.id} className="p-6 min-w-[280px] relative border-l border-white/5 align-top">
                      <button 
                        onClick={() => removeFromCompare(product.id)}
                        className="absolute top-4 right-4 text-silver hover:text-white p-1 hover:bg-white/10 rounded-full transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      
                      <div className="aspect-video w-full rounded-xl overflow-hidden mb-4 border border-border">
                        <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                      </div>
                      
                      <Link to={`/product/${product.id}`} className="hover:text-copper transition-colors">
                        <h3 className="text-lg font-bold text-white mb-2 leading-tight">{product.title}</h3>
                      </Link>
                      
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
                          {product.seller.name.substring(0, 2)}
                        </div>
                        <span className="text-xs text-silver truncate max-w-[150px]">{product.seller.name}</span>
                      </div>

                      <Link 
                        to={`/product/${product.id}`}
                        className="w-full block text-center py-3 rounded-xl copper-gradient text-white font-bold text-sm shadow-lg shadow-copper/20 hover:scale-[1.02] transition-transform"
                      >
                         View Details
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              
              <tbody className="divide-y divide-white/5">
                {/* Price Row */}
                <tr className="bg-white/2 hover:bg-white/5 transition-colors">
                  <td className="p-6 text-sm font-bold text-silver sticky left-0 bg-surface z-10 border-r border-white/5">
                    {t('compare.price_breakdown')}
                  </td>
                  {compareList.map((product) => (
                    <td key={product.id} className="p-6 border-l border-white/5">
                       <div className="space-y-1">
                          <div className="flex justify-between items-center text-xs text-silver">
                             <span>Total</span>
                             <span className="line-through">{formatCurrency(product.price)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                             <span className="text-sm font-bold text-copper">Reserve (10%)</span>
                             <span className="text-xl font-bold text-white">{formatCurrency(product.reserveAmount)}</span>
                          </div>
                       </div>
                    </td>
                  ))}
                </tr>

                {/* Condition Row */}
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-6 text-sm font-medium text-silver sticky left-0 bg-surface z-10 border-r border-white/5">
                    Condition
                  </td>
                  {compareList.map((product) => (
                    <td key={product.id} className="p-6 border-l border-white/5">
                       <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
                         product.condition === 'New' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                         'bg-blue-500/10 text-blue-400 border-blue-500/20'
                       }`}>
                         {product.condition}
                       </span>
                       {product.conditionReport && (
                         <div className="mt-2 flex items-center gap-1 text-xs text-green-500">
                           <CheckCircle2 className="w-3 h-3" /> Grade {product.conditionReport.grade} Verified
                         </div>
                       )}
                    </td>
                  ))}
                </tr>

                {/* Power Row */}
                <tr className="bg-white/2 hover:bg-white/5 transition-colors">
                   <td className="p-6 text-sm font-medium text-silver sticky left-0 bg-surface z-10 border-r border-white/5">
                    Power Source
                  </td>
                  {compareList.map((product) => (
                    <td key={product.id} className="p-6 border-l border-white/5 text-white text-sm font-medium">
                       {product.power}
                    </td>
                  ))}
                </tr>
                
                {/* Location Row */}
                <tr className="hover:bg-white/5 transition-colors">
                   <td className="p-6 text-sm font-medium text-silver sticky left-0 bg-surface z-10 border-r border-white/5">
                    Location
                  </td>
                  {compareList.map((product) => (
                    <td key={product.id} className="p-6 border-l border-white/5 text-silver text-sm">
                       {product.location}
                    </td>
                  ))}
                </tr>

                {/* Divider for Dynamic Specs */}
                <tr>
                  <td colSpan={compareList.length + 1} className="p-4 bg-slate-900/50 text-xs font-bold text-silver uppercase tracking-widest text-center border-y border-white/5">
                     {t('compare.technical_specs')}
                  </td>
                </tr>

                {/* Dynamic Specs Rows */}
                {allSpecKeys.map((key) => (
                  <tr key={key} className="hover:bg-white/5 transition-colors odd:bg-white/2">
                    <td className="p-6 text-sm font-medium text-silver sticky left-0 bg-surface z-10 border-r border-white/5">
                      {key}
                    </td>
                    {compareList.map((product) => (
                      <td key={product.id} className="p-6 border-l border-white/5 text-white text-sm">
                        {product.specs[key] || <span className="text-silver/30">-</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {compareList.length < 2 && (
           <div className="mt-8 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center gap-2 text-blue-200">
             <AlertCircle className="w-5 h-5" />
             <p>Add at least one more item to see a meaningful comparison.</p>
           </div>
        )}

      </main>
    </div>
  );
};

export default Compare;