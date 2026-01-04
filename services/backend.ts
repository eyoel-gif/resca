import { Product, Seller, FilterState, SortOption, ListingTier, User, UserRole } from '../types';
import { MOCK_PRODUCTS, MOCK_SUPPLIERS } from '../constants';
import { TRANSLATIONS, Language } from '../constants/translations';

const DB_KEYS = {
  PRODUCTS: 'resca_products',
  RESERVATIONS: 'resca_reservations',
  WISHLIST: 'resca_wishlist',
  UNLOCKED_ITEMS: 'resca_unlocked_items'
};

export interface Reservation {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  buyerName: string;
  buyerPhone: string;
  amountPaid: number;
  totalPrice: number;
  date: string;
  status: 'active' | 'completed' | 'cancelled';
  location: string;
  platformFee?: number; // 0.005% commission for suppliers
  paymentMethod?: 'telebirr' | 'chapa';
  sellerName: string;
  sellerPhone: string;
  sellerTelegram?: string;
}

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Initialize "Database" if empty, or merge new mock items
const initDB = () => {
  if (typeof window === 'undefined') return; // Guard for SSR if ever needed
  
  const storedProductsStr = localStorage.getItem(DB_KEYS.PRODUCTS);
  
  if (!storedProductsStr) {
    console.log('Seeding Database with full catalog...');
    localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(MOCK_PRODUCTS));
  } else {
    // Merge Strategy: Ensure all new MOCK_PRODUCTS exist in the local storage
    // This allows us to add new categories/items without wiping user's created listings
    try {
        const storedProducts: Product[] = JSON.parse(storedProductsStr);
        const storedIds = new Set(storedProducts.map(p => p.id));
        let addedCount = 0;

        MOCK_PRODUCTS.forEach(mockItem => {
            if (!storedIds.has(mockItem.id)) {
                storedProducts.push(mockItem);
                addedCount++;
            }
        });

        if (addedCount > 0) {
            console.log(`Merged ${addedCount} new items into database.`);
            localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(storedProducts));
        }
    } catch (e) {
        console.error("Failed to merge DB, resetting...", e);
        localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(MOCK_PRODUCTS));
    }
  }
};

export const backend = {
  // ... (Existing product methods remain unchanged) ...

  /**
   * Helper to get unlocked product IDs for the current user
   */
  getUnlockedItemIds(): string[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(DB_KEYS.UNLOCKED_ITEMS);
    return stored ? JSON.parse(stored) : [];
  },

  /**
   * Unlock a specific product (Simulate Payment)
   */
  async unlockProduct(productId: string): Promise<{ success: boolean; message: string }> {
    await delay(1000); // Simulate Telebirr payment
    const currentUnlocked = this.getUnlockedItemIds();
    if (!currentUnlocked.includes(productId)) {
      currentUnlocked.push(productId);
      localStorage.setItem(DB_KEYS.UNLOCKED_ITEMS, JSON.stringify(currentUnlocked));
    }
    return { success: true, message: 'Item details unlocked.' };
  },

  /**
   * Submit an Offer for a Product with Smart Logic
   */
  async submitOffer(productId: string, offerAmount: number): Promise<{ success: boolean; message: string; status?: 'accepted' | 'pending' | 'rejected' }> {
    initDB();
    await delay(1200); // Simulate processing

    const productsStr = localStorage.getItem(DB_KEYS.PRODUCTS);
    let products: Product[] = productsStr ? JSON.parse(productsStr) : [];
    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
        return { success: false, message: 'Product not found.' };
    }

    const product = products[productIndex];
    
    if (product.status !== 'available') {
        return { success: false, message: 'Item is no longer available.', status: 'rejected' };
    }

    // Check if product allows offers
    if (product.negotiable === false) {
       return { success: false, message: 'This item does not accept offers.', status: 'rejected' };
    }

    const price = product.price;
    const ratio = offerAmount / price;

    // Logic: Offer must be close (~85%) to be considered
    if (ratio < 0.85) { 
        return { success: false, message: 'Offer rejected: Price is too low compared to asking price.', status: 'rejected' };
    }

    // Logic: If offer is very close (~95%), simulate instant Seller Approval and Mark Sold
    if (ratio >= 0.95) { 
        // Update product to SOLD
        product.status = 'sold';
        // Update the price to the agreed offer amount (optional, but realistic)
        product.price = offerAmount;
        product.reserveAmount = Math.ceil(offerAmount * 0.10);
        
        products[productIndex] = product;
        localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(products));

        return { success: true, message: 'Offer accepted! The item has been marked as sold.', status: 'accepted' };
    }

    // Logic: Pending Seller Review (85% - 94%)
    return { success: true, message: 'Offer is within range. Sent to seller for final approval.', status: 'pending' };
  },

  /**
   * Fetch products with advanced filtering and sorting
   * Applies "isLocked" state logic
   */
  async getProducts(filters: FilterState, sort: SortOption = 'newest', sellerId?: string): Promise<Product[]> {
    initDB();
    await delay(800); // Simulate network latency

    try {
      const productsStr = localStorage.getItem(DB_KEYS.PRODUCTS);
      let products: Product[] = productsStr ? JSON.parse(productsStr) : [];
      
      const now = new Date();
      const unlockedIds = this.getUnlockedItemIds();

      // 1. Check for Expiration & Filter
      products = products.map(p => {
        // Check if expired
        if (p.expiryDate && new Date(p.expiryDate) < now) {
          p.isExpired = true;
        }

        // Apply Pay-per-View Lock Logic
        // If it's your own shop (sellerId matches), it shouldn't be locked, but for this demo context we assume user is buyer
        const isUnlocked = unlockedIds.includes(p.id);
        
        return { 
          ...p, 
          isLocked: !isUnlocked 
        };
      }).filter(p => {
        // HIDE ARCHIVED ITEMS FROM PUBLIC MARKETPLACE
        // If sellerId is present, we are in a specific shop view or dashboard, so we might want to see them (or handle separately)
        // But generally, "taken off" implies hidden from search.
        if (!sellerId && p.status === 'archived') return false;

        // If viewing specific seller's shop/dashboard, show expired items
        // Otherwise (Public Marketplace), hide expired items
        if (!sellerId && p.isExpired) return false;
        
        // Seller ID Filter (For Shop Pages)
        if (sellerId && p.seller.id !== sellerId) return false;

        // Category
        if (filters.category !== 'all' && p.category !== filters.category) return false;

        // Price Range
        if (filters.minPrice !== undefined && p.price < filters.minPrice) return false;
        if (filters.maxPrice !== undefined && p.price > filters.maxPrice) return false;

        // Conditions
        if (filters.conditions && filters.conditions.length > 0) {
          if (!filters.conditions.includes(p.condition)) return false;
        }

        // Verified Only Filter
        if (filters.onlyVerified && !p.isRescaVerified) return false;

        return true;
      });

      // 2. Sort
      products.sort((a, b) => {
        switch (sort) {
          case 'price_asc':
            return a.price - b.price;
          case 'price_desc':
            return b.price - a.price;
          case 'views':
            return (b.viewCount || 0) - (a.viewCount || 0);
          case 'newest':
          default:
            if (!isNaN(Number(a.id)) && !isNaN(Number(b.id))) {
               return Number(b.id) - Number(a.id); // Descending ID
            }
            return 0;
        }
      });

      return products;
    } catch (e) {
      console.error("Database Error:", e);
      return [];
    }
  },

  /**
   * Fetch a single product by ID
   */
  async getProductById(id: string): Promise<Product | null> {
    initDB();
    await delay(400);

    const productsStr = localStorage.getItem(DB_KEYS.PRODUCTS);
    const products: Product[] = productsStr ? JSON.parse(productsStr) : [];
    const unlockedIds = this.getUnlockedItemIds();

    const product = products.find(p => p.id === id);
    if (!product) return null;

    // Apply lock logic
    return {
      ...product,
      isLocked: !unlockedIds.includes(product.id)
    };
  },

  /**
   * Fetch related products based on category and seller
   */
  async getRelatedProducts(currentProductId: string): Promise<Product[]> {
    initDB();
    await delay(600); // Simulate network

    const productsStr = localStorage.getItem(DB_KEYS.PRODUCTS);
    const products: Product[] = productsStr ? JSON.parse(productsStr) : [];
    
    const currentProduct = products.find(p => p.id === currentProductId);
    if (!currentProduct) return [];

    // Filter logic: Same category OR Same seller, exclude current
    const related = products.filter(p => 
      p.id !== currentProductId && 
      p.status === 'available' && // Only show available items
      (p.category === currentProduct.category || p.seller.id === currentProduct.seller.id)
    );

    // Limit to 4 items
    return related.slice(0, 4);
  },

  /**
   * Mock external API integration to scan image
   */
  async mockExternalAIScan(imageUrl: string): Promise<'clear' | 'flagged'> {
    console.log(`[External API] Sending ${imageUrl} to AI Content Detector...`);
    await delay(800);
    // Simple mock logic: if the URL contains 'robot' or 'ai', flag it
    if (imageUrl.toLowerCase().includes('robot') || imageUrl.toLowerCase().includes('render')) {
      return 'flagged';
    }
    return 'clear';
  },

  /**
   * AI Chat Assistant Logic (Meski)
   */
  async sendAiMessage(message: string, contextProduct?: Product | null): Promise<string> {
    await delay(1500); // Simulate AI thinking time

    const msg = message.toLowerCase();

    // STRICT POLICY: AI cannot handle payments
    if (msg.includes('pay') || msg.includes('cash') || msg.includes('transfer') || msg.includes('money') || msg.includes('bank') || msg.includes('card')) {
      return "I am Meski, an AI assistant. I cannot process payments, accept cash, or handle banking details directly. Please use the secure 'Reserve' or 'Buy Now' buttons on the product page to complete your transaction via Telebirr or Chapa.";
    }

    // 1. Product Specific Context Logic
    if (contextProduct) {
        if (msg.includes('price') || msg.includes('expensive') || msg.includes('cost') || msg.includes('worth')) {
            return `The asking price is ${contextProduct.price.toLocaleString()} ETB. Based on market data for ${contextProduct.condition} ${contextProduct.title}, this is a competitive rate. You can reserve it for ${contextProduct.reserveAmount.toLocaleString()} ETB via the platform.`;
        }
        
        if (msg.includes('condition') || msg.includes('quality') || msg.includes('work') || msg.includes('broken')) {
            if (contextProduct.conditionReport) {
                return `This item has a Grade ${contextProduct.conditionReport.grade} condition report. Inspector ${contextProduct.conditionReport.inspectorName} noted: "${contextProduct.conditionReport.notes}". It is fully functional.`;
            }
            return `This item is listed as ${contextProduct.condition}. It hasn't been fully inspected at a Resca Hub yet, so I recommend inspecting it personally after making a reservation.`;
        }

        if (msg.includes('power') || msg.includes('electric') || msg.includes('gas') || msg.includes('phase') || msg.includes('specs')) {
            const specList = Object.entries(contextProduct.specs).map(([k,v]) => `${k}: ${v}`).join(', ');
            return `This unit runs on ${contextProduct.power}. Technical specs: ${specList}. Please ensure your location supports this.`;
        }

        if (msg.includes('available') || msg.includes('stock')) {
            return contextProduct.status === 'available' 
                ? "Yes, this unit is currently available! I suggest reserving it soon as high-value items move fast."
                : `This item is currently marked as ${contextProduct.status}.`;
        }
        
        return `I can analyze specifications, pricing, or condition reports for this ${contextProduct.title}. I cannot handle payments, but I can guide you to the right buttons!`;
    }

    // 2. Search & List Logic (Showing listed items)
    if (msg.includes('find') || msg.includes('show') || msg.includes('search') || msg.includes('list') || msg.includes('looking for')) {
        const productsStr = localStorage.getItem(DB_KEYS.PRODUCTS);
        const products: Product[] = productsStr ? JSON.parse(productsStr) : [];
        
        // Basic keyword matching from user message
        const keywords = msg.split(' ').filter(w => w.length > 3 && !['show', 'find', 'search', 'list', 'items', 'products'].includes(w));
        
        if (keywords.length > 0) {
            const matches = products.filter(p => 
                p.status === 'available' &&
                keywords.some(k => p.title.toLowerCase().includes(k) || p.category.includes(k) || p.description.toLowerCase().includes(k))
            );

            if (matches.length > 0) {
                 const matchTitles = matches.slice(0, 3).map(p => p.title).join(', ');
                 return `I found these listed items for you: ${matchTitles}. You can view full details in the Marketplace.`;
            }
            return "I searched our inventory but couldn't find exact matches. Try browsing the 'Marketplace' tab for all categories.";
        }
    }

    // 3. General Marketplace Logic
    if (msg.includes('sell')) {
        return "To sell equipment, click the 'Sell' button in the navigation bar. You can list individual items or register as a certified supplier.";
    }

    if (msg.includes('reserve') || msg.includes('deposit')) {
        return "Our Reserve Model requires a 10% deposit to lock an item. I cannot take this deposit myself; please use the interface to pay via Telebirr.";
    }

    if (msg.includes('location') || msg.includes('where')) {
        return "Resca operates in Addis Ababa with hubs in Kera and Bole. Check specific listings for their exact location or Plus Code.";
    }

    return "I am Meski, your Kitchen Queen AI assistant. I can help you find listed equipment and analyze product data. Note that I cannot process payments or cash directly. How can I help you today?";
  },

  /**
   * Create a new product listing
   * @param sellerIdentity - Can be 'individual', 'supplier', or a specific Seller ID (e.g. 's1')
   */
  async createProduct(productData: Partial<Product>, sellerIdentity: string = 'individual'): Promise<{ success: boolean; product?: Product; message: string }> {
    initDB();
    // 1. Simulate External AI Scan API Call
    let aiStatus: 'pending' | 'clear' | 'flagged' = 'pending';
    if (productData.images && productData.images.length > 0) {
      aiStatus = await this.mockExternalAIScan(productData.images[0]);
    }

    if (aiStatus === 'flagged') {
      return { success: false, message: 'Listing Rejected: Our system detected AI-generated imagery. Please upload real photos.' };
    }

    // 2. Normal creation latency
    await delay(1000); 

    try {
      const productsStr = localStorage.getItem(DB_KEYS.PRODUCTS);
      const products: Product[] = productsStr ? JSON.parse(productsStr) : [];

      let mockSeller: Seller;

      // Check if sellerIdentity is a known Supplier ID or the default individual 's1'
      const knownSupplier = MOCK_SUPPLIERS.find(s => s.id === sellerIdentity);
      
      if (knownSupplier) {
        mockSeller = knownSupplier;
      } else if (sellerIdentity === 's1') {
         // The default individual dashboard user
         mockSeller = {
            id: 's1',
            name: 'Addis Kitchen Sol.',
            type: 'individual',
            isVerified: true,
            rating: 4.8,
            location: 'Kera Hub, Addis Ababa',
            memberSince: '2021'
         };
      } else if (sellerIdentity === 'supplier') {
        // Fallback for generic supplier creation
        mockSeller = {
          id: 'shop_1',
          name: 'My Certified Supplier Shop',
          type: 'supplier',
          isVerified: true,
          rating: 5.0,
          location: 'Bole',
          memberSince: '2024'
        };
      } else {
        // Fallback for generic individual or 'individual' type
        mockSeller = {
          id: sellerIdentity, 
          name: 'My Shop',
          type: 'individual',
          isVerified: false,
          rating: 0,
          location: 'Addis Ababa',
          memberSince: '2024'
        };
      }

      // Calculate Expiry Date (30 Days from now)
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);

      const newProduct: Product = {
        id: `${Date.now()}`, // Numeric ID string for sorting compatibility
        title: productData.title || 'Untitled Equipment',
        description: productData.description || '',
        category: productData.category || 'cooking',
        price: Number(productData.price) || 0,
        // Auto-calculate 10% reserve
        reserveAmount: Math.ceil((Number(productData.price) || 0) * 0.10),
        condition: productData.condition || 'Used (Good)',
        power: productData.power || 'Electric (1-Phase)',
        // Use provided images or a default placeholder if empty
        images: productData.images && productData.images.length > 0 
          ? productData.images 
          : ['https://picsum.photos/800/600'], 
        specs: productData.specs || {},
        seller: mockSeller,
        status: 'available',
        location: productData.location || 'Addis Ababa',
        isFeatured: productData.listingTier === 'premium',
        viewCount: 0,
        isRescaVerified: sellerIdentity !== 's1' && sellerIdentity !== 'individual', // Auto-verify suppliers in this demo logic
        listingTier: productData.listingTier,
        expiryDate: expiryDate.toISOString(),
        isExpired: false,
        negotiable: true,
        // AI & Compliance Fields
        isImageCertified: productData.isImageCertified,
        aiDetectionStatus: aiStatus,
        externalIntegrationId: `EXT-${Date.now()}` // Mock ID for external systems
      };

      // Add to beginning of array
      products.unshift(newProduct); 
      localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(products));

      return { success: true, product: newProduct, message: 'Listing created successfully!' };
    } catch (e) {
      console.error(e);
      return { success: false, message: 'Failed to create listing.' };
    }
  },

  /**
   * Renew a product listing (Simulate payment and extension)
   */
  async renewListing(productId: string): Promise<{ success: boolean; message: string; newExpiry?: string }> {
    initDB();
    await delay(1500);

    const productsStr = localStorage.getItem(DB_KEYS.PRODUCTS);
    let products: Product[] = productsStr ? JSON.parse(productsStr) : [];
    
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex === -1) return { success: false, message: 'Product not found' };

    // Extend by 30 days from NOW (or from previous expiry if we want strictly additive, but let's do from now)
    const newExpiry = new Date();
    newExpiry.setDate(newExpiry.getDate() + 30);

    products[productIndex].expiryDate = newExpiry.toISOString();
    products[productIndex].isExpired = false;
    products[productIndex].status = 'available'; // Reset status if it was expired

    localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(products));

    return { 
      success: true, 
      message: 'Listing renewed for 30 days.',
      newExpiry: newExpiry.toISOString()
    };
  },

  /**
   * Mark a product as Fully Paid (Archived)
   */
  async completeSale(productId: string): Promise<{ success: boolean; message: string }> {
    initDB();
    await delay(800);

    const productsStr = localStorage.getItem(DB_KEYS.PRODUCTS);
    let products: Product[] = productsStr ? JSON.parse(productsStr) : [];
    
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex === -1) return { success: false, message: 'Product not found' };

    // Change status to 'archived' - removing it from public view
    products[productIndex].status = 'archived';
    
    localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(products));

    return { success: true, message: 'Item archived. Full payment recorded.' };
  },

  /**
   * Process a reservation with Buyer Details and Telebirr Payment Simulation
   */
  async createReservation(
    productId: string, 
    buyerDetails: { name: string; phone: string }
  ): Promise<{ success: boolean; message: string; receiptId?: string }> {
    initDB();
    await delay(2500); // Simulate Telebirr payment processing time (USSD push, etc.)

    const productsStr = localStorage.getItem(DB_KEYS.PRODUCTS);
    let products: Product[] = productsStr ? JSON.parse(productsStr) : [];
    
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
      throw new Error('Product not found');
    }

    const product = products[productIndex];

    if (product.status !== 'available') {
      return { success: false, message: 'Item is no longer available.' };
    }

    // 1. Update Product Status to SOLD (Per requirement: "say sold until full payment")
    product.status = 'sold';
    product.reserveAmount = Math.ceil(product.price * 0.10); // Ensure consistency
    products[productIndex] = product;
    localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(products));

    // 2. Calculate Success Fee (Commission) logic
    let fee = 0;
    if (product.seller.type === 'supplier') {
      // 0.005% of Total Price (0.00005)
      fee = product.price * 0.00005;
    }

    // 3. Create Reservation Record
    const receiptId = `REC-${Date.now().toString().slice(-6)}`;
    
    // MOCK SELLER CONTACTS (Since not in basic types yet)
    // We deterministically generate based on seller ID or use fixed mock
    const sellerPhone = product.seller.id === 's1' ? '+251911223344' : '+251911998877';
    const sellerTelegram = 'rescaseller';

    const newReservation: Reservation = {
      id: receiptId,
      productId: product.id,
      productTitle: product.title,
      productImage: product.images[0],
      buyerName: buyerDetails.name,
      buyerPhone: buyerDetails.phone,
      amountPaid: product.reserveAmount,
      totalPrice: product.price,
      date: new Date().toISOString(),
      status: 'active',
      location: product.location,
      platformFee: fee,
      paymentMethod: 'telebirr',
      sellerName: product.seller.name,
      sellerPhone: sellerPhone,
      sellerTelegram: sellerTelegram
    };

    const reservationsStr = localStorage.getItem(DB_KEYS.RESERVATIONS);
    const reservations: Reservation[] = reservationsStr ? JSON.parse(reservationsStr) : [];
    reservations.push(newReservation);
    localStorage.setItem(DB_KEYS.RESERVATIONS, JSON.stringify(reservations));

    return { 
      success: true, 
      message: 'Payment Successful! Item marked as Sold.',
      receiptId: receiptId
    };
  },

  /**
   * Direct Purchase for Items < 100k
   */
  async processDirectPurchase(productId: string, paymentMethod: 'telebirr' | 'chapa' = 'telebirr'): Promise<{ success: boolean; message: string; orderId?: string }> {
    initDB();
    await delay(3000); // Simulate Full Payment API Call

    const productsStr = localStorage.getItem(DB_KEYS.PRODUCTS);
    let products: Product[] = productsStr ? JSON.parse(productsStr) : [];
    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex === -1) return { success: false, message: 'Product not found' };
    const product = products[productIndex];

    if (product.status !== 'available') return { success: false, message: 'Item unavailable.' };
    if (product.price >= 100000) return { success: false, message: 'Direct purchase limit exceeded.' };

    // Mark as SOLD immediately
    product.status = 'sold';
    products[productIndex] = product;
    localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(products));

    // MOCK SELLER CONTACTS
    const sellerPhone = product.seller.id === 's1' ? '+251911223344' : '+251911998877';

    // Create Order Record (Reusing Reservation Interface for simplicity, but treating amountPaid = totalPrice)
    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    const newOrder: Reservation = {
      id: orderId,
      productId: product.id,
      productTitle: product.title,
      productImage: product.images[0],
      buyerName: 'Direct Buyer', // Placeholder, updated in delivery
      buyerPhone: '',
      amountPaid: product.price, // Full amount
      totalPrice: product.price,
      date: new Date().toISOString(),
      status: 'completed', // Fully paid
      location: product.location,
      paymentMethod: paymentMethod,
      sellerName: product.seller.name,
      sellerPhone: sellerPhone,
      sellerTelegram: 'rescaseller'
    };

    const reservationsStr = localStorage.getItem(DB_KEYS.RESERVATIONS);
    const reservations: Reservation[] = reservationsStr ? JSON.parse(reservationsStr) : [];
    reservations.push(newOrder);
    localStorage.setItem(DB_KEYS.RESERVATIONS, JSON.stringify(reservations));

    return { 
      success: true, 
      message: 'Payment Verified. Redirecting to delivery.', 
      orderId: orderId 
    };
  },

  /**
   * Fetch a reservation by ID for Receipt Page
   */
  async getReservation(receiptId: string): Promise<Reservation | null> {
    initDB();
    await delay(300);
    const reservationsStr = localStorage.getItem(DB_KEYS.RESERVATIONS);
    const reservations: Reservation[] = reservationsStr ? JSON.parse(reservationsStr) : [];
    return reservations.find(r => r.id === receiptId) || null;
  },

  /**
   * Generate Receipt Document
   */
  async generateReceipt(receiptId: string): Promise<{ success: boolean; blob?: Blob; filename?: string; message: string }> {
    initDB();
    await delay(2000); // Simulate generation delay

    const reservationsStr = localStorage.getItem(DB_KEYS.RESERVATIONS);
    const reservations: Reservation[] = reservationsStr ? JSON.parse(reservationsStr) : [];
    const r = reservations.find(res => res.id === receiptId);

    if (!r) {
      return { success: false, message: 'Receipt not found.' };
    }

    // Create a printable HTML string
    const html = `
<!DOCTYPE html>
<html>
<head>
<title>Resca Receipt - ${r.id}</title>
<style>
  body { font-family: 'Courier New', Courier, monospace; background: #fff; color: #000; padding: 40px; max-width: 600px; margin: 0 auto; border: 1px solid #ccc; }
  .header { text-align: center; border-bottom: 2px dashed #000; padding-bottom: 20px; margin-bottom: 20px; }
  .logo { font-size: 30px; font-weight: bold; }
  .meta { display: flex; justify-content: space-between; margin-bottom: 20px; }
  .item { border-bottom: 1px solid #eee; padding: 10px 0; }
  .total { text-align: right; font-size: 20px; font-weight: bold; margin-top: 20px; border-top: 2px solid #000; padding-top: 10px; }
  .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #666; }
</style>
</head>
<body>
  <div class="header">
    <div class="logo">RESCA</div>
    <div>The Kitchen Queen</div>
    <div>Addis Ababa, Ethiopia</div>
  </div>
  
  <div class="meta">
    <div>
      <strong>Receipt #:</strong> ${r.id}<br>
      <strong>Date:</strong> ${new Date(r.date).toLocaleDateString()}
    </div>
    <div style="text-align: right;">
      <strong>Buyer:</strong> ${r.buyerName}<br>
      <strong>Phone:</strong> ${r.buyerPhone}
    </div>
  </div>

  <div class="item">
    <strong>Item:</strong> ${r.productTitle}<br>
    <small>Loc: ${r.location}</small>
    <div style="float: right;">${new Intl.NumberFormat('en-ET', { style: 'currency', currency: 'ETB' }).format(r.totalPrice)}</div>
  </div>

  <div class="total">
    PAID: ${new Intl.NumberFormat('en-ET', { style: 'currency', currency: 'ETB' }).format(r.amountPaid)}
  </div>
  ${r.totalPrice > r.amountPaid ? `<div style="text-align: right; color: #666; margin-top: 5px;">Remaining: ${new Intl.NumberFormat('en-ET', { style: 'currency', currency: 'ETB' }).format(r.totalPrice - r.amountPaid)}</div>` : ''}

  <div class="footer">
    <p>Auth Code: ${Math.random().toString(36).substring(7).toUpperCase()}</p>
    <p>Thank you for your business!</p>
  </div>
</body>
</html>
    `;

    const blob = new Blob([html], { type: 'text/html' });
    return {
      success: true,
      blob,
      filename: `Resca_Receipt_${r.id}.html`,
      message: 'Receipt generated.'
    };
  },

  /**
   * Fetch dashboard data for a specific seller
   */
  async getSellerDashboard(sellerId: string) {
    initDB();
    await delay(600);

    const productsStr = localStorage.getItem(DB_KEYS.PRODUCTS);
    const allProducts: Product[] = productsStr ? JSON.parse(productsStr) : [];
    
    // Determine active/expired for dashboard logic
    const now = new Date();
    allProducts.forEach(p => {
       if (p.expiryDate && new Date(p.expiryDate) < now) {
         p.isExpired = true;
       }
    });

    const sellerProducts = allProducts.filter(p => p.seller.id === sellerId);
    
    // Total Revenue = Sum of fully paid items (Archived)
    const totalRevenue = sellerProducts
      .filter(p => p.status === 'archived')
      .reduce((acc, curr) => acc + curr.price, 0);
      
    // Active means available AND not expired
    const activeListings = sellerProducts.filter(p => p.status === 'available' && !p.isExpired).length;
    
    // Reserved Items are now items marked as 'sold' (10% paid, waiting for full)
    const reservedItems = sellerProducts.filter(p => p.status === 'sold').length;
    
    const totalViews = sellerProducts.reduce((acc, curr) => acc + (curr.viewCount || 0), 0);

    // Fetch Reservations to calculate success fees for this seller's products
    const reservationsStr = localStorage.getItem(DB_KEYS.RESERVATIONS);
    const reservations: Reservation[] = reservationsStr ? JSON.parse(reservationsStr) : [];
    
    const sellerProductIds = sellerProducts.map(p => p.id);
    const sellerReservations = reservations.filter(r => sellerProductIds.includes(r.productId));
    
    // Calculate total fees
    const totalFees = sellerReservations.reduce((acc, curr) => acc + (curr.platformFee || 0), 0);

    // Mock Profile
    let profile: Seller;
    const supplierMatch = MOCK_SUPPLIERS.find(s => s.id === sellerId);
    
    if (supplierMatch) {
      profile = supplierMatch;
    } else {
      profile = {
        id: sellerId,
        name: 'My Store',
        type: 'individual',
        isVerified: true,
        rating: 0,
        location: 'Addis Ababa',
        memberSince: '2024'
      };
    }

    return {
      products: sellerProducts,
      stats: { totalRevenue, activeListings, reservedItems, totalViews, totalFees },
      profile
    };
  },

  /**
   * Fetch data for Buyer Dashboard (My Orders, etc.)
   */
  async getBuyerDashboard(userId: string) {
    initDB();
    await delay(600);

    // In a real app, orders would be linked by buyerId. 
    // Here we'll return all reservations for demo or filter if buyer logic was implemented in reservations.
    // For demo simplicity, we'll return all reservations.
    const reservationsStr = localStorage.getItem(DB_KEYS.RESERVATIONS);
    const reservations: Reservation[] = reservationsStr ? JSON.parse(reservationsStr) : [];
    
    // In a real scenario:
    // const myOrders = reservations.filter(r => r.buyerId === userId);
    // For demo, just return the recent 5
    const myOrders = reservations.slice(-5).reverse();

    const wishlistIdsStr = localStorage.getItem(DB_KEYS.WISHLIST);
    const wishlistIds = wishlistIdsStr ? JSON.parse(wishlistIdsStr) : [];
    
    const productsStr = localStorage.getItem(DB_KEYS.PRODUCTS);
    const allProducts: Product[] = productsStr ? JSON.parse(productsStr) : [];
    const wishlistItems = allProducts.filter(p => wishlistIds.includes(p.id));

    return {
      orders: myOrders,
      wishlist: wishlistItems
    };
  },

  // --- SUPPLIER METHODS ---

  /**
   * Fetch all official suppliers
   */
  async getSuppliers(): Promise<Seller[]> {
    await delay(500);
    return MOCK_SUPPLIERS;
  },

  /**
   * Fetch a specific shop profile by ID
   */
  async getShopById(id: string): Promise<Seller | null> {
    await delay(300);
    return MOCK_SUPPLIERS.find(s => s.id === id) || null;
  },

  async resetDatabase() {
    localStorage.removeItem(DB_KEYS.PRODUCTS);
    localStorage.removeItem(DB_KEYS.RESERVATIONS);
    localStorage.removeItem(DB_KEYS.WISHLIST);
    localStorage.removeItem(DB_KEYS.UNLOCKED_ITEMS);
    initDB();
    return true;
  },

  // --- WISHLIST METHODS ---

  /**
   * Get all products in the wishlist
   */
  async getWishlist(): Promise<string[]> {
    initDB();
    await delay(200);
    const wishlistIdsStr = localStorage.getItem(DB_KEYS.WISHLIST);
    return wishlistIdsStr ? JSON.parse(wishlistIdsStr) : [];
  },

  /**
   * Toggle a product in the wishlist
   */
  async toggleWishlist(productId: string): Promise<{ success: boolean; isInWishlist: boolean; message: string }> {
    initDB();
    await delay(200);
    
    const wishlistIdsStr = localStorage.getItem(DB_KEYS.WISHLIST);
    let wishlistIds: string[] = wishlistIdsStr ? JSON.parse(wishlistIdsStr) : [];
    
    let isInWishlist = false;
    
    if (wishlistIds.includes(productId)) {
      wishlistIds = wishlistIds.filter(id => id !== productId);
      isInWishlist = false;
    } else {
      wishlistIds.push(productId);
      isInWishlist = true;
    }
    
    localStorage.setItem(DB_KEYS.WISHLIST, JSON.stringify(wishlistIds));
    
    return {
      success: true,
      isInWishlist,
      message: isInWishlist ? 'Added to wishlist' : 'Removed from wishlist'
    };
  },

  // --- EXTERNAL INTEGRATION API ---

  /**
   * Public API Feed for External Apps
   * Returns a JSON structure of available, certified products
   */
  async getPublicApiFeed(): Promise<any> {
    await delay(200);
    const productsStr = localStorage.getItem(DB_KEYS.PRODUCTS);
    const products: Product[] = productsStr ? JSON.parse(productsStr) : [];
    
    // Filter only available and compliant items for public API
    const cleanFeed = products
      .filter(p => p.status === 'available' && p.aiDetectionStatus !== 'flagged')
      .map(p => ({
        external_id: p.externalIntegrationId || p.id,
        title: p.title,
        price: p.price,
        verified_image: p.isImageCertified && p.aiDetectionStatus === 'clear',
        image_url: p.images[0]
      }));

    return {
      api_version: 'v1',
      timestamp: new Date().toISOString(),
      count: cleanFeed.length,
      data: cleanFeed
    };
  },

  // --- NEW AUTH METHODS ---

  async login(phone: string, role: UserRole): Promise<{ success: boolean; user?: User; message: string }> {
    await delay(1000);
    
    // Determine user ID based on role for demo dashboard continuity
    // If seller, give 's1' so they see the mock data. If buyer, give 'b1'.
    const userId = role === 'seller' ? 's1' : 'b1';
    const name = role === 'seller' ? 'Addis Kitchen Sol.' : 'Abebe Kebede';

    const user: User = {
      id: userId,
      name: name,
      phone: phone,
      role: role,
      isVerified: role === 'seller', // Sellers verified by default in demo flow
      memberSince: '2024',
      location: 'Addis Ababa'
    };

    return { success: true, user, message: 'Logged in successfully.' };
  },

  /**
   * Request OTP for Ethiopian Phone Number
   */
  async requestOTP(phone: string): Promise<{ success: boolean; message: string }> {
    await delay(1000);
    // Basic validation for Ethiopian number
    if (!phone.startsWith('+251') && !phone.startsWith('09')) {
       return { success: false, message: 'Please enter a valid Ethiopian phone number.' };
    }
    return { success: true, message: 'OTP sent successfully.' };
  },

  /**
   * Verify the OTP Code
   */
  async verifyOTP(phone: string, code: string): Promise<{ success: boolean; message: string }> {
    await delay(1500);
    if (code === '123456') {
      return { success: true, message: 'Phone verified.' };
    }
    return { success: false, message: 'Invalid code. Try 123456.' };
  },

  /**
   * Verify Fayda ID against National Database
   */
  async verifyFayda(faydaNumber: string): Promise<{ success: boolean; name?: string; message: string }> {
    await delay(2000);
    if (faydaNumber.length < 10) {
      return { success: false, message: 'Invalid Fayda ID format.' };
    }
    // Simulate retrieving name from Fayda
    return { success: true, name: 'Chef Dawit Mekonnen', message: 'Identity Verified.' };
  },

  /**
   * Link Telebirr Account
   */
  async linkTelebirr(phone: string): Promise<{ success: boolean; message: string }> {
    await delay(1500);
    return { success: true, message: 'Telebirr account linked successfully.' };
  },

  /**
   * Backend method to serve Language Pack
   */
  async getTranslations(lang: Language = 'en') {
    // In a real app, this would fetch from a database or CDN
    return TRANSLATIONS[lang];
  }
};