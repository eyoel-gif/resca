
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { backend } from '../services/backend';
import { CATEGORIES, LISTING_PACKAGES } from '../constants';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, MapPin, Zap, AlertCircle, CheckCircle2, Loader2, ArrowRight, Store, CreditCard, Check, Wallet, Ban, Eye } from 'lucide-react';
import { ConditionGrade, PowerSource, Product, ListingTier } from '../types';

const Sell: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // New State for Reseller Logic
  const [sellerType, setSellerType] = useState<'individual' | 'supplier'>('individual');
  const [selectedTier, setSelectedTier] = useState<ListingTier>('basic');
  const [paymentStep, setPaymentStep] = useState<'none' | 'processing' | 'success'>('none');
  const [certifiedReal, setCertifiedReal] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    title: '',
    price: 0,
    category: 'cooking',
    condition: 'Used (Good)',
    power: 'Electric (1-Phase)',
    location: '',
    description: '',
    images: [''], 
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) : value
    }));
  };

  const handleImageChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      images: [value]
    }));
  };

  const handleTelebirrPayment = () => {
    setPaymentStep('processing');
    setTimeout(() => {
      setPaymentStep('success');
    }, 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic Validation
    if (!formData.title || !formData.price || !formData.location) {
      alert("Please fill in all required fields.");
      return;
    }

    if (!certifiedReal) {
      alert("You must certify that the images are real and not AI-generated.");
      return;
    }

    if (sellerType === 'supplier' && paymentStep !== 'success') {
      alert("Please complete Telebirr payment for your package.");
      return;
    }

    setLoading(true);

    try {
      // Pass 's1' or 'shop_1' to simulate logged-in user ID
      // Include the certification flag and trigger backend AI check
      const result = await backend.createProduct({
        ...formData,
        listingTier: sellerType === 'supplier' ? selectedTier : undefined,
        isImageCertified: certifiedReal // Passing certification status to backend
      }, sellerType === 'individual' ? 's1' : 'shop_1');

      if (result.success) {
        navigate(result.product ? `/product/${result.product.id}` : '/dashboard');
      } else {
        // Backend rejected due to AI detection or other error
        alert(result.message);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while creating the listing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-void pb-20">
      <Navbar />
      
      <main className="pt-28 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Toggle Seller Type */}
        <div className="mb-10 text-center">
          <div className="inline-flex bg-surface rounded-full p-1 border border-white/10 mb-6 relative">
             <button 
               onClick={() => { setSellerType('individual'); setPaymentStep('none'); }}
               className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${sellerType === 'individual' ? 'bg-copper text-white shadow-lg' : 'text-silver hover:text-white'}`}
             >
               Individual
             </button>
             <button 
               onClick={() => { setSellerType('supplier'); setPaymentStep('none'); }}
               className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${sellerType === 'supplier' ? 'bg-blue-600 text-white shadow-lg' : 'text-silver hover:text-white'}`}
             >
               <Store className="w-4 h-4" /> Certified Reseller
             </button>
          </div>

          <motion.div 
            key={sellerType}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display text-4xl font-bold text-white mb-4">
              {sellerType === 'individual' ? 'List Your Equipment' : 'Reseller Listing Portal'}
            </h1>
            <p className="text-silver max-w-xl mx-auto">
              {sellerType === 'individual' 
                ? "Reach thousands of buyers. We handle the 10% reserve deposit."
                : "Professional tier listings for official suppliers. Pay per listing via Telebirr."}
            </p>
          </motion.div>
        </div>

        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          {/* Section 1: Basic Info */}
          <div className="glass-panel p-8 rounded-2xl border border-white/5">
             <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
               <Zap className="w-5 h-5 text-copper" /> Basic Information
             </h2>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-silver mb-2">Equipment Title</label>
                  <input 
                    name="title" 
                    value={formData.title} 
                    onChange={handleChange}
                    placeholder="e.g. Rational Combi Oven 10-Pan" 
                    className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-copper placeholder-slate-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-silver mb-2">Category</label>
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-copper appearance-none"
                  >
                    {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-silver mb-2">Price (ETB)</label>
                  <div className="relative">
                    <input 
                      type="number"
                      name="price"
                      value={formData.price || ''}
                      onChange={handleChange}
                      placeholder="0.00" 
                      className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-copper pl-10"
                      required
                    />
                    <div className="absolute left-3 top-3.5 text-silver text-xs font-bold">ETB</div>
                  </div>
                  {formData.price! > 0 && (
                     <p className="text-xs text-copper mt-2 flex items-center gap-1">
                       <AlertCircle className="w-3 h-3" /> 
                       {sellerType === 'individual' 
                         ? `Buyer pays ${Math.ceil(formData.price! * 0.10).toLocaleString()} ETB (10%) to reserve.`
                         : `Buyer pays ${Math.ceil(formData.price! * 0.10).toLocaleString()} ETB (10%) reserve. You pay a listing fee.`
                       }
                     </p>
                  )}
                </div>
             </div>
          </div>

          {/* Section 2: Technical Details */}
          <div className="glass-panel p-8 rounded-2xl border border-white/5">
             <h2 className="text-xl font-bold text-white mb-6">Technical Specs</h2>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-silver mb-2">Condition</label>
                  <select 
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-copper"
                  >
                    <option value="New">New (In Box)</option>
                    <option value="Refurbished">Refurbished</option>
                    <option value="Used (Good)">Used (Good Condition)</option>
                    <option value="Used (Fair)">Used (Fair Condition)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-silver mb-2">Power Source</label>
                  <select 
                    name="power"
                    value={formData.power}
                    onChange={handleChange}
                    className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-copper"
                  >
                    <option value="Electric (3-Phase)">Electric (3-Phase)</option>
                    <option value="Electric (1-Phase)">Electric (1-Phase)</option>
                    <option value="Gas">Gas</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-silver mb-2">Detailed Description</label>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4} 
                    placeholder="Describe any defects, history, or specific features..." 
                    className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-copper placeholder-slate-600"
                  ></textarea>
                </div>
             </div>
          </div>

          {/* Section 3: Location & Media */}
          <div className="glass-panel p-8 rounded-2xl border border-white/5">
             <h2 className="text-xl font-bold text-white mb-6">Location & Media</h2>
             
             {/* AI RESTRICTION WARNING */}
             <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6 flex items-start gap-4">
                 <div className="bg-amber-500/20 p-2 rounded-lg shrink-0 mt-1">
                     <Ban className="w-6 h-6 text-amber-500" />
                 </div>
                 <div>
                     <h4 className="text-amber-500 font-bold text-sm mb-1 flex items-center gap-2">
                       STRICT POLICY: NO AI GENERATED IMAGES
                       <Eye className="w-4 h-4 text-amber-500 opacity-60" />
                     </h4>
                     <p className="text-amber-100/70 text-xs leading-relaxed">
                         Resca uses "Real-Eye" technology to scan all uploads. Listings with AI-generated, rendered, or stock images representing used equipment will be <strong>permanently banned</strong>. 
                         Please upload clear photos of the actual item in its current condition.
                     </p>
                 </div>
             </div>

             <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-silver mb-2">Location (Area or Address)</label>
                  <div className="relative">
                    <input 
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. Bole, near Friendship Mall (or G744+XX)" 
                      className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-copper pl-10"
                      required
                    />
                    <MapPin className="w-5 h-5 text-silver absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-silver mb-2">Main Image URL</label>
                  <div className="flex gap-2">
                     <div className="relative flex-1">
                        <input 
                          value={formData.images?.[0] || ''} 
                          onChange={(e) => handleImageChange(e.target.value)}
                          placeholder="https://..." 
                          className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-copper pl-10"
                        />
                        <Upload className="w-5 h-5 text-silver absolute left-3 top-3" />
                     </div>
                  </div>
                  <p className="text-xs text-silver mt-2">
                    *For this demo, please paste a direct image URL.
                  </p>
                </div>

                <div className="bg-surface/50 p-4 rounded-xl border border-white/5 mt-2">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          required
                          checked={certifiedReal}
                          onChange={(e) => setCertifiedReal(e.target.checked)}
                          className="peer w-5 h-5 cursor-pointer appearance-none rounded border border-slate-600 bg-slate-900 transition-all checked:bg-copper checked:border-copper hover:border-copper"
                        />
                         <Check className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100" />
                      </div>
                      <span className="text-sm text-silver group-hover:text-white transition-colors pt-0.5">
                        I certify that these are <strong className="text-white">actual photos</strong> taken of the specific item I am selling. I understand that uploading AI renders or misleading stock photos will result in account suspension.
                      </span>
                    </label>
                </div>
             </div>
          </div>

          {/* Section 4: SUPPLIER PACKAGES (Only for Suppliers) */}
          {sellerType === 'supplier' && (
            <div className="glass-panel p-8 rounded-2xl border border-white/5 animate-fade-in">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                 <CreditCard className="w-5 h-5 text-blue-400" /> Select Listing Package
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                 {(Object.keys(LISTING_PACKAGES) as ListingTier[]).map((tier) => {
                   const pkg = LISTING_PACKAGES[tier];
                   const isSelected = selectedTier === tier;
                   return (
                     <div 
                       key={tier}
                       onClick={() => {
                         if(paymentStep !== 'success') setSelectedTier(tier);
                       }}
                       className={`border rounded-xl p-4 cursor-pointer transition-all ${
                         isSelected 
                           ? 'bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-500/20' 
                           : 'bg-surface border-border hover:border-silver'
                       } ${paymentStep === 'success' ? 'opacity-50 cursor-not-allowed' : ''}`}
                     >
                       <div className="flex justify-between items-center mb-2">
                          <h3 className="font-bold text-white">{pkg.name}</h3>
                          {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-500" />}
                       </div>
                       <p className="text-2xl font-bold text-white mb-4">{pkg.price} ETB</p>
                       <ul className="space-y-2 text-sm text-silver">
                          {pkg.features.map((f, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <Check className="w-3 h-3 text-blue-400" /> {f}
                            </li>
                          ))}
                       </ul>
                     </div>
                   );
                 })}
              </div>

              {/* Payment Status / Action */}
              <div className="bg-slate-900 rounded-xl p-6 border border-white/10">
                 {paymentStep === 'none' && (
                    <div className="text-center">
                       <p className="text-silver mb-4">Total Due: <span className="text-white font-bold">{LISTING_PACKAGES[selectedTier].price} ETB</span></p>
                       <button 
                         type="button" 
                         onClick={handleTelebirrPayment}
                         className="bg-[#D92D20] hover:bg-[#B5251B] text-white font-bold py-3 px-8 rounded-xl transition-all flex items-center justify-center gap-2 mx-auto"
                       >
                         <Wallet className="w-4 h-4" /> Pay with Telebirr
                       </button>
                    </div>
                 )}
                 {paymentStep === 'processing' && (
                    <div className="text-center py-4">
                       <Loader2 className="w-8 h-8 text-red-500 animate-spin mx-auto mb-2" />
                       <p className="text-white font-bold">Waiting for Payment...</p>
                       <p className="text-xs text-silver">Check your phone for USSD prompt.</p>
                    </div>
                 )}
                 {paymentStep === 'success' && (
                    <div className="text-center py-2 flex flex-col items-center">
                       <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-2">
                          <Check className="w-6 h-6 text-green-500" />
                       </div>
                       <p className="text-white font-bold">Payment Verified</p>
                       <p className="text-xs text-silver">Package valid for 30 days.</p>
                    </div>
                 )}
              </div>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-4 pb-12">
            <button 
              type="submit"
              disabled={loading || (sellerType === 'supplier' && paymentStep !== 'success')}
              className={`w-full font-bold py-4 rounded-xl shadow-lg transition-all transform hover:scale-[1.01] flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed ${
                sellerType === 'supplier' 
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20' 
                  : 'copper-gradient hover:bg-orange-600 text-white shadow-[0_0_30px_-10px_rgba(249,115,22,0.6)]'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Listing...
                </>
              ) : (
                <>
                  {sellerType === 'supplier' ? 'Activate Listing' : 'Publish Listing'} <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
            <p className="text-center text-silver text-sm mt-4">
              By publishing, you agree to Resca's Seller Terms & Conditions.
            </p>
          </div>

        </motion.form>
      </main>
    </div>
  );
};

export default Sell;
