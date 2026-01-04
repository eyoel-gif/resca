import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ThreeDViewer from '../components/ThreeDViewer';
import ProductCard from '../components/ProductCard';
import { formatCurrency } from '../constants';
import { backend } from '../services/backend';
import { 
  CheckCircle2, ShieldCheck, Flame, ChevronRight, X, 
  Loader2, Lock, FileText, PlayCircle, Eye, Box, ArrowRightLeft,
  Share2, Copy, Send, MessageCircle, Wallet, User, BadgeCheck, Zap,
  EyeOff, Unlock, Gavel, ArrowUpRight, LayoutGrid, ShoppingCart, CreditCard,
  QrCode, Hash
} from 'lucide-react';
import { Product } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

type ModalStep = 'INFO' | 'PAYMENT' | 'DETAILS';
type PaymentType = 'RESERVE' | 'BUY_NOW';
type PaymentProvider = 'telebirr' | 'chapa';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [activeImage, setActiveImage] = useState<string>('');
  const [viewMode, setViewMode] = useState<'3d' | 'image' | 'report'>('3d');
  const [loading, setLoading] = useState(true);
  
  // Modals & Notifications
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentType, setPaymentType] = useState<PaymentType>('RESERVE');
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>('telebirr');
  const [modalStep, setModalStep] = useState<ModalStep>('INFO');
  const [showShareModal, setShowShareModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  // Unlock State
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [unlocking, setUnlocking] = useState(false);

  // Offer State
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerAmount, setOfferAmount] = useState<number | ''>('');
  const [offerProcessing, setOfferProcessing] = useState(false);

  // Buyer Form Data
  const [buyerInfo, setBuyerInfo] = useState({ name: '', phone: '' });

  const loadProduct = async () => {
    setLoading(true);
    if (id) {
      // 1. Fetch Main Product
      const data = await backend.getProductById(id);
      setProduct(data);
      if (data && data.images.length > 0) {
        setActiveImage(data.images[0]);
      }

      // 2. Fetch Related Products
      const related = await backend.getRelatedProducts(id);
      setRelatedProducts(related);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  // Step 1: User clicks "Pay"
  const initiatePayment = (provider: PaymentProvider = 'telebirr') => {
    setSelectedProvider(provider);
    setModalStep('PAYMENT');
    setProcessing(true);
    
    if (paymentType === 'BUY_NOW') {
        // Direct Buy Logic
        setTimeout(async () => {
            if (!product || !id) return;
            const res = await backend.processDirectPurchase(id, provider);
            setProcessing(false);
            
            if (res.success && res.orderId) {
                // Redirect directly to delivery setup
                navigate(`/delivery/${res.orderId}`);
            } else {
                setNotification({ type: 'error', message: res.message });
                setShowPaymentModal(false);
            }
        }, 3000);
    } else {
        // Reserve Logic (Defaults to Telebirr currently as per original flow, but could be extended)
        setTimeout(() => {
            setProcessing(false);
            setModalStep('DETAILS');
        }, 2000);
    }
  };

  // Step 2: User fills form and Finalizes (ONLY FOR RESERVATION FLOW)
  const handleFinalizeReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !id) return;
    
    setProcessing(true);
    try {
      const result = await backend.createReservation(id, buyerInfo);
      
      if (result.success && result.receiptId) {
        setNotification({ type: 'success', message: result.message });
        setProduct(prev => prev ? ({ ...prev, status: 'reserved' }) : null);
        setShowPaymentModal(false);
        navigate(`/receipt/${result.receiptId}`);
      } else {
        setNotification({ type: 'error', message: result.message });
      }
    } catch (error) {
      setNotification({ type: 'error', message: "Processing failed. Please try again." });
    } finally {
      setProcessing(false);
    }
  };

  // --- Unlock Logic ---
  const handleUnlock = async () => {
    if (!product) return;
    setUnlocking(true);
    
    // Simulate Payment Process
    try {
      const result = await backend.unlockProduct(product.id);
      if (result.success) {
        await loadProduct(); // Reload to get unlocked state
        setNotification({ type: 'success', message: t('unlock.unlocked_success') });
        setShowUnlockModal(false);
      }
    } catch (e) {
      setNotification({ type: 'error', message: "Unlock failed." });
    } finally {
      setUnlocking(false);
    }
  };

  // --- Make Offer Logic ---
  const handleMakeOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !offerAmount) return;

    setOfferProcessing(true);
    try {
      const result = await backend.submitOffer(product.id, Number(offerAmount));
      if (result.success) {
        setNotification({ type: 'success', message: result.message });
        setShowOfferModal(false);
        setOfferAmount('');
        
        // If the offer was auto-accepted, reload to show "Sold" state
        if (result.status === 'accepted') {
            await loadProduct();
        }
      } else {
        setNotification({ type: 'error', message: result.message });
      }
    } catch (e) {
      setNotification({ type: 'error', message: "Error submitting offer." });
    } finally {
      setOfferProcessing(false);
    }
  };

  // --- Sharing Logic ---
  const getCurrentUrl = () => window.location.href;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getCurrentUrl());
      setNotification({ type: 'success', message: 'Link copied to clipboard!' });
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to copy link.' });
    }
  };

  const handleTelegramShare = () => {
    if (!product) return;
    const url = getCurrentUrl();
    const text = `🔥 *Resca: The Kitchen Queen* 🔥\n\nCheck out this ${product.title} (ID: #${product.id})!\n\nLocation: ${product.location}\nCondition: ${product.condition}\n\nReserve it now before it's gone:`;
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    window.open(tgUrl, '_blank');
  };

  const handleWhatsAppShare = () => {
    if (!product) return;
    const url = getCurrentUrl();
    const text = `Check out this ${product.title} (ID: #${product.id}) on Resca! ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-void flex flex-col items-center justify-center text-silver">
        <Loader2 className="w-10 h-10 animate-spin text-copper mb-4" />
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center text-silver">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Product Not Found</h2>
          <Link to="/marketplace" className="text-copper hover:underline">Return to Marketplace</Link>
        </div>
      </div>
    );
  }

  const isAvailable = product.status === 'available';
  const isLocked = product.isLocked;
  // Use product.negotiable if defined, otherwise default to true for backward compatibility
  const isNegotiable = product.negotiable !== false;
  // Buy Now Eligible logic: Available AND Price < 100,000 AND Price is unlocked/visible
  const isBuyNowEligible = isAvailable && !isLocked && product.price < 100000;

  // Ensure image is defined string
  const displayImage = activeImage || (product.images && product.images.length > 0 ? product.images[0] : '');

  // Generate QR for this page
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(getCurrentUrl())}&bgcolor=1e293b&color=ffffff&margin=10`;

  return (
    <div className="min-h-screen bg-void pb-20">
      <Navbar />

      {/* Breadcrumbs */}
      <div className="pt-24 pb-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-sm text-silver flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden">
          <Link to="/marketplace" className="hover:text-copper shrink-0">Marketplace</Link>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="text-copper font-mono">#{product.id}</span>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="text-white truncate">{product.title}</span>
        </div>
        
        {/* Share Button Trigger */}
        <button 
          onClick={() => setShowShareModal(true)}
          className="flex items-center gap-2 text-copper hover:text-white transition-colors text-xs font-bold uppercase tracking-wider whitespace-nowrap"
        >
          <QrCode className="w-4 h-4" /> Share / QR
        </button>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Notification Toast */}
        <AnimatePresence>
          {notification && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`fixed top-24 right-4 z-[70] p-4 rounded-xl border backdrop-blur-md shadow-2xl ${
                notification.type === 'success' 
                  ? 'bg-green-500/10 border-green-500/50 text-green-200' 
                  : 'bg-red-500/10 border-red-500/50 text-red-200'
              }`}
            >
               <div className="flex items-center gap-3">
                 {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <X className="w-5 h-5" />}
                 <p className="font-medium">{notification.message}</p>
                 <button onClick={() => setNotification(null)} className="ml-2 hover:text-white"><X className="w-4 h-4"/></button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          
          {/* Left: Phygital Visuals */}
          <div className="space-y-6">
            
            {/* View Mode Toggle */}
            <div className="flex bg-surface rounded-lg p-1 border border-border w-max">
               <button 
                 onClick={() => setViewMode('3d')}
                 className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-2 transition-all ${viewMode === '3d' ? 'bg-slate-700 text-white shadow' : 'text-silver hover:text-white'}`}
               >
                 <Box className="w-4 h-4" /> 3D View
               </button>
               <button 
                 onClick={() => setViewMode('image')}
                 className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-2 transition-all ${viewMode === 'image' ? 'bg-slate-700 text-white shadow' : 'text-silver hover:text-white'}`}
               >
                 <Eye className="w-4 h-4" /> Photos
               </button>
               <button 
                 onClick={() => setViewMode('report')}
                 className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-2 transition-all ${viewMode === 'report' ? 'bg-slate-700 text-white shadow' : 'text-silver hover:text-white'}`}
               >
                 <FileText className="w-4 h-4" /> Condition Report
               </button>
            </div>

            <div className="relative">
              {viewMode === '3d' && <ThreeDViewer image={displayImage} />}
              
              {viewMode === 'image' && (
                <div className="relative w-full aspect-square bg-black rounded-2xl overflow-hidden border border-border">
                   {displayImage ? (
                     <img src={displayImage} className="w-full h-full object-contain" alt="Main View" />
                   ) : (
                     <div className="flex items-center justify-center h-full text-silver">No Image</div>
                   )}
                </div>
              )}

              {viewMode === 'report' && (
                <div className="relative w-full aspect-square bg-slate-900 rounded-2xl overflow-hidden border border-border flex flex-col">
                  {/* Mock Video Player */}
                  <div className="flex-1 relative bg-black flex items-center justify-center group cursor-pointer">
                    {displayImage && <img src={displayImage} className="w-full h-full object-cover opacity-40" alt="Video Thumbnail" />}
                    <div className="absolute inset-0 flex items-center justify-center">
                       <PlayCircle className="w-16 h-16 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                    </div>
                    <div className="absolute bottom-4 left-4 bg-red-600 text-white text-xs px-2 py-1 rounded font-bold uppercase tracking-wider">
                      Proof of Life
                    </div>
                  </div>
                  <div className="p-4 bg-surface border-t border-border">
                     <div className="flex justify-between items-start">
                        <div>
                          <p className="text-white font-bold">Resca Inspector: {product.conditionReport?.inspectorName || 'Pending'}</p>
                          <p className="text-xs text-silver mt-1">Inspection Date: {product.conditionReport?.inspectionDate || 'N/A'}</p>
                        </div>
                        <div className="text-right">
                           <span className={`inline-block px-3 py-1 rounded text-sm font-bold ${
                             product.conditionReport?.grade === 'A' ? 'bg-green-500/20 text-green-400' : 
                             product.conditionReport?.grade === 'B' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
                           }`}>Grade {product.conditionReport?.grade || 'N/A'}</span>
                        </div>
                     </div>
                     <p className="text-sm text-silver mt-2 italic">"{product.conditionReport?.notes || 'Standard operational check.'}"</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Thumbnails */}
            {viewMode === 'image' && (
              <div className="flex items-center gap-4 overflow-x-auto pb-4 no-scrollbar">
                {product.images.map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveImage(img)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      activeImage === img 
                        ? 'border-copper ring-2 ring-copper/20 scale-105' 
                        : 'border-border hover:border-silver opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`View ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Seller Card */}
            <div className={`glass-panel rounded-xl p-6 ${isLocked ? 'blur-sm select-none grayscale opacity-50' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center text-lg font-bold text-white">
                    {product.seller.name.substring(0, 2)}
                  </div>
                  <div>
                    <h4 className="text-white font-medium flex items-center gap-2">
                      {isLocked ? "Seller Hidden" : product.seller.name}
                      {product.seller.isVerified && (
                        <ShieldCheck className="w-4 h-4 text-green-500" />
                      )}
                    </h4>
                    <p className="text-sm text-silver">{isLocked ? "Location Hidden" : product.seller.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block text-xl font-bold text-white">{product.seller.rating}</span>
                  <span className="text-xs text-silver">Seller Score</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Info & Action */}
          <div>
            <div className="mb-2 flex items-center gap-3">
              <span className="px-3 py-1 bg-burner/10 text-burner border border-burner/20 rounded-full text-xs font-medium uppercase tracking-wider">
                {product.category}
              </span>
              <span className={`px-3 py-1 border rounded-full text-xs font-medium uppercase tracking-wider ${
                isAvailable ? 'bg-surface text-silver border-border' : 'bg-red-900/20 text-red-400 border-red-800/30'
              }`}>
                {isAvailable ? product.location : `Status: ${product.status}`}
              </span>
              <span className="flex items-center gap-1 text-xs text-silver font-mono bg-white/5 px-2 py-1 rounded">
                <Hash className="w-3 h-3" /> {product.id}
              </span>
            </div>
            
            <h1 className="font-display text-4xl font-bold text-white mb-4 leading-tight">
              {product.title}
            </h1>
            
            <p className="text-lg text-silver leading-relaxed mb-8">
              {product.description}
            </p>

            {/* RESCA VERIFIED TRUST BOX */}
            {product.isRescaVerified && (
              <div className="bg-gradient-to-br from-[#1E293B] to-[#0f172a] rounded-xl p-5 border border-copper/30 shadow-lg shadow-copper/5 mb-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-copper/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-copper p-1 rounded-full">
                    <ShieldCheck className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-white font-bold tracking-wide">RESCA VERIFIED</h3>
                </div>
                
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-silver">
                    <CheckCircle2 className="w-4 h-4 text-copper shrink-0 mt-0.5" />
                    <span>Physically inspected at Resca Hub.</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-silver">
                    <CheckCircle2 className="w-4 h-4 text-copper shrink-0 mt-0.5" />
                    <span>Instant ownership transfer guarantee.</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-silver">
                    <CheckCircle2 className="w-4 h-4 text-copper shrink-0 mt-0.5" />
                    <span>48-Hour Money-Back on defects.</span>
                  </li>
                </ul>
              </div>
            )}

            {/* Specifications Grid */}
            <div className="bg-surface/50 rounded-2xl p-6 border border-border mb-8">
              <h3 className="text-white font-bold mb-4">Technical Specifications</h3>
              <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                 {Object.entries(product.specs).map(([key, value]) => (
                   <div key={key}>
                     <dt className="text-xs text-silver uppercase tracking-wider mb-1">{key}</dt>
                     <dd className="text-white font-medium">{value}</dd>
                   </div>
                 ))}
                 <div>
                    <dt className="text-xs text-silver uppercase tracking-wider mb-1">Power Source</dt>
                    <dd className="text-white font-medium">{product.power}</dd>
                 </div>
                 <div>
                    <dt className="text-xs text-silver uppercase tracking-wider mb-1">Condition</dt>
                    <dd className="text-white font-medium">{product.condition}</dd>
                 </div>
              </div>
            </div>

            {/* Sticky Action Bar */}
            <div className="sticky bottom-4 z-30">
              <div className="liquid-glass p-4 rounded-2xl shadow-2xl backdrop-blur-xl">
                 <div className="flex items-center justify-between gap-4">
                    <div className="hidden sm:block">
                      <p className="text-sm text-silver mb-1">
                        {isBuyNowEligible ? "Total Price (Buy Now)" : "Total Price"}
                      </p>
                      {isLocked ? (
                        <div className="h-8 w-32 bg-white/10 rounded animate-pulse blur-sm"></div>
                      ) : (
                        <div>
                          {isBuyNowEligible ? (
                             <div className="flex items-baseline gap-2">
                                <span className="text-2xl lg:text-3xl font-display font-bold text-white">
                                  {formatCurrency(product.price)}
                                </span>
                                <span className="text-green-500 text-xs lg:text-sm font-medium">Pay Full Amount</span>
                             </div>
                          ) : (
                             <div>
                                <p className="text-sm text-silver mb-1 line-through opacity-60">{formatCurrency(product.price)}</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl lg:text-3xl font-display font-bold text-white">
                                    {formatCurrency(product.reserveAmount)}
                                    </span>
                                    <span className="text-copper text-xs lg:text-sm font-medium">10% Reserve</span>
                                </div>
                             </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {isAvailable ? (
                      isLocked ? (
                        <button 
                          onClick={() => setShowUnlockModal(true)}
                          className="flex-1 max-w-sm bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold py-3 px-4 lg:py-4 lg:px-6 rounded-xl shadow-lg hover:shadow-blue-500/30 transform hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                        >
                          <Unlock className="w-5 h-5" />
                          {t('unlock.unlock_price')}
                        </button>
                      ) : (
                        <div className="flex flex-1 gap-2 max-w-md">
                          
                          {/* Buy Now Button (If eligible) */}
                          {isBuyNowEligible && (
                             <button
                                onClick={() => {
                                    setPaymentType('BUY_NOW');
                                    setModalStep('INFO');
                                    setShowPaymentModal(true);
                                }}
                                className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-3 lg:py-4 px-2 lg:px-4 rounded-xl shadow-lg hover:shadow-green-500/30 transform hover:scale-[1.02] transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
                             >
                                <ShoppingCart className="w-4 h-4 lg:w-5 lg:h-5" />
                                <span className="text-xs lg:text-sm">{t('buy_now.btn')}</span>
                             </button>
                          )}

                          {/* Make Offer Button - Available for all negotiable items */}
                          {isNegotiable && (
                            <button
                              onClick={() => setShowOfferModal(true)}
                              className="flex-1 bg-surface hover:bg-white/10 border border-white/20 text-white font-bold py-3 lg:py-4 px-2 lg:px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
                            >
                              <Gavel className="w-4 h-4" />
                              <span className="text-xs lg:text-sm">{t('offer.btn')}</span>
                            </button>
                          )}

                          {/* Reserve Button - Only if NOT Buy Now Eligible */}
                          {!isBuyNowEligible && (
                            <button 
                                onClick={() => {
                                setPaymentType('RESERVE');
                                setModalStep('INFO');
                                setShowPaymentModal(true);
                                }}
                                className="flex-1 copper-gradient text-white font-bold py-3 lg:py-4 px-2 lg:px-4 rounded-xl shadow-lg shadow-copper/20 hover:shadow-copper/40 transform hover:scale-[1.02] transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
                            >
                                <Flame className="w-4 h-4 lg:w-5 lg:h-5 animate-pulse" />
                                <span className="text-xs lg:text-sm">Reserve Now</span>
                            </button>
                          )}
                        </div>
                      )
                    ) : (
                      <button 
                        disabled
                        className="flex-1 max-w-xs bg-slate-700 text-silver font-bold py-4 px-6 rounded-xl cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <Lock className="w-5 h-5" />
                        {product.status === 'reserved' ? 'Reserved' : product.status === 'sold' ? 'Sold' : 'Closed'}
                      </button>
                    )}
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS SECTION */}
        {relatedProducts.length > 0 && (
          <div className="mb-16 pt-12 border-t border-white/10">
             <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
               <LayoutGrid className="w-6 h-6 text-copper" /> Related Products
             </h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map(relProduct => (
                  <ProductCard key={relProduct.id} product={relProduct} />
                ))}
             </div>
          </div>
        )}

      </main>

      {/* Share / QR Modal */}
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="absolute inset-0 bg-black/80 backdrop-blur-sm"
               onClick={() => setShowShareModal(false)}
             ></motion.div>

             <motion.div
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="relative glass-panel rounded-2xl w-full max-w-md p-6 border border-white/10 shadow-2xl"
             >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Share Listing #{product.id}</h3>
                  <button onClick={() => setShowShareModal(false)} className="text-silver hover:text-white"><X className="w-5 h-5" /></button>
                </div>

                {/* QR Code Section */}
                <div className="flex flex-col items-center justify-center mb-6">
                   <div className="bg-white p-3 rounded-2xl shadow-xl">
                      <img src={qrCodeUrl} alt="Product QR" className="w-48 h-48" />
                   </div>
                   <p className="text-copper font-bold mt-4 text-sm tracking-widest">SCAN TO VIEW ITEM</p>
                </div>

                {/* Copy Link Section */}
                <div className="bg-surface rounded-xl p-3 flex items-center gap-2 mb-6 border border-border">
                   <div className="flex-1 truncate text-sm text-silver font-mono px-2">
                      {getCurrentUrl()}
                   </div>
                   <button 
                     onClick={handleCopyLink}
                     className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors"
                     title="Copy Link"
                   >
                     <Copy className="w-4 h-4" />
                   </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <button 
                     onClick={handleTelegramShare}
                     className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl bg-[#229ED9]/10 border border-[#229ED9]/30 hover:bg-[#229ED9]/20 transition-all group"
                   >
                     <div className="w-12 h-12 rounded-full bg-[#229ED9] flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                       <Send className="w-6 h-6 ml-1" />
                     </div>
                     <span className="text-white font-medium">Telegram</span>
                   </button>

                   <button 
                     onClick={handleWhatsAppShare}
                     className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 hover:bg-[#25D366]/20 transition-all group"
                   >
                     <div className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                       <MessageCircle className="w-6 h-6" />
                     </div>
                     <span className="text-white font-medium">WhatsApp</span>
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Unlock Fee Modal */}
      <AnimatePresence>
        {showUnlockModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="absolute inset-0 bg-black/80 backdrop-blur-sm"
               onClick={() => { if (!unlocking) setShowUnlockModal(false); }}
             ></motion.div>

             <motion.div
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="relative glass-panel rounded-2xl w-full max-w-sm p-6 border border-white/10 shadow-2xl overflow-hidden"
             >
                <div className="absolute top-0 right-0 p-4">
                   {!unlocking && <button onClick={() => setShowUnlockModal(false)}><X className="w-5 h-5 text-silver" /></button>}
                </div>
                
                <div className="text-center pt-4 pb-8">
                   <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
                     <EyeOff className="w-8 h-8 text-blue-400" />
                   </div>
                   <h3 className="text-xl font-bold text-white mb-2">{t('unlock.unlock_price')}</h3>
                   <p className="text-silver text-sm mb-6 px-4">
                     {t('unlock.locked_desc')}
                   </p>
                   
                   <div className="bg-slate-900 rounded-xl p-4 mb-6 border border-white/10">
                     <p className="text-sm text-silver">Access Fee</p>
                     <p className="text-2xl font-bold text-white">{t('unlock.unlock_fee')}</p>
                   </div>

                   <button 
                     onClick={handleUnlock}
                     disabled={unlocking}
                     className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                   >
                     {unlocking ? (
                       <>
                         <Loader2 className="animate-spin w-5 h-5" /> {t('unlock.unlocking')}
                       </>
                     ) : (
                       <>
                         <Wallet className="w-5 h-5" /> {t('unlock.unlock_btn')}
                       </>
                     )}
                   </button>
                   <p className="text-[10px] text-silver/50 mt-4 uppercase tracking-wider">Payments Secured by Telebirr</p>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reserve / Buy Now / Payment Wizard */}
      <AnimatePresence>
        {showPaymentModal && isAvailable && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
              onClick={() => { if (!processing) setShowPaymentModal(false); }}
            ></motion.div>
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative liquid-glass rounded-2xl w-full max-w-lg p-0 shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="bg-slate-900/50 p-6 border-b border-white/5 flex justify-between items-start">
                 <div>
                   <h3 className="text-xl font-bold text-white flex items-center gap-2">
                     <ShieldCheck className="w-6 h-6 text-green-500" />
                     {paymentType === 'BUY_NOW' ? t('buy_now.modal_title') : (modalStep === 'DETAILS' ? 'Buyer Information' : 'Secure Reservation')}
                   </h3>
                   <p className="text-sm text-silver mt-1">
                     {paymentType === 'BUY_NOW' 
                       ? t('buy_now.desc') 
                       : (modalStep === 'INFO' ? "Funds held in escrow until inspection." : "Payment received! Please complete your details.")
                     }
                   </p>
                 </div>
                 {!processing && (
                   <button onClick={() => setShowPaymentModal(false)} className="text-silver hover:text-white"><X className="w-6 h-6" /></button>
                 )}
              </div>

              {/* Body */}
              <div className="p-6">
                 
                 {/* STEP 1: INFO & PAYMENT SELECTION */}
                 {(modalStep === 'INFO' || modalStep === 'PAYMENT') && (
                    <>
                      <div className="space-y-4 mb-8">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-silver">Item Price</span>
                            <span className="text-white">{formatCurrency(product.price)}</span>
                          </div>
                          
                          <div className="flex justify-between items-center text-sm">
                            {paymentType === 'BUY_NOW' ? (
                                <>
                                    <span className="text-silver">{t('buy_now.total_pay')}</span>
                                    <span className="text-green-500 font-bold text-xl">{formatCurrency(product.price)}</span>
                                </>
                            ) : (
                                <>
                                    <span className="text-silver">Reserve Deposit (10%)</span>
                                    <span className="text-copper font-bold">{formatCurrency(product.reserveAmount)}</span>
                                </>
                            )}
                          </div>
                      </div>

                      {modalStep === 'PAYMENT' ? (
                        <div className="py-8 flex flex-col items-center justify-center text-center">
                           <Loader2 className={`w-12 h-12 animate-spin mb-4 ${selectedProvider === 'chapa' ? 'text-green-500' : 'text-red-500'}`} />
                           <p className="text-white font-bold">
                             {selectedProvider === 'chapa' ? t('buy_now.waiting_chapa') : t('buy_now.waiting_telebirr')}
                           </p>
                           {selectedProvider === 'telebirr' && <p className="text-xs text-silver mt-2">Please check your phone for the USSD prompt.</p>}
                           {paymentType === 'BUY_NOW' && <p className="text-xs text-green-400 mt-4 animate-pulse">{t('buy_now.redirect_delivery')}</p>}
                        </div>
                      ) : (
                        paymentType === 'BUY_NOW' ? (
                          <div className="space-y-3">
                             <p className="text-sm text-silver font-medium mb-2">{t('buy_now.select_payment')}</p>
                             <button 
                               onClick={() => initiatePayment('telebirr')}
                               className="w-full bg-[#D92D20] hover:bg-[#B5251B] text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-red-500/20 flex items-center justify-center gap-3 group"
                             >
                                <Wallet className="w-5 h-5" />
                                {t('buy_now.pay_telebirr')}
                             </button>
                             <button 
                               onClick={() => initiatePayment('chapa')}
                               className="w-full bg-[#00A35C] hover:bg-[#008f51] text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-green-500/20 flex items-center justify-center gap-3 group"
                             >
                                <CreditCard className="w-5 h-5" />
                                {t('buy_now.pay_chapa')}
                             </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => initiatePayment('telebirr')} // Reserve still defaults to Telebirr for MVP
                            className="w-full bg-[#D92D20] hover:bg-[#B5251B] text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-red-500/20 flex items-center justify-center gap-3 group"
                          >
                             <Wallet className="w-5 h-5" />
                             Pay {formatCurrency(product.reserveAmount)} with Telebirr
                          </button>
                        )
                      )}
                      
                      <div className="mt-4 flex items-center justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all">
                        <span className="text-[10px] text-silver uppercase tracking-widest">Secured By</span>
                        <div className="font-bold text-white italic tracking-tighter">Chapa</div>
                      </div>
                    </>
                 )}

                 {/* STEP 2: BUYER DETAILS FORM (Only for Reservation) */}
                 {modalStep === 'DETAILS' && (
                    <form onSubmit={handleFinalizeReservation} className="space-y-4">
                       <div>
                         <label className="block text-sm font-medium text-silver mb-1">Full Name</label>
                         <div className="relative">
                            <input 
                              type="text" 
                              required 
                              placeholder="e.g. Abebe Kebede"
                              value={buyerInfo.name}
                              onChange={(e) => setBuyerInfo({...buyerInfo, name: e.target.value})}
                              className="w-full bg-slate-900 border border-border rounded-xl px-4 py-3 text-white pl-10 focus:outline-none focus:border-copper"
                            />
                            <User className="w-4 h-4 text-silver absolute left-3 top-3.5" />
                         </div>
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-silver mb-1">Phone Number</label>
                         <div className="relative">
                            <input 
                              type="tel" 
                              required 
                              placeholder="+251..."
                              value={buyerInfo.phone}
                              onChange={(e) => setBuyerInfo({...buyerInfo, phone: e.target.value})}
                              className="w-full bg-slate-900 border border-border rounded-xl px-4 py-3 text-white pl-10 focus:outline-none focus:border-copper"
                            />
                            <div className="absolute left-3 top-3.5 text-xs text-silver font-bold">📞</div>
                         </div>
                       </div>
                       
                       <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-lg flex items-start gap-2 mt-4">
                          <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                          <p className="text-xs text-green-200">
                            Payment of {formatCurrency(product.reserveAmount)} verified. Please provide details for your receipt.
                          </p>
                       </div>

                       <button 
                          type="submit"
                          disabled={processing}
                          className="w-full mt-4 bg-copper hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-3 disabled:opacity-70"
                        >
                          {processing ? <Loader2 className="animate-spin" /> : "Generate Receipt"}
                        </button>
                    </form>
                 )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetail;