import React, { createContext, useContext, useState, useEffect } from 'react';
import { backend } from '../services/backend';

interface WishlistContextType {
  wishlistIds: string[];
  toggleWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Load wishlist on mount
  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const ids = await backend.getWishlist();
        setWishlistIds(ids);
      } catch (error) {
        console.error("Failed to load wishlist", error);
      } finally {
        setLoading(false);
      }
    };
    loadWishlist();
  }, []);

  const toggleWishlist = async (productId: string) => {
    // Optimistic UI update
    const isCurrentlyIn = wishlistIds.includes(productId);
    let newIds = [];
    if (isCurrentlyIn) {
      newIds = wishlistIds.filter(id => id !== productId);
    } else {
      newIds = [...wishlistIds, productId];
    }
    setWishlistIds(newIds);

    // Call backend
    try {
      const result = await backend.toggleWishlist(productId);
      if (!result.success) {
        // Revert if failed
        setWishlistIds(wishlistIds);
      }
    } catch (error) {
      console.error("Failed to toggle wishlist", error);
      setWishlistIds(wishlistIds); // Revert
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlistIds.includes(productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlistIds, toggleWishlist, isInWishlist, loading }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};