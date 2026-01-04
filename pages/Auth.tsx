
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChefHat, 
  ArrowRight, 
  Loader2, 
  ShieldCheck, 
  CheckCircle2, 
  Wallet,
  Lock,
  User,
  Store
} from 'lucide-react';
import { backend } from '../services/backend';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

// Auth Steps
type AuthStep = 'ROLE' | 'PHONE' | 'OTP' | 'FAYDA' | 'TELEBIRR' | 'SUCCESS';

interface AuthProps {
  mode: 'login' | 'register';
}

const Auth: React.FC<AuthProps> = ({ mode }) => {
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();
  const { login } = useAuth();
  
  const [step, setStep] = useState<AuthStep>('ROLE');
  const [role, setRole] = useState<UserRole>('buyer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form States
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [fayda, setFayda] = useState('');
  const [userName, setUserName] = useState('');

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setStep('PHONE');
  };

  // 1. Request OTP
  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    let formattedPhone = phone;
    if (phone.startsWith('09')) {
      formattedPhone = '+251' + phone.substring(1);
    }

    try {
      const res = await backend.requestOTP(formattedPhone);
      if (res.success) {
        setPhone(formattedPhone);
        setStep('OTP');
      } else {
        setError(res.message);
      }
    } catch (e) {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Verify OTP
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await backend.verifyOTP(phone, otp);
      if (res.success) {
        if (role === 'seller') {
          // Sellers must go through identity check
          setStep('FAYDA');
        } else {
          // Buyers can login immediately after OTP
          await finalizeLogin();
        }
      } else {
        setError(res.message);
      }
    } catch (e) {
      setError('Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Verify Fayda (Sellers Only)
  const handleFaydaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await backend.verifyFayda(fayda);
      if (res.success && res.name) {
        setUserName(res.name);
        setStep('TELEBIRR');
      } else {
        setError(res.message);
      }
    } catch (e) {
      setError('Fayda verification failed.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Link Telebirr (Sellers Only)
  const handleTelebirrLink = async (skip: boolean = false) => {
    setError(null);
    
    if (skip) {
      await finalizeLogin();
      return;
    }

    setLoading(true);
    try {
      const res = await backend.linkTelebirr(phone);
      if (res.success) {
        await finalizeLogin();
      } else {
        setError('Could not link Telebirr.');
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
    }
  };

  const finalizeLogin = async () => {
    try {
      const res = await backend.login(phone, role);
      if (res.success && res.user) {
        login(res.user);
        setStep('SUCCESS');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (e) {
      setError('Login failed.');
    }
  };

  // Icon handling for RTL
  const ArrowIcon = () => <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />;

  return (
    <div className="min-h-screen bg-void flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20">
        <div className="w-full max-w-md">
          
          {/* Header Icon */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
             <div className="w-16 h-16 bg-gradient-to-br from-copper to-orange-700 rounded-2xl flex items-center justify-center shadow-xl shadow-orange-900/50 mx-auto mb-6 relative">
                {role === 'seller' ? <Store className="text-white w-8 h-8" /> : <User className="text-white w-8 h-8" />}
                {step === 'SUCCESS' && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1 border-2 border-void">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </motion.div>
                )}
             </div>
             <h2 className="font-display text-3xl font-bold text-white mb-2">
               {step === 'ROLE' ? (mode === 'login' ? 'Welcome Back' : 'Join Resca') : 
                step === 'SUCCESS' ? `Welcome, ${role === 'seller' ? 'Partner' : 'Chef'}!` : 
                role === 'seller' ? 'Seller Login' : 'Buyer Login'}
             </h2>
             <p className="text-silver">
               {step === 'ROLE' && "Choose your account type to proceed."}
               {step === 'PHONE' && t('auth.phone_subtitle')}
               {step === 'OTP' && `${t('auth.enter_code')} ${phone}`}
               {step === 'FAYDA' && t('auth.fayda_desc')}
               {step === 'TELEBIRR' && t('auth.tele_desc')}
               {step === 'SUCCESS' && t('auth.logging_in')}
             </p>
          </motion.div>

          {/* Main Card */}
          <motion.div 
            layout
            className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden"
          >
            {/* Progress Bar */}
            {step !== 'ROLE' && (
              <div className={`absolute top-0 left-0 w-full h-1 bg-white/5 ${isRTL ? 'rotate-180' : ''}`}>
                <motion.div 
                  className="h-full bg-copper"
                  initial={{ width: '0%' }}
                  animate={{ 
                    width: step === 'PHONE' ? '20%' : 
                           step === 'OTP' ? '40%' : 
                           step === 'FAYDA' ? '60%' : 
                           step === 'TELEBIRR' ? '80%' : '100%' 
                  }}
                />
              </div>
            )}

            <AnimatePresence mode="wait">
              
              {/* STEP 0: ROLE SELECTION */}
              {step === 'ROLE' && (
                <motion.div
                  key="role"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <button 
                    onClick={() => handleRoleSelect('buyer')}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-copper transition-all group text-left"
                  >
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">I am a Buyer</h3>
                      <p className="text-sm text-silver">I want to find equipment for my kitchen.</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => handleRoleSelect('seller')}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-copper transition-all group text-left"
                  >
                    <div className="w-12 h-12 rounded-full bg-copper/20 flex items-center justify-center text-copper group-hover:bg-copper group-hover:text-white transition-colors">
                      <Store className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">I am a Seller</h3>
                      <p className="text-sm text-silver">I want to list equipment for sale.</p>
                    </div>
                  </button>
                </motion.div>
              )}

              {/* STEP 1: PHONE */}
              {step === 'PHONE' && (
                <motion.form 
                  key="phone"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  onSubmit={handlePhoneSubmit} 
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-silver mb-2">{t('auth.phone_label')}</label>
                    <div className="relative">
                      <div className={`absolute top-3.5 flex items-center gap-2 border-white/10 ${isRTL ? 'right-3 border-l pl-2' : 'left-3 border-r pr-2'}`}>
                         <span className="text-xl">🇪🇹</span>
                         <span className="text-silver text-sm font-bold">+251</span>
                      </div>
                      <input 
                        type="tel" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="911 234 567"
                        className={`w-full bg-surface/50 border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-copper transition-colors text-lg tracking-wide ${isRTL ? 'pr-28' : 'pl-28'}`}
                        required
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep('ROLE')} className="px-4 py-4 rounded-xl border border-white/10 text-silver hover:text-white hover:bg-white/5 transition-colors">Back</button>
                    <button type="submit" disabled={loading} className="flex-1 copper-gradient text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-copper/30 transition-all flex items-center justify-center gap-2">
                      {loading ? <Loader2 className="animate-spin" /> : <>{t('auth.send_code')} <ArrowIcon /></>}
                    </button>
                  </div>
                </motion.form>
              )}

              {/* STEP 2: OTP */}
              {step === 'OTP' && (
                <motion.form 
                  key="otp"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleOtpSubmit} 
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-silver mb-2">Verification Code</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="123456"
                        className="w-full bg-surface/50 border border-border rounded-xl px-4 py-3 text-white text-center text-2xl tracking-[0.5em] focus:outline-none focus:border-copper transition-colors"
                        required
                        autoFocus
                      />
                      <Lock className={`w-5 h-5 text-silver absolute top-4 ${isRTL ? 'right-4' : 'left-4'}`} />
                    </div>
                    <p className="text-xs text-center mt-4 text-silver">
                      Didn't receive it? <button type="button" onClick={() => setStep('PHONE')} className="text-copper hover:underline">{t('auth.resend')}</button>
                    </p>
                  </div>
                  <button type="submit" disabled={loading} className="w-full copper-gradient text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-copper/30 transition-all flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="animate-spin" /> : <>{role === 'buyer' ? 'Login' : 'Verify & Continue'} <CheckCircle2 className="w-5 h-5" /></>}
                  </button>
                </motion.form>
              )}

              {/* STEP 3: FAYDA (Seller Only) */}
              {step === 'FAYDA' && (
                <motion.form 
                  key="fayda"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleFaydaSubmit} 
                  className="space-y-6"
                >
                  <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex gap-3">
                     <ShieldCheck className="w-10 h-10 text-blue-400 shrink-0" />
                     <p className="text-xs text-blue-200">
                       {t('auth.fayda_desc')}
                     </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-silver mb-2">{t('auth.fayda_label')}</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={fayda}
                        onChange={(e) => setFayda(e.target.value)}
                        placeholder="FIN-1234-5678-9012"
                        className={`w-full bg-surface/50 border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors ${isRTL ? 'pr-10' : 'pl-10'}`}
                        required
                        autoFocus
                      />
                      <ShieldCheck className={`w-5 h-5 text-silver absolute top-3 ${isRTL ? 'right-3' : 'left-3'}`} />
                    </div>
                  </div>
                  <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="animate-spin" /> : <>{t('auth.verify_id')} <ArrowIcon /></>}
                  </button>
                </motion.form>
              )}

              {/* STEP 4: TELEBIRR (Seller Only) */}
              {step === 'TELEBIRR' && (
                <motion.div 
                  key="telebirr"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                   <div className="text-center py-4">
                      <div className="w-20 h-20 bg-white rounded-2xl mx-auto flex items-center justify-center mb-4">
                        {/* Mock Telebirr Logo */}
                        <div className="w-12 h-12 rounded-full border-4 border-red-500 flex items-center justify-center">
                           <span className="text-red-500 font-bold text-xs">tele</span>
                        </div>
                      </div>
                      <h3 className="text-white font-bold text-lg">{t('auth.connect_tele')}</h3>
                      <p className="text-sm text-silver mt-2">
                        {t('auth.tele_desc')}
                      </p>
                   </div>

                   <button 
                     onClick={() => handleTelebirrLink(false)}
                     disabled={loading} 
                     className="w-full bg-[#D92D20] hover:bg-[#B5251B] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-red-500/30 transition-all flex items-center justify-center gap-2"
                   >
                     {loading ? <Loader2 className="animate-spin" /> : <>{t('auth.link_account')} <Wallet className="w-5 h-5" /></>}
                   </button>
                   
                   <button 
                     onClick={() => handleTelebirrLink(true)}
                     className="w-full text-silver hover:text-white text-sm font-medium py-2"
                   >
                     {t('auth.skip')}
                   </button>
                </motion.div>
              )}

              {/* SUCCESS STATE */}
              {step === 'SUCCESS' && (
                <motion.div 
                   key="success"
                   initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                   className="text-center py-10"
                >
                   <Loader2 className="w-12 h-12 text-copper animate-spin mx-auto mb-4" />
                   <h3 className="text-white font-bold">{t('auth.logging_in')}</h3>
                </motion.div>
              )}

            </AnimatePresence>

            {/* Error Message */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-sm text-center"
              >
                {error}
              </motion.div>
            )}

          </motion.div>

          <p className="mt-8 text-center text-xs text-silver/50">
            {t('auth.terms')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
