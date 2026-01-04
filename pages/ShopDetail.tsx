import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { backend } from '../services/backend';
import { Seller, Product } from '../types';
import { Loader2, MapPin, ShieldCheck, Search, Filter, Box, Share2, Check, QrCode, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ShopDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [shop, setShop] = useState<Seller | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [linkCopied, setLinkCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  useEffect(() => {
    const fetchShopData = async () => {
      setLoading(true);
      if (id) {
        // Parallel fetch for shop details and their products
        const [shopData, productsData] = await Promise.all([
          backend.getShopById(id),
          backend.getProducts({ category: 'all', conditions: [] }, 'newest', id)
        ]);
        
        setShop(shopData);
        setProducts(productsData);
      }
      setLoading(false);
    };
    fetchShopData();
  }, [id]);

  const handleShareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-void flex flex-col items-center justify-center text-silver">
        <Loader2 className="w-10 h-10 animate-spin text-copper mb-4" />
        <p>Loading Storefront...</p>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Shop Not Found</h2>
          <Link to="/shops" className="text-copper hover:underline">Browse Suppliers</Link>
        </div>
      </div>
    );
  }

  const shopQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(window.location.href)}&bgcolor=1e293b&color=ffffff&margin=10`;

  return (
    <div className="min-h-screen bg-void pb-20">
      <Navbar />

      {/* Hero Banner */}
      <div className="relative h-64 md:h-80 w-full bg-slate-900 overflow-hidden">
        {shop.banner && (
          <img 
            src={shop.banner} 
            alt="Shop Banner" 
            className="w-full h-full object-cover opacity-60"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-void to-transparent"></div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        
        {/* Shop Header */}
        <div className="flex flex-col md:flex-row items-end gap-6 mb-12 relative">
           <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl border-4 border-void bg-surface shadow-2xl overflow-hidden shrink-0">
              <img src={shop.logo || 'https://via.placeholder.com/200'} alt={shop.name} className="w-full h-full object-cover" />
           </div>
           
           <div className="flex-1 pb-2">
              <div className="flex items-center gap-2 mb-1">
                 <h1 className="text-3xl md:text-4xl font-display font-bold text-white">{shop.name}</h1>
                 {shop.isVerified && <ShieldCheck className="w-6 h-6 text-blue-500" />}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-silver text-sm mb-4">
                 <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {shop.location}</span>
                 <span className="w-1 h-1 bg-silver rounded-full"></span>
                 <span>Member since {shop.memberSince}</span>
                 <span className="w-1 h-1 bg-silver rounded-full"></span>
                 <span className="text-copper font-medium">Official Resca Supplier</span>
                 <span className="w-1 h-1 bg-silver rounded-full"></span>
                 <span className="font-mono text-silver/50">ID: #{shop.id}</span>
              </div>
              <p className="text-white/80 max-w-2xl">{shop.description}</p>
           </div>

           {/* Share Buttons */}
           <div className="absolute top-0 right-0 md:relative md:top-auto md:right-auto self-end md:self-auto mb-4 md:mb-2 flex gap-2">
             <button 
               onClick={() => setShowQrModal(true)}
               className="flex items-center justify-center p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-colors"
               title="Show Shop QR Code"
             >
               <QrCode className="w-4 h-4" />
             </button>
             <button 
               onClick={handleShareLink}
               className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white text-sm font-medium transition-colors"
             >
               {linkCopied ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" /> Copied
                  </>
               ) : (
                  <>
                    <Share2 className="w-4 h-4" /> Share Shop
                  </>
               )}
             </button>
           </div>
        </div>

        {/* Shop Content */}
        <div className="flex flex-col lg:flex-row gap-8">
           
           {/* Sidebar Filters (Simplified for Shop) */}
           <div className="w-full lg:w-64 shrink-0 space-y-6">
              <div className="glass-panel p-5 rounded-xl border border-white/5">
                 <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                   <Filter className="w-4 h-4 text-copper" /> Shop Categories
                 </h3>
                 <ul className="space-y-2 text-sm text-silver">
                    <li className="flex items-center justify-between p-2 rounded hover:bg-white/5 cursor-pointer text-copper font-medium">
                      <span>All Items</span>
                      <span className="bg-copper/20 text-copper px-2 rounded-full text-xs">{products.length}</span>
                    </li>
                    <li className="flex items-center justify-between p-2 rounded hover:bg-white/5 cursor-pointer">
                      <span>Cooking Equipment</span>
                      <span className="bg-slate-800 text-silver px-2 rounded-full text-xs">
                        {products.filter(p => p.category === 'cooking_equipment').length}
                      </span>
                    </li>
                    <li className="flex items-center justify-between p-2 rounded hover:bg-white/5 cursor-pointer">
                      <span>Beverage</span>
                      <span className="bg-slate-800 text-silver px-2 rounded-full text-xs">
                         {products.filter(p => p.category === 'beverage').length}
                      </span>
                    </li>
                 </ul>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                 <h4 className="font-bold text-blue-400 mb-2 text-sm flex items-center gap-2">
                   <ShieldCheck className="w-4 h-4" /> Warranty Guaranteed
                 </h4>
                 <p className="text-xs text-blue-200 leading-relaxed">
                   All items sold by {shop.name} are brand new and come with a minimum 1-year manufacturer warranty.
                 </p>
              </div>
           </div>

           {/* Product Grid */}
           <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                 <h2 className="text-xl font-bold text-white flex items-center gap-2">
                   <Box className="w-5 h-5 text-silver" /> New Arrivals
                 </h2>
                 
                 {/* Mini Search */}
                 <div className="relative w-64 hidden sm:block">
                    <input 
                      type="text" 
                      placeholder={`Search ${shop.name}...`}
                      className="w-full bg-surface border border-border rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:border-copper outline-none"
                    />
                    <Search className="w-4 h-4 text-silver absolute left-3 top-2.5" />
                 </div>
              </div>

              {products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {products.map(product => (
                     <ProductCard key={product.id} product={product} />
                   ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-surface/30 rounded-2xl border border-white/5">
                   <p className="text-silver">No products found in this category.</p>
                </div>
              )}
           </div>
        </div>

      </main>

      {/* Shop QR Modal */}
      <AnimatePresence>
        {showQrModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="absolute inset-0 bg-black/80 backdrop-blur-sm"
               onClick={() => setShowQrModal(false)}
             ></motion.div>

             <motion.div
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="relative glass-panel rounded-2xl w-full max-w-sm p-8 border border-white/10 shadow-2xl flex flex-col items-center text-center"
             >
                <button 
                  onClick={() => setShowQrModal(false)}
                  className="absolute top-4 right-4 text-silver hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="bg-white p-3 rounded-2xl shadow-xl mb-4">
                   <img src={shopQrUrl} alt="Shop QR" className="w-48 h-48" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-1">{shop.name}</h3>
                <p className="text-copper font-bold text-xs tracking-widest">OFFICIAL STORE QR</p>
                <p className="text-silver text-xs mt-4">Scan to visit this supplier on mobile.</p>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShopDetail;