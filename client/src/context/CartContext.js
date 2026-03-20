import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

// Function to get the initial state, loading from localStorage
// This ensures it's run only when useReducer needs the initial state
const getInitialCartState = () => {
  try {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  } catch (error) {
    console.error("Failed to parse cart from localStorage:", error);
    return []; // Return empty array on error
  }
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existing = state.find(item => item._id === action.product._id);
      if (existing) {
        return state.map(item =>
          item._id === action.product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // Assuming action.product might not always have quantity: 1, if you want to add multiple at once
      // If it's always 1, your current logic is fine.
      return [...state, { ...action.product, quantity: action.quantity || 1 }]; // Added default quantity
    }
    case 'REMOVE_FROM_CART':
      return state.filter(item => item._id !== action.id);
    case 'UPDATE_QUANTITY':
      return state.map(item =>
        item._id === action.id ? { ...item, quantity: action.quantity } : item
      );
    case 'CLEAR_CART':
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  // Use the function to initialize useReducer
  const [cart, dispatch] = useReducer(cartReducer, getInitialCartState());

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [cart]); // Dependency array ensures this runs whenever 'cart' changes

  return (
    <CartContext.Provider value={{ cart, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}