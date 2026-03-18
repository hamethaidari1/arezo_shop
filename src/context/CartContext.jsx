import React, { createContext, useReducer, useEffect, useContext } from 'react';

export const CartContext = createContext();

const initialState = JSON.parse(localStorage.getItem('clarity_cart')) || [];

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existing = state.find(item => item.product.id === action.payload.product.id);
      if (existing) {
        return state.map(item =>
          item.product.id === action.payload.product.id
            ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
            : item
        );
      }
      return [...state, { product: action.payload.product, quantity: action.payload.quantity || 1 }];
    case 'REMOVE_ITEM':
      return state.filter(item => item.product.id !== action.payload.id);
    case 'INCREMENT':
      return state.map(item =>
        item.product.id === action.payload.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    case 'DECREMENT':
      return state.map(item =>
        item.product.id === action.payload.id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    case 'CLEAR_CART':
      return [];
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [items, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    localStorage.setItem('clarity_cart', JSON.stringify(items));
  }, [items]);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, dispatch, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
