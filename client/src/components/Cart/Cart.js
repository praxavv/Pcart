// src\components\Cart.js

import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import './Cart.css';

const Cart = () => {
  const { cart, dispatch } = useCart();
  const [checkoutStatus, setCheckoutStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleRemove = (id) => {
    dispatch({ type: 'REMOVE_FROM_CART', id });
  };

  const handleQuantityChange = (id, quantity) => {
    if (quantity < 1) return;
    dispatch({ type: 'UPDATE_QUANTITY', id, quantity });
  };

  const handleCheckout = async () => {
    setLoading(true);
    setCheckoutStatus('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setCheckoutStatus('You need to be logged in to place an order.');
        setLoading(false);
        return;
      }

      const order = {
        products: cart.map(item => ({ product: item._id, quantity: item.quantity })),
        totalAmount: total,
      };

      await axios.post(`${API_BASE_URL}/api/orders`, order, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setCheckoutStatus('Your order has been placed successfully!');
    } catch (err) {
      console.error("Checkout error:", err.response ? err.response.data : err.message);
      setCheckoutStatus('Failed to place order. Please try again.');
    }
    setLoading(false);
  };

  if (cart.length === 0) {
    return (
      <div className="cart-empty-container">
        <div className="cart-empty-icon">🛒</div>
        <p className="cart-empty-text">Your cart is empty</p>
        <button className="continue-shopping" onClick={() => window.location.href = '/'}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <span className="cart-count">{cart.length} {cart.length === 1 ? 'item' : 'items'}</span>
      </div>

      <div className="cart-content">
        <div className="cart-items-list">
          {cart.map(item => (
            <div key={item._id} className="cart-item">
              <div className="item-details">
                <h3 className="item-name">{item.name}</h3>
                <p className="item-price">${item.price.toFixed(2)}</p>
              </div>

              <div className="item-actions">
                <div className="quantity-control">
                  <button 
                    className="qty-btn" 
                    onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                  >−</button>
                  <span className="qty-value">{item.quantity}</span>
                  <button 
                    className="qty-btn" 
                    onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                  >+</button>
                </div>
                
                <div className="item-subtotal">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>

                <button 
                  onClick={() => handleRemove(item._id)} 
                  className="remove-btn"
                  title="Remove item"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          
          <button 
            onClick={handleCheckout} 
            disabled={loading} 
            className="checkout-btn"
          >
            {loading ? 'Processing...' : 'Checkout'}
          </button>
          
          {checkoutStatus && (
            <div className={`checkout-message ${checkoutStatus.includes('success') ? 'success' : 'error'}`}>
              {checkoutStatus}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;