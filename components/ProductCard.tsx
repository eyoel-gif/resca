import React, { useState } from 'react';
import { Product } from '../types';
import { formatCurrency } from '../constants';
import { Flame, MapPin, Gauge, Lock, Scale, Check, Heart, ShieldCheck, EyeOff, QrCode, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCompare } from '../contexts/CompareContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useLanguage } from '../contexts/LanguageContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCompare, removeFromCompare, isInCompare, compareList } = useCompare();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { t } = useLanguage();
  
  const [showQr, setShowQr] = useState(false);

  const isSelected = isInCompare(product.id);
  const isWishlisted = isInWishlist(product.id);
  const isLocked = product.isLocked;

  // Logic for Bento Grid spanning
  const spanClass = product.isFeatured 
    ? 'md:col-span-2 md:row-span-2' 
    : 'col-span-1 row-span-1';

  const isAvailable = product.status === 'available';

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSelected) {
      removeFromCompare(product.id);
    } else {
      if (compareList.length < 3) addToCompare(product);
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleQrClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQr(!showQr);
  };

  const mainImage = product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/400x300?text=No+Image';
  const productUrl = `${window.location.origin}/#/product/${product.id}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(productUrl)}&bgcolor=1e293b&color=ffffff&margin=10`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={`group relative block bg-surface rounded-2xl overflow-hidden border border-border hover:border-copper/50 transition-colors duration-300 ${spanClass}`}
    >
      <Link to={`/product/${product.id}`} className="block h-full flex flex-col" aria-label={`View details for ${product.title}`}>
        {/* Image Container */}
        <div className={`relative w-full ${product.isFeatured ? 'h-64 md:h-96' : 'h-64'} overflow-hidden shrink-0`}>
          
          <AnimatePresence mode="wait">
            {!showQr ? (
              <motion.div 
                key="image"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="w-full h-full"
              >
                <motion.img 
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  src={mainImage} 
                  alt={product.title} 
                  className={`w-full h-full object-cover ${!isAvailable ? 'grayscale opacity-50' : ''}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-void/40 to-transparent"></div>
              </motion.div>
            ) : (
              <motion.div 
                key="qr"
                initial={{ opacity: 0, rotateY: 90 }} animate={{ opacity: 1, rotateY: 0 }} exit={{ opacity: 0, rotateY: 90 }}
                className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center p-4 z-20"
              >
                 <div className="bg-white p-2 rounded-xl shadow-2xl">
                    <img src={qrCodeUrl} alt="QR Code" className="w-32 h-32 md:w-48 md:h-48" />
                 </div>
                 <p className="text-copper font-bold mt-4 text-sm tracking-widest">SCAN TO VIEW</p>
                 <p className="text-silver text-xs">ID: #{product.id}</p>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Status Badge */}
          <div className="absolute top-4 left-4 z-10 flex flex-col items-start gap-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium backdrop-blur-md border ${
              isAvailable 
               ? 'bg-black/50 text-white border-white/10'
               : 'bg-red-900/80 text-white border-red-500/50'
            }`}>
              {isAvailable ? (product.conditionReport?.grade ? `Grade ${product.conditionReport.grade}` : product.condition) : product.status.toUpperCase()}
            </span>

            {product.isRescaVerified && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-copper to-orange-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-lg border border-orange-400/50"
              >
                <ShieldCheck className="w-3 h-3" /> Resca Verified
              </motion.div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2">
            {!showQr && (
              <div className="text-xs text-white/80 bg-black/40 px-2 py-1 rounded backdrop-blur-sm flex items-center gap-1 mb-1">
                <MapPin className="w-3 h-3" />
                {product.location.split(' ').slice(-2).join(' ')}
              </div>
            )}
            
            <button
              onClick={handleQrClick}
              className={`p-2 rounded-full backdrop-blur-md border transition-all duration-200 ${
                showQr
                  ? 'bg-white text-slate-900 border-white'
                  : 'bg-black/40 text-silver border-white/10 hover:bg-black/60 hover:text-white'
              }`}
              title={showQr ? "Close QR Code" : "View QR Code"}
              aria-label={showQr ? "Close QR Code" : "View QR Code"}
            >
              {showQr ? <X className="w-4 h-4" /> : <QrCode className="w-4 h-4" />}
            </button>

            <button
              onClick={handleWishlistClick}
              className={`p-2 rounded-full backdrop-blur-md border transition-all duration-200 ${
                isWishlisted
                  ? 'bg-red-500 text-white border-red-500'
                  : 'bg-black/40 text-silver border-white/10 hover:bg-black/60 hover:text-white'
              }`}
              title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
              aria-label={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleCompareClick}
              className={`p-2 rounded-full backdrop-blur-md border transition-all duration-200 ${
                isSelected 
                  ? 'bg-copper text-white border-copper' 
                  : 'bg-black/40 text-silver border-white/10 hover:bg-black/60 hover:text-white'
              }`}
              title={isSelected ? "Remove from Compare" : "Add to Compare"}
              aria-label={isSelected ? "Remove from Compare" : "Add to Compare"}
            >
              {isSelected ? <Check className="w-4 h-4" /> : <Scale className="w-4 h-4" />}
            </button>
          </div>
          
          {/* Reserved Overlay (only if not showing QR) */}
          {!isAvailable && !showQr && (
            <div className="absolute inset-0 flex items-center justify-center z-0">
              <div className="bg-black/60 backdrop-blur-sm p-3 rounded-full border border-white/10">
                <Lock className="w-8 h-8 text-white/70" />
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-5 flex flex-col justify-end pointer-events-none relative z-10 bg-surface">
          <div className="transform translate-y-0 transition-transform duration-300">
            <div className="flex justify-between items-start mb-1">
               <h3 className={`font-display font-bold text-white leading-tight ${product.isFeatured ? 'text-xl' : 'text-base'}`}>
                 {product.title}
               </h3>
               {/* Listing ID */}
               <span className="text-[10px] font-mono text-silver/50 bg-white/5 px-1.5 py-0.5 rounded ml-2 whitespace-nowrap">
                 #{product.id}
               </span>
            </div>
            
            <div className="flex items-center gap-3 text-silver text-xs mb-3">
               <span className="flex items-center gap-1">
                 <Gauge className="w-3 h-3" /> {product.power}
               </span>
               <span>•</span>
               <span className="truncate">{product.seller.name}</span>
            </div>

            <div className="flex items-end justify-between border-t border-white/10 pt-3 mt-auto">
              <div>
                <p className="text-xs text-silver">Total Price</p>
                {isLocked ? (
                  <div className="h-5 w-20 bg-white/10 rounded blur-sm animate-pulse"></div>
                ) : (
                  <p className="text-sm font-medium text-white line-through opacity-70">{formatCurrency(product.price)}</p>
                )}
              </div>
              <div className="text-right">
                {isAvailable ? (
                  isLocked ? (
                    <div className="flex flex-col items-end">
                      <p className="text-xs text-copper font-medium flex items-center gap-1 justify-end">
                        <EyeOff className="w-3 h-3" /> {t('unlock.pay_to_view')}
                      </p>
                      <div className="h-7 w-24 bg-white/20 rounded blur-md mt-1"></div>
                    </div>
                  ) : (
                    <>
                      <p className="text-xs text-copper font-medium flex items-center gap-1 justify-end">
                        <Flame className="w-3 h-3" /> Reserve for 10%
                      </p>
                      <p className="text-xl font-bold text-white">{formatCurrency(product.reserveAmount)}</p>
                    </>
                  )
                ) : (
                   <p className="text-lg font-bold text-silver/50 uppercase tracking-widest">{product.status}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;