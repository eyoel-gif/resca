import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { CATEGORIES } from '../constants';
import { backend } from '../services/backend';
import { Product, FilterState, SortOption, ConditionGrade } from '../types';
import { 
  Filter, SlidersHorizontal, ArrowDownUp, Loader2, 
  ChefHat, Coffee, UtensilsCrossed, ThermometerSnowflake, 
  LayoutGrid, Armchair, Hammer, Soup, Check, ChevronDown, X, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORY_META: Record<string, { icon: React.ElementType, desc: string }> = {
  all: { icon: LayoutGrid, desc: 'Entire Inventory' },
  cooking_equipment: { icon: ChefHat, desc: 'Ovens, Ranges, Fryers' },
  refrigeration: { icon: ThermometerSnowflake, desc: 'Freezers, Ice Machines' },
  food_prep: { icon: UtensilsCrossed, desc: 'Mixers, Slicers' },
  beverage: { icon: Coffee, desc: 'Espresso, Juicers' },
  furniture: { icon: Armchair, desc: 'Tables, Booths' },
  work_tables: { icon: Hammer, desc: 'Sinks, Prep Tables' },
  smallwares: { icon: Soup, desc: 'Pots, Pans, Tools' },
};

const CONDITIONS: ConditionGrade[] = ['New', 'Refurbished', 'Used (Good)', 'Used (Fair)'];

const Marketplace: React.FC = () => {
  // State
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    conditions: [],
    onlyVerified: false
  });
  const [sort, setSort] = useState<SortOption>('newest');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // UI Toggles
  const [showFilters, setShowFilters] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Fetch Data
  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await backend.getProducts(filters, sort);
        if (isMounted) {
          setProducts(data);
        }
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [filters, sort]);

  // Handlers
  const handleCategoryChange = (catId: string) => {
    setFilters(prev => ({ ...prev, category: catId }));
  };

  const handleConditionToggle = (condition: ConditionGrade) => {
    setFilters(prev => {
      const current = prev.conditions;
      if (current.includes(condition)) {
        return { ...prev, conditions: current.filter(c => c !== condition) };
      } else {
        return { ...prev, conditions: [...current, condition] };
      }
    });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => {
    const val = e.target.value ? parseInt(e.target.value) : undefined;
    setFilters(prev => ({ 
      ...prev, 
      [type === 'min' ? 'minPrice' : 'maxPrice']: val 
    }));
  };

  const clearFilters = () => {
    setFilters({ category: filters.category, conditions: [], minPrice: undefined, maxPrice: undefined, onlyVerified: false });
  };

  return (
    <div className="min-h-screen bg-void pb-20">
      <Navbar />
      
      <main className="pt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="font-display text-4xl font-bold text-white mb-2">Marketplace</h1>
            <p className="text-silver">Source premium verified equipment from Addis Ababa's top hubs.</p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Filter Toggle */}
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 bg-surface border rounded-lg text-sm transition-colors ${
                showFilters || filters.conditions.length > 0 || filters.minPrice || filters.maxPrice || filters.onlyVerified
                  ? 'border-copper text-copper bg-copper/10' 
                  : 'border-border text-silver hover:text-white'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {(filters.conditions.length > 0 || filters.minPrice || filters.maxPrice || filters.onlyVerified) && (
                <span className="ml-1 w-2 h-2 rounded-full bg-copper" />
              )}
            </button>

            {/* Sort Menu */}
            <div className="relative">
              <button 
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-lg text-sm text-silver hover:text-white transition-colors"
              >
                <ArrowDownUp className="w-4 h-4" />
                Sort: <span className="text-white capitalize">{sort.replace('_', ' ')}</span>
                <ChevronDown className="w-3 h-3 ml-1" />
              </button>
              
              <AnimatePresence>
                {showSortMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowSortMenu(false)}></div>
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-12 w-48 bg-surface border border-border rounded-xl shadow-2xl z-20 overflow-hidden"
                    >
                      {[
                        { id: 'newest', label: 'Newest Listed' },
                        { id: 'price_asc', label: 'Price: Low to High' },
                        { id: 'price_desc', label: 'Price: High to Low' },
                        { id: 'views', label: 'Most Viewed' }
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => {
                            setSort(opt.id as SortOption);
                            setShowSortMenu(false);
                          }}
                          className={`w-full text-left px-4 py-3 text-sm hover:bg-white/5 transition-colors flex items-center justify-between ${
                            sort === opt.id ? 'text-copper font-medium' : 'text-silver'
                          }`}
                        >
                          {opt.label}
                          {sort === opt.id && <Check className="w-3 h-3" />}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Filters Panel (Collapsible) */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="glass-panel border border-white/10 rounded-2xl p-6">
                <div className="flex flex-col lg:flex-row gap-8">
                  
                  {/* Verified Only Toggle */}
                  <div className="flex-none lg:w-48">
                    <h3 className="text-sm font-medium text-white mb-4">Resca Assurance</h3>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-12 h-6 rounded-full p-1 transition-colors ${filters.onlyVerified ? 'bg-copper' : 'bg-slate-700'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${filters.onlyVerified ? 'translate-x-6' : ''}`}></div>
                      </div>
                      <input 
                         type="checkbox" 
                         className="hidden" 
                         checked={filters.onlyVerified}
                         onChange={(e) => setFilters({...filters, onlyVerified: e.target.checked})} 
                      />
                      <span className={`text-sm font-medium transition-colors ${filters.onlyVerified ? 'text-copper' : 'text-silver group-hover:text-white'}`}>
                        Verified Only
                      </span>
                    </label>
                    <p className="text-[10px] text-silver mt-2">
                      Show only items inspected at Resca Hubs.
                    </p>
                  </div>

                  <div className="w-px bg-white/10 hidden lg:block"></div>

                  {/* Price Range */}
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-white mb-4">Price Range (ETB)</h3>
                    <div className="flex items-center gap-4">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-2.5 text-silver text-xs">MIN</span>
                        <input 
                          type="number" 
                          placeholder="0"
                          value={filters.minPrice || ''}
                          onChange={(e) => handlePriceChange(e, 'min')}
                          className="w-full bg-slate-900 border border-border rounded-lg py-2 pl-10 pr-3 text-sm text-white focus:outline-none focus:border-copper"
                        />
                      </div>
                      <span className="text-silver">-</span>
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-2.5 text-silver text-xs">MAX</span>
                        <input 
                          type="number" 
                          placeholder="Any"
                          value={filters.maxPrice || ''}
                          onChange={(e) => handlePriceChange(e, 'max')}
                          className="w-full bg-slate-900 border border-border rounded-lg py-2 pl-10 pr-3 text-sm text-white focus:outline-none focus:border-copper"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Condition Filter */}
                  <div className="flex-[2]">
                    <h3 className="text-sm font-medium text-white mb-4">Condition</h3>
                    <div className="flex flex-wrap gap-2">
                      {CONDITIONS.map(cond => {
                        const isSelected = filters.conditions.includes(cond);
                        return (
                          <button
                            key={cond}
                            onClick={() => handleConditionToggle(cond)}
                            className={`px-4 py-2 rounded-lg text-sm border transition-all ${
                              isSelected 
                                ? 'bg-copper text-white border-copper shadow-lg shadow-copper/20' 
                                : 'bg-slate-900 text-silver border-border hover:border-white/30'
                            }`}
                          >
                            {cond}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-end">
                    <button 
                      onClick={clearFilters}
                      className="text-xs text-silver hover:text-white flex items-center gap-1 px-4 py-2"
                    >
                      <X className="w-3 h-3" /> Clear Filters
                    </button>
                  </div>

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category Section (Desktop Grid) */}
        <div className="hidden md:block mb-10">
          <h2 className="text-lg font-display font-semibold text-white mb-4">Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {CATEGORIES.map(cat => {
              const meta = CATEGORY_META[cat.id] || CATEGORY_META.all;
              const Icon = meta.icon;
              const isActive = filters.category === cat.id;
              
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`group relative flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 h-32 ${
                    isActive 
                      ? 'bg-copper/10 border-copper shadow-[0_0_15px_-3px_rgba(249,115,22,0.3)]' 
                      : 'bg-surface border-border hover:border-silver/50 hover:bg-slate-800'
                  }`}
                >
                  <div className={`p-2 rounded-full mb-2 transition-colors ${
                    isActive ? 'bg-copper text-white' : 'bg-slate-900 text-silver group-hover:text-white'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`font-medium text-xs text-center leading-tight ${isActive ? 'text-white' : 'text-silver group-hover:text-white'}`}>
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Categories (Mobile Horizontal Scroll) */}
        <div className="sticky top-20 z-40 bg-void/95 backdrop-blur-xl py-4 -mx-4 px-4 md:hidden border-b border-white/5 mb-6">
           <div className="flex overflow-x-auto gap-3 no-scrollbar pb-2">
            {CATEGORIES.map(cat => {
              const meta = CATEGORY_META[cat.id] || CATEGORY_META.all;
              const Icon = meta.icon;
              const isActive = filters.category === cat.id;
              
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-full text-xs font-medium transition-all flex-shrink-0 ${
                    isActive 
                      ? 'bg-copper text-white shadow-lg shadow-copper/20' 
                      : 'bg-surface text-silver border border-border'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {cat.name}
                </button>
              );
            })}
           </div>
        </div>

        {/* Content Area */}
        <div className="min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 text-silver">
              <Loader2 className="w-10 h-10 animate-spin text-copper mb-4" />
              <p>Loading the Kitchen World...</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-white font-medium flex items-center gap-2">
                   {filters.category === 'all' ? 'All Equipment' : CATEGORIES.find(c => c.id === filters.category)?.name}
                   <span className="px-2 py-0.5 rounded-full bg-surface border border-white/10 text-xs text-silver">
                     {products.length}
                   </span>
                 </h3>
                 {filters.onlyVerified && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-copper uppercase tracking-wider">
                       <ShieldCheck className="w-4 h-4" /> Verified Inventory
                    </span>
                 )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[minmax(100px,auto)]">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {products.length === 0 && (
                <div className="text-center py-20 bg-surface/30 rounded-3xl border border-white/5">
                  <div className="bg-slate-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-border">
                    <Filter className="w-8 h-8 text-silver" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-1">No items found</h3>
                  <p className="text-silver text-sm max-w-xs mx-auto">
                    We couldn't find any equipment matching your filters. Try adjusting the price range or condition.
                  </p>
                  <button 
                    onClick={clearFilters}
                    className="mt-6 text-copper text-sm font-medium hover:underline"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>

      </main>
    </div>
  );
};

export default Marketplace;