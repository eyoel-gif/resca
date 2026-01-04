
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { backend, Reservation } from '../services/backend';
import { Product, Seller, User } from '../types';
import { formatCurrency } from '../constants';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Package, 
  Settings, 
  TrendingUp, 
  Eye, 
  ShoppingBag, 
  AlertCircle,
  Loader2,
  Edit,
  Trash2,
  Plus,
  ShieldCheck,
  Save,
  Banknote,
  RefreshCcw,
  Clock,
  Archive,
  ShoppingCart,
  Heart,
  FileText,
  MapPin,
  LogOut
} from 'lucide-react';

// Types
interface SellerDashboardData {
  products: Product[];
  stats: {
    totalRevenue: number;
    activeListings: number;
    reservedItems: number;
    totalViews: number;
    totalFees?: number;
  };
  profile: Seller;
}

interface BuyerDashboardData {
  orders: Reservation[];
  wishlist: Product[];
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, loading: authLoading } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'listings' | 'orders' | 'wishlist' | 'settings'>('overview');
  const [sellerData, setSellerData] = useState<SellerDashboardData | null>(null);
  const [buyerData, setBuyerData] = useState<BuyerDashboardData | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Initialize view based on user role
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    } else if (user) {
      if (user.role === 'buyer') {
        setActiveTab('orders');
      } else {
        setActiveTab('overview');
      }
      fetchData();
    }
  }, [user, authLoading]);

  const fetchData = async () => {
    setDataLoading(true);
    if (!user) return;

    try {
      if (user.role === 'seller') {
        const data = await backend.getSellerDashboard(user.id);
        setSellerData(data);
      } else {
        const data = await backend.getBuyerDashboard(user.id);
        setBuyerData(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setDataLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Seller Actions
  const handleRenew = async (productId: string) => {
    setActionLoading(productId);
    try {
      const res = await backend.renewListing(productId);
      if (res.success && user) {
        const newData = await backend.getSellerDashboard(user.id);
        setSellerData(newData);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCompleteSale = async (productId: string) => {
    if (!window.confirm("Confirm full payment received? This will archive the listing.")) return;
    setActionLoading(productId);
    try {
      const res = await backend.completeSale(productId);
      if (res.success && user) {
        const newData = await backend.getSellerDashboard(user.id);
        setSellerData(newData);
      }
    } catch(e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  };

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen bg-void flex flex-col items-center justify-center text-silver">
        <Loader2 className="w-10 h-10 animate-spin text-copper mb-4" />
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-void pb-20">
      <Navbar />
      
      <main className="pt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl flex items-center justify-center border border-border">
               {user.avatar ? (
                  <img src={user.avatar} alt="Logo" className="w-full h-full object-cover rounded-2xl" />
               ) : (
                  <span className="text-2xl font-bold text-white">{user.name.substring(0, 2)}</span>
               )}
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-white flex items-center gap-2">
                {user.name}
                {user.isVerified && <ShieldCheck className="w-5 h-5 text-green-500" />}
              </h1>
              <p className="text-silver text-sm">{user.location || 'Addis Ababa'} • Member since {user.memberSince}</p>
              <div className="flex gap-2 mt-1">
                {user.role === 'seller' && (
                  <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-copper/20 text-copper uppercase tracking-wider">
                    Seller Account
                  </span>
                )}
                <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-slate-700 text-silver uppercase tracking-wider">
                  {user.role === 'buyer' ? 'Verified Buyer' : 'Basic Plan'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={handleLogout}
              className="px-4 py-3 border border-white/10 rounded-xl text-silver hover:text-white hover:bg-white/5 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
            {user.role === 'seller' && (
              <button 
                onClick={() => navigate('/sell')}
                className="flex items-center gap-2 px-6 py-3 copper-gradient text-white rounded-xl font-bold shadow-lg shadow-copper/20 hover:scale-[1.02] transition-transform"
              >
                <Plus className="w-5 h-5" />
                New Listing
              </button>
            )}
          </div>
        </div>

        {/* --- SELLER VIEW --- */}
        {user.role === 'seller' && sellerData && (
          <>
            {/* Tab Navigation */}
            <div className="flex border-b border-white/10 mb-8 overflow-x-auto">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`pb-4 px-6 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTab === 'overview' ? 'text-copper' : 'text-silver hover:text-white'}`}
              >
                <div className="flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" /> Overview
                </div>
                {activeTab === 'overview' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-copper rounded-t-full"></div>}
              </button>
              
              <button 
                onClick={() => setActiveTab('listings')}
                className={`pb-4 px-6 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTab === 'listings' ? 'text-copper' : 'text-silver hover:text-white'}`}
              >
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4" /> My Inventory
                  <span className="bg-slate-700 text-white text-[10px] px-2 py-0.5 rounded-full">{sellerData.products.length}</span>
                </div>
                {activeTab === 'listings' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-copper rounded-t-full"></div>}
              </button>

              <button 
                onClick={() => setActiveTab('settings')}
                className={`pb-4 px-6 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTab === 'settings' ? 'text-copper' : 'text-silver hover:text-white'}`}
              >
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4" /> Settings
                </div>
                {activeTab === 'settings' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-copper rounded-t-full"></div>}
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-fade-in">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-surface border border-border p-6 rounded-2xl">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-green-500/10 text-green-500 rounded-lg">
                          <TrendingUp className="w-6 h-6" />
                        </div>
                        <span className="text-xs text-silver bg-slate-800 px-2 py-1 rounded">Realized</span>
                    </div>
                    <h3 className="text-silver text-sm">Total Revenue</h3>
                    <p className="text-2xl font-bold text-white mt-1">{formatCurrency(sellerData.stats.totalRevenue)}</p>
                  </div>

                  <div className="bg-surface border border-border p-6 rounded-2xl">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-copper/10 text-copper rounded-lg">
                          <ShoppingBag className="w-6 h-6" />
                        </div>
                    </div>
                    <h3 className="text-silver text-sm">Active Listings</h3>
                    <p className="text-2xl font-bold text-white mt-1">{sellerData.stats.activeListings}</p>
                  </div>

                  <div className="bg-surface border border-border p-6 rounded-2xl">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-blue-500/10 text-blue-500 rounded-lg">
                          <AlertCircle className="w-6 h-6" />
                        </div>
                    </div>
                    <h3 className="text-silver text-sm">Pending (Sold/Reserved)</h3>
                    <p className="text-2xl font-bold text-white mt-1">{sellerData.stats.reservedItems}</p>
                  </div>

                  <div className="bg-surface border border-border p-6 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2">
                        <span className="text-[10px] text-silver uppercase tracking-wider">0.005% Fee</span>
                    </div>
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-purple-500/10 text-purple-500 rounded-lg">
                          <Banknote className="w-6 h-6" />
                        </div>
                    </div>
                    <h3 className="text-silver text-sm">Success Fees</h3>
                    <p className="text-2xl font-bold text-white mt-1">
                      {formatCurrency(sellerData.stats.totalFees || 0)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'listings' && (
              <div className="animate-fade-in">
                <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-slate-900/50 text-xs uppercase text-silver border-b border-white/5">
                          <tr>
                            <th className="px-6 py-4 font-medium">Product</th>
                            <th className="px-6 py-4 font-medium">Price</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium">Expiry</th>
                            <th className="px-6 py-4 font-medium">Views</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {sellerData.products.map(product => {
                            const daysLeft = product.expiryDate 
                              ? Math.ceil((new Date(product.expiryDate).getTime() - Date.now()) / (1000 * 3600 * 24)) 
                              : null;
                            
                            return (
                              <tr key={product.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <img src={product.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-800" />
                                    <div>
                                      <p className="text-sm font-medium text-white">{product.title}</p>
                                      <p className="text-xs text-silver capitalize">{product.category}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <p className="text-sm text-white font-medium">{formatCurrency(product.price)}</p>
                                </td>
                                <td className="px-6 py-4">
                                  {product.isExpired && product.status === 'available' ? (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                                      Expired
                                    </span>
                                  ) : (
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                                      product.status === 'available' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                      product.status === 'sold' ? 'bg-copper/10 text-copper border-copper/20' :
                                      product.status === 'archived' ? 'bg-slate-700 text-silver border-slate-600' :
                                      'bg-slate-700 text-silver border-slate-600'
                                    }`}>
                                      {product.status.toUpperCase()}
                                    </span>
                                  )}
                                </td>
                                <td className="px-6 py-4">
                                  {product.status === 'archived' ? (
                                    <span className="text-xs text-silver">Closed</span>
                                  ) : daysLeft !== null ? (
                                    <div className={`text-xs flex items-center gap-1 ${daysLeft <= 5 ? 'text-red-400 font-bold' : 'text-silver'}`}>
                                      <Clock className="w-3 h-3" /> 
                                      {daysLeft > 0 ? `${daysLeft} days` : 'Expired'}
                                    </div>
                                  ) : (
                                    <span className="text-xs text-silver">-</span>
                                  )}
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-1 text-sm text-silver">
                                    <Eye className="w-3 h-3" /> {product.viewCount}
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    {product.isExpired && product.status === 'available' && (
                                      <button 
                                        onClick={() => handleRenew(product.id)}
                                        disabled={actionLoading === product.id}
                                        className="px-3 py-1 bg-blue-600/20 text-blue-400 text-xs rounded hover:bg-blue-600/40 border border-blue-500/30 flex items-center gap-1 transition-colors"
                                      >
                                        {actionLoading === product.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCcw className="w-3 h-3" />}
                                        Renew
                                      </button>
                                    )}

                                    {product.status === 'sold' && (
                                      <button 
                                        onClick={() => handleCompleteSale(product.id)}
                                        disabled={actionLoading === product.id}
                                        className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded hover:bg-green-500/40 border border-green-500/30 flex items-center gap-1 transition-colors"
                                        title="Confirm Full Payment Received"
                                      >
                                        {actionLoading === product.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Archive className="w-3 h-3" />}
                                        Complete Sale
                                      </button>
                                    )}

                                    {product.status !== 'archived' && (
                                      <>
                                        <button className="p-2 hover:bg-slate-700 rounded-lg text-silver hover:text-white transition-colors">
                                          <Edit className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 hover:bg-red-900/30 rounded-lg text-silver hover:text-red-400 transition-colors">
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="max-w-2xl animate-fade-in">
                <div className="glass-panel p-8 rounded-2xl border border-white/5">
                  <h3 className="text-xl font-bold text-white mb-6">Store Profile</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-silver mb-2">Business Name</label>
                      <input type="text" defaultValue={user.name} className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-copper" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-silver mb-2">Location (Hub or Address)</label>
                      <input type="text" defaultValue={user.location} className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-copper" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-silver mb-2">Fayda ID Number</label>
                      <div className="relative">
                          <input type="text" defaultValue="FY-8829-1029" className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-copper pl-10" />
                          <ShieldCheck className="w-5 h-5 text-green-500 absolute left-3 top-3.5" />
                      </div>
                      <p className="text-xs text-green-500 mt-1 flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Verified Status Active</p>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex justify-end">
                        <button className="flex items-center gap-2 px-6 py-3 bg-copper hover:bg-orange-600 text-white rounded-xl font-medium transition-colors">
                          <Save className="w-4 h-4" /> Save Changes
                        </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* --- BUYER VIEW --- */}
        {user.role === 'buyer' && buyerData && (
          <>
            <div className="flex border-b border-white/10 mb-8 overflow-x-auto">
              <button 
                onClick={() => setActiveTab('orders')}
                className={`pb-4 px-6 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTab === 'orders' ? 'text-copper' : 'text-silver hover:text-white'}`}
              >
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" /> My Orders
                  <span className="bg-slate-700 text-white text-[10px] px-2 py-0.5 rounded-full">{buyerData.orders.length}</span>
                </div>
                {activeTab === 'orders' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-copper rounded-t-full"></div>}
              </button>

              <button 
                onClick={() => setActiveTab('wishlist')}
                className={`pb-4 px-6 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTab === 'wishlist' ? 'text-copper' : 'text-silver hover:text-white'}`}
              >
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4" /> Wishlist
                  <span className="bg-slate-700 text-white text-[10px] px-2 py-0.5 rounded-full">{buyerData.wishlist.length}</span>
                </div>
                {activeTab === 'wishlist' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-copper rounded-t-full"></div>}
              </button>
            </div>

            {activeTab === 'orders' && (
              <div className="space-y-6 animate-fade-in">
                {buyerData.orders.length === 0 ? (
                  <div className="text-center py-20 bg-surface/30 rounded-2xl border border-white/5">
                    <ShoppingBag className="w-12 h-12 text-silver mx-auto mb-4 opacity-50" />
                    <h3 className="text-white font-bold mb-2">No Orders Yet</h3>
                    <p className="text-silver mb-6">Browse the marketplace to find equipment.</p>
                    <button onClick={() => navigate('/marketplace')} className="text-copper hover:underline">Start Browsing</button>
                  </div>
                ) : (
                  buyerData.orders.map(order => (
                    <div key={order.id} className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row gap-6">
                       <div className="w-full md:w-32 h-32 bg-slate-800 rounded-xl overflow-hidden shrink-0">
                          <img src={order.productImage} alt="" className="w-full h-full object-cover" />
                       </div>
                       <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                             <div>
                                <h3 className="font-bold text-white text-lg">{order.productTitle}</h3>
                                <p className="text-xs text-silver">Order ID: {order.id}</p>
                             </div>
                             <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                               order.status === 'completed' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-400'
                             }`}>
                               {order.status}
                             </span>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                             <div>
                               <p className="text-silver text-xs">Date</p>
                               <p className="text-white font-medium">{new Date(order.date).toLocaleDateString()}</p>
                             </div>
                             <div>
                               <p className="text-silver text-xs">Total Amount</p>
                               <p className="text-white font-medium">{formatCurrency(order.totalPrice)}</p>
                             </div>
                             <div>
                               <p className="text-silver text-xs">Paid</p>
                               <p className="text-green-400 font-medium">{formatCurrency(order.amountPaid)}</p>
                             </div>
                             <div>
                               <p className="text-silver text-xs">Location</p>
                               <div className="flex items-center gap-1 text-white">
                                 <MapPin className="w-3 h-3" /> {order.location.split(' ').slice(0, 2).join(' ')}
                               </div>
                             </div>
                          </div>

                          <div className="mt-6 flex gap-3">
                             <button 
                               onClick={() => navigate(`/receipt/${order.id}`)}
                               className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white flex items-center gap-2 transition-colors"
                             >
                               <FileText className="w-4 h-4" /> View Receipt
                             </button>
                             {order.status === 'completed' && (
                               <button 
                                 onClick={() => navigate(`/delivery/${order.id}`)}
                                 className="px-4 py-2 bg-copper/10 hover:bg-copper/20 border border-copper/30 rounded-lg text-sm text-copper flex items-center gap-2 transition-colors"
                               >
                                 <Clock className="w-4 h-4" /> Track Delivery
                               </button>
                             )}
                          </div>
                       </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                 {buyerData.wishlist.length === 0 ? (
                    <div className="col-span-full text-center py-20">
                       <Heart className="w-12 h-12 text-silver mx-auto mb-4 opacity-50" />
                       <p className="text-silver">Your wishlist is empty.</p>
                    </div>
                 ) : (
                    buyerData.wishlist.map(product => (
                      <div key={product.id} className="group relative bg-surface rounded-2xl overflow-hidden border border-border">
                         <div className="h-48 relative overflow-hidden">
                            <img src={product.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                         </div>
                         <div className="p-4">
                            <h3 className="font-bold text-white mb-1 truncate">{product.title}</h3>
                            <p className="text-copper font-bold">{formatCurrency(product.price)}</p>
                            <button 
                              onClick={() => navigate(`/product/${product.id}`)}
                              className="mt-4 w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white transition-colors"
                            >
                              View Item
                            </button>
                         </div>
                      </div>
                    ))
                 )}
              </div>
            )}
          </>
        )}

      </main>
    </div>
  );
};

export default Dashboard;
