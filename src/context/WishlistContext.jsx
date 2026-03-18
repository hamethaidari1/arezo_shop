import React, { createContext, useReducer, useEffect, useContext } from 'react';

export const WishlistContext = createContext();

const initialState = JSON.parse(localStorage.getItem('clarity_wishlist')) || [];

const wishlistReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_WISHLIST':
      // Prevent duplicates
      if (state.find(item => item.id === action.payload.id)) {
        return state;
      }
      return [...state, action.payload];
    case 'REMOVE_FROM_WISHLIST':
      return state.filter(item => item.id !== action.payload.id);
    case 'CLEAR_WISHLIST':
      return [];
    default:
      return state;
  }
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, dispatch] = useReducer(wishlistReducer, initialState);

  useEffect(() => {
    localStorage.setItem('clarity_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, dispatch, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
