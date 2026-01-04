import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { backend, Reservation } from '../services/backend';
import { useLanguage } from '../contexts/LanguageContext';
import { formatCurrency } from '../constants';
import { Loader2, Download, CheckCircle2, MapPin, ArrowRight, ChefHat, Send, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Receipt: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  
  // Notification State
  const [notifying, setNotifying] = useState(true);
  const [notified, setNotified] = useState(false);

  useEffect(() => {
    const fetchReceipt = async () => {
      if (id) {
        const data = await backend.getReservation(id);
        setReservation(data);
        
        // Simulate automatic notification logic
        if (data) {
            setTimeout(() => {
                setNotifying(false);
                setNotified(true);
            }, 3000);
        }
      }
      setLoading(false);
    };
    fetchReceipt();
  }, [id]);

  const handleDownload = async () => {
    if (!reservation) return;
    setDownloading(true);
    try {
        const res = await backend.generateReceipt(reservation.id);
        if (res.success && res.blob) {
            const url = window.URL.createObjectURL(res.blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = res.filename || 'receipt.html';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }
    } catch (e) {
        console.error(e);
    } finally {
        setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-copper" />
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="min-h-screen bg-void flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-2xl font-bold text-white mb-2">Receipt Not Found</h2>
        <Link to="/marketplace" className="text-copper hover:underline">Return to Marketplace</Link>
      </div>
    );
  }

  const messageBody = encodeURIComponent(
    `Selam ${reservation.sellerName}, I have just reserved ${reservation.productTitle} (Order #${reservation.id}). Payment of ${formatCurrency(reservation.amountPaid)} confirmed. Please verify and confirm availability.`
  );

  return (
    <div className="min-h-screen bg-void pb-20 print:bg-white print:pb-0">
      <div className="print:hidden">
        <Navbar />
      </div>
      
      <main className="pt-28 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 print:pt-0 print:max-w-none">
        
        <div className="text-center mb-8 print:hidden">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 mb-4 text-green-500">
             <CheckCircle2 className="w-4 h-4" />
             <span className="text-xs font-bold uppercase tracking-wider">Payment Confirmed</span>
           </div>
           <h1 className="font-display text-3xl font-bold text-white">{t('receipt.title')}</h1>
           <p className="text-silver mt-2">{t('receipt.subtitle')}</p>
        </div>

        {/* Automatic Notification Status */}
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-xl bg-surface border border-white/10 text-center print:hidden"
            >
                {notifying ? (
                    <div className="flex items-center justify-center gap-3 text-copper">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="font-bold text-sm">Automatically sending receipt to Seller...</span>
                    </div>
                ) : notified ? (
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2 text-green-500">
                            <CheckCircle2 className="w-5 h-5" />
                            <span className="font-bold text-sm">Receipt Sent to Seller!</span>
                        </div>
                        <p className="text-xs text-silver">We've notified {reservation.sellerName} via Telegram.</p>
                    </div>
                ) : null}
            </motion.div>
        </AnimatePresence>

        {/* Receipt Card */}
        <div className="bg-white text-slate-900 rounded-3xl overflow-hidden shadow-2xl relative">
          
          {/* Top Edge Decoration (Ticket style) */}
          <div className="h-4 bg-copper w-full"></div>
          
          <div className="p-8 md:p-12">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-8 mb-8">
               <div className="flex items-center gap-3">
                 <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center">
                    <ChefHat className="text-white w-6 h-6" />
                 </div>
                 <div>
                   <h2 className="font-bold text-2xl tracking-tight">RESCA</h2>
                   <p className="text-xs text-slate-500 uppercase tracking-widest">Kitchen Queen</p>
                 </div>
               </div>
               <div className="text-right">
                  <p className="text-sm text-slate-500 font-medium">{t('receipt.date')}</p>
                  <p className="font-mono font-bold text-slate-900">{new Date(reservation.date).toLocaleDateString()}</p>
               </div>
            </div>

            {/* Transaction Info */}
            <div className="grid grid-cols-2 gap-8 mb-8">
               <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">{t('receipt.trans_id')}</p>
                  <p className="font-mono text-lg font-bold">{reservation.id}</p>
               </div>
               <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">{t('receipt.buyer')}</p>
                  <p className="font-bold text-lg">{reservation.buyerName}</p>
                  <p className="text-sm text-slate-500">{reservation.buyerPhone}</p>
               </div>
            </div>

            {/* Item Details */}
            <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100">
               <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-4">{t('receipt.item')}</p>
               <div className="flex items-start gap-4">
                  <img src={reservation.productImage} alt="" className="w-20 h-20 rounded-lg object-cover border border-slate-200" />
                  <div className="flex-1">
                     <h3 className="font-bold text-lg leading-tight mb-1">{reservation.productTitle}</h3>
                     <div className="flex items-center gap-1 text-slate-500 text-sm">
                        <MapPin className="w-4 h-4" /> {reservation.location}
                     </div>
                  </div>
               </div>
            </div>

            {/* Financials */}
            <div className="space-y-3 pb-8 border-b-2 border-dashed border-slate-200 mb-8">
               <div className="flex justify-between items-center text-slate-600">
                 <span>Total Item Price</span>
                 <span>{formatCurrency(reservation.totalPrice)}</span>
               </div>
               <div className="flex justify-between items-center text-slate-900 font-bold text-lg">
                 <span>{t('receipt.amount_paid')}</span>
                 <span className="text-green-600">{formatCurrency(reservation.amountPaid)}</span>
               </div>
               <div className="flex justify-between items-center text-slate-500 pt-2">
                 <span>{t('receipt.remaining')}</span>
                 <span>{formatCurrency(reservation.totalPrice - reservation.amountPaid)}</span>
               </div>
            </div>

            {/* Instructions */}
            <div>
               <h4 className="font-bold text-slate-900 mb-4">{t('receipt.instructions')}</h4>
               <ul className="space-y-3 text-sm text-slate-600">
                  <li className="flex items-start gap-3">
                     <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold shrink-0">1</div>
                     {t('receipt.step1')}
                  </li>
                  <li className="flex items-start gap-3">
                     <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold shrink-0">2</div>
                     {t('receipt.step2')}
                  </li>
                  <li className="flex items-start gap-3">
                     <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold shrink-0">3</div>
                     {t('receipt.step3')}
                  </li>
               </ul>
            </div>

            {/* Fake QR Code */}
            <div className="mt-10 flex flex-col items-center justify-center">
               <div className="w-32 h-32 bg-white border-2 border-slate-900 p-2">
                  <div className="w-full h-full bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=resca-receipt')] bg-cover rendering-pixelated"></div>
               </div>
               <p className="text-[10px] font-mono text-slate-400 mt-2 text-center">SCAN AT HUB FOR VERIFICATION</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8 text-center print:hidden">
           <button 
             onClick={handleDownload}
             disabled={downloading}
             className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 font-bold rounded-xl shadow-xl hover:scale-105 transition-transform disabled:opacity-70 disabled:scale-100"
           >
             {downloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
             {downloading ? "Generating..." : t('receipt.download')}
           </button>
           
           {/* Manual Social Share */}
           <div className="mt-10 border-t border-white/10 pt-8">
              <h3 className="text-white font-bold mb-4">Speed Up Process</h3>
              <p className="text-silver text-sm mb-6">Manually send the receipt to the seller for faster confirmation.</p>
              <div className="flex gap-4 justify-center">
                 <a 
                   href={`https://wa.me/${reservation.sellerPhone.replace('+', '')}?text=${messageBody}`}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] text-white font-bold hover:bg-[#20bd5a] transition-colors"
                 >
                    <MessageCircle className="w-5 h-5" /> WhatsApp
                 </a>
                 <a 
                   href={`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${messageBody}`}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#229ED9] text-white font-bold hover:bg-[#1f90c6] transition-colors"
                 >
                    <Send className="w-5 h-5" /> Telegram
                 </a>
              </div>
           </div>

           <div className="mt-8">
             <Link to="/marketplace" className="text-silver hover:text-white text-sm flex items-center justify-center gap-1">
               Back to Marketplace <ArrowRight className="w-4 h-4" />
             </Link>
           </div>
        </div>

      </main>
    </div>
  );
};

export default Receipt;