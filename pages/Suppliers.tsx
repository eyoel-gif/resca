import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { backend } from '../services/backend';
import { Seller } from '../types';
import { Loader2, MapPin, Star, ShieldCheck, ArrowRight, Store } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Suppliers: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuppliers = async () => {
      setLoading(true);
      try {
        const data = await backend.getSuppliers();
        setSuppliers(data);
      } catch (error) {
        console.error("Failed to fetch suppliers", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSuppliers();
  }, []);

  return (
    <div className="min-h-screen bg-void pb-20">
      <Navbar />
      
      <main className="pt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
             <Store className="w-4 h-4 text-blue-400" />
             <span className="text-xs font-medium text-blue-400 uppercase tracking-wider">Official Partners</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Official Kitchen Suppliers
          </h1>
          <p className="text-xl text-silver max-w-2xl">
            Source brand new, warranty-backed equipment directly from Ethiopia's top importers and manufacturers.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-silver">
            <Loader2 className="w-10 h-10 animate-spin text-copper mb-4" />
            <p>Loading Official Shops...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {suppliers.map((supplier) => (
              <motion.div
                key={supplier.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className="group relative bg-surface border border-border rounded-2xl overflow-hidden hover:border-copper/50 transition-all duration-300"
              >
                {/* Banner Background */}
                <div className="h-32 bg-slate-900 relative">
                   {supplier.banner && (
                     <img src={supplier.banner} alt="" className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity" />
                   )}
                   <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/50 to-transparent"></div>
                </div>

                <div className="px-6 pb-6 relative -mt-12">
                   <div className="flex items-end justify-between mb-4">
                      {/* Logo */}
                      <div className="w-24 h-24 rounded-xl border-4 border-surface bg-slate-800 overflow-hidden shadow-lg">
                         <img src={supplier.logo || 'https://via.placeholder.com/150'} alt={supplier.name} className="w-full h-full object-cover" />
                      </div>
                      
                      {/* Rating Badge */}
                      <div className="mb-2 flex items-center gap-1 bg-black/40 backdrop-blur px-2 py-1 rounded-lg border border-white/10">
                         <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                         <span className="text-white font-bold text-sm">{supplier.rating}</span>
                      </div>
                   </div>

                   <div>
                      <h3 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                        {supplier.name}
                        {supplier.isVerified && <ShieldCheck className="w-5 h-5 text-blue-500" />}
                      </h3>
                      <div className="flex items-center gap-2 text-silver text-sm mb-4">
                        <MapPin className="w-3 h-3" /> {supplier.location}
                        <span>•</span>
                        <span>Since {supplier.memberSince}</span>
                      </div>
                      
                      <p className="text-silver/80 text-sm mb-6 line-clamp-2">
                        {supplier.description}
                      </p>

                      <Link 
                        to={`/shop/${supplier.id}`}
                        className="inline-flex w-full items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:bg-copper hover:border-copper transition-all group-hover:shadow-lg"
                      >
                         Visit Official Store <ArrowRight className="w-4 h-4" />
                      </Link>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
};

export default Suppliers;