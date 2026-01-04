import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { backend, Reservation } from '../services/backend';
import { useLanguage } from '../contexts/LanguageContext';
import { Truck, MapPin, CheckCircle2, Phone, User, Loader2, Store, Clock, ExternalLink, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DeliverySetup: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [order, setOrder] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Fulfillment Method State
  const [fulfillmentMethod, setFulfillmentMethod] = useState<'delivery' | 'pickup'>('delivery');

  // Form State
  const [form, setForm] = useState({
    address: '',
    city: 'Addis Ababa',
    phone: '',
    instructions: '',
    type: 'standard' // standard or express
  });

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (orderId) {
        const data = await backend.getReservation(orderId); // Reusing getReservation as it returns order struct
        setOrder(data);
      }
      setLoading(false);
    };
    fetchOrder();
  }, [orderId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate API call to save delivery/pickup info
    setTimeout(() => {
        setSubmitting(false);
        // Navigate to receipt/confirmation
        navigate(`/receipt/${orderId}`);
    }, 2000);
  };

  const handleCopyLocation = () => {
    if (!order) return;
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.location)}`;
    navigator.clipboard.writeText(mapUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openGoogleMaps = () => {
    if (!order) return;
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.location)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-copper" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center text-silver">
        Order not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-void pb-20">
      <Navbar />
      
      <main className="pt-28 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10">
           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-4 text-green-500">
             <CheckCircle2 className="w-5 h-5" />
             <span className="font-bold uppercase tracking-wider">Payment Verified</span>
           </div>
           <h1 className="font-display text-4xl font-bold text-white mb-2">How do you want it?</h1>
           <p className="text-silver">Choose how you would like to receive your item.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           
           {/* Order Summary */}
           <div className="md:col-span-1">
              <div className="glass-panel p-6 rounded-2xl border border-white/5 sticky top-24">
                 <h3 className="text-white font-bold mb-4">Item Details</h3>
                 <div className="aspect-square w-full rounded-xl overflow-hidden mb-4 bg-slate-800">
                    <img src={order.productImage} alt="" className="w-full h-full object-cover" />
                 </div>
                 <h4 className="text-white font-medium text-sm mb-1">{order.productTitle}</h4>
                 <p className="text-xs text-silver mb-4">Order ID: {order.id}</p>
                 
                 <div className="border-t border-white/10 pt-4">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-silver">Status</span>
                        <span className="text-green-400 font-bold">Paid</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-silver">Total</span>
                        <span className="text-white font-bold">{new Intl.NumberFormat('en-ET', { style: 'currency', currency: 'ETB', maximumFractionDigits: 0 }).format(order.amountPaid)}</span>
                    </div>
                 </div>
              </div>
           </div>

           {/* Setup Form / Info */}
           <div className="md:col-span-2">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel rounded-2xl border border-white/5 overflow-hidden"
              >
                 {/* Tabs */}
                 <div className="flex border-b border-white/10">
                    <button 
                      onClick={() => setFulfillmentMethod('delivery')}
                      className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-bold transition-all ${
                        fulfillmentMethod === 'delivery' 
                          ? 'bg-copper/10 text-copper border-b-2 border-copper' 
                          : 'text-silver hover:bg-white/5'
                      }`}
                    >
                        <Truck className="w-5 h-5" /> Delivery
                    </button>
                    <button 
                      onClick={() => setFulfillmentMethod('pickup')}
                      className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-bold transition-all ${
                        fulfillmentMethod === 'pickup' 
                          ? 'bg-copper/10 text-copper border-b-2 border-copper' 
                          : 'text-silver hover:bg-white/5'
                      }`}
                    >
                        <Store className="w-5 h-5" /> Pickup
                    </button>
                 </div>

                 <div className="p-8">
                    <AnimatePresence mode="wait">
                        {fulfillmentMethod === 'pickup' ? (
                            <motion.div 
                                key="pickup"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-4 items-start">
                                    <div className="bg-blue-500/20 p-2 rounded-lg">
                                        <Store className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold mb-1">Pickup Location</h3>
                                        <p className="text-blue-100/80 text-sm mb-3">
                                            Your item is ready at the specified Resca Hub or Seller Location.
                                        </p>
                                        <div className="flex items-center gap-2 text-white font-mono text-sm bg-black/30 p-2 rounded border border-white/10">
                                            <MapPin className="w-4 h-4 text-copper" />
                                            {order.location}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-surface border border-white/10 p-4 rounded-xl">
                                        <h4 className="text-silver text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                                            <Clock className="w-4 h-4" /> Opening Hours
                                        </h4>
                                        <ul className="space-y-2 text-sm text-white">
                                            <li className="flex justify-between">
                                                <span>Mon - Sat</span>
                                                <span className="font-bold">9:00 AM - 6:00 PM</span>
                                            </li>
                                            <li className="flex justify-between text-silver">
                                                <span>Sunday</span>
                                                <span>Closed</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="bg-surface border border-white/10 p-4 rounded-xl flex flex-col justify-between">
                                        <h4 className="text-silver text-xs font-bold uppercase tracking-wider mb-3">
                                            Navigation
                                        </h4>
                                        <div className="space-y-2">
                                            <button 
                                                onClick={openGoogleMaps}
                                                className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold py-2 rounded-lg transition-colors"
                                            >
                                                <ExternalLink className="w-3 h-3" /> Open in Google Maps
                                            </button>
                                            <button 
                                                onClick={handleCopyLocation}
                                                className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold py-2 rounded-lg transition-colors"
                                            >
                                                {copied ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                                                {copied ? "Link Copied" : "Copy Location Link"}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button 
                                        onClick={handleSubmit}
                                        disabled={submitting}
                                        className="w-full copper-gradient text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:scale-[1.01] transition-transform"
                                    >
                                        {submitting ? <Loader2 className="animate-spin" /> : "Confirm Pickup Schedule"}
                                    </button>
                                    <p className="text-center text-xs text-silver mt-4">
                                        Please bring your digital receipt and ID for verification.
                                    </p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="delivery"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-silver mb-2">{t('delivery.address_label')}</label>
                                            <div className="relative">
                                                <input 
                                                required
                                                value={form.address}
                                                onChange={e => setForm({...form, address: e.target.value})}
                                                placeholder="Bole, Friendship Mall..."
                                                className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-white pl-10 focus:outline-none focus:border-copper"
                                                />
                                                <MapPin className="w-5 h-5 text-silver absolute left-3 top-3" />
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-silver mb-2">{t('delivery.city_label')}</label>
                                            <select 
                                                className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-copper"
                                                value={form.city}
                                                onChange={e => setForm({...form, city: e.target.value})}
                                            >
                                                <option>Addis Ababa</option>
                                                <option>Adama</option>
                                                <option>Hawassa</option>
                                                <option>Bahir Dar</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-silver mb-2">{t('delivery.phone_label')}</label>
                                        <div className="relative">
                                            <input 
                                                required
                                                type="tel"
                                                value={form.phone}
                                                onChange={e => setForm({...form, phone: e.target.value})}
                                                placeholder="+251..."
                                                className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-white pl-10 focus:outline-none focus:border-copper"
                                            />
                                            <Phone className="w-5 h-5 text-silver absolute left-3 top-3" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-silver mb-2">{t('delivery.instructions_label')}</label>
                                        <textarea 
                                            rows={3}
                                            value={form.instructions}
                                            onChange={e => setForm({...form, instructions: e.target.value})}
                                            className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-copper"
                                        />
                                    </div>

                                    {/* Delivery Type Selection */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div 
                                            onClick={() => setForm({...form, type: 'standard'})}
                                            className={`cursor-pointer p-4 rounded-xl border transition-all ${form.type === 'standard' ? 'bg-copper/10 border-copper' : 'bg-surface border-border hover:border-silver'}`}
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${form.type === 'standard' ? 'border-copper' : 'border-silver'}`}>
                                                    {form.type === 'standard' && <div className="w-2 h-2 rounded-full bg-copper" />}
                                                </div>
                                                <span className="text-white font-bold text-sm">Standard</span>
                                            </div>
                                            <p className="text-xs text-silver pl-6">{t('delivery.standard')}</p>
                                        </div>

                                        <div 
                                            onClick={() => setForm({...form, type: 'express'})}
                                            className={`cursor-pointer p-4 rounded-xl border transition-all ${form.type === 'express' ? 'bg-copper/10 border-copper' : 'bg-surface border-border hover:border-silver'}`}
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${form.type === 'express' ? 'border-copper' : 'border-silver'}`}>
                                                    {form.type === 'express' && <div className="w-2 h-2 rounded-full bg-copper" />}
                                                </div>
                                                <span className="text-white font-bold text-sm">Express</span>
                                            </div>
                                            <p className="text-xs text-silver pl-6">{t('delivery.express')}</p>
                                        </div>
                                    </div>

                                    <button 
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full copper-gradient text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 mt-4 hover:scale-[1.01] transition-transform"
                                    >
                                        {submitting ? <Loader2 className="animate-spin" /> : <><Truck className="w-5 h-5" /> {t('delivery.confirm_btn')}</>}
                                    </button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                 </div>
              </motion.div>
           </div>

        </div>

      </main>
    </div>
  );
};

export default DeliverySetup;
