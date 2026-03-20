// src\components\Cart.js

import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import axios from 'axios';
import './Cart.css'; // Assuming you have a CSS file for styling

const Cart = () => {
  const { cart, dispatch } = useCart(); // 'dispatch' is used in handleRemove, handleQuantityChange, and implicitly in handleCheckout now

  const [checkoutStatus, setCheckoutStatus] = useState('');
  const [loading, setLoading] = useState(false);

  // Calculate total *here*, within the component's scope,
  // so it's accessible by handleCheckout and the JSX.
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
        totalAmount: total, // 'total' is now correctly in scope
      };

      await axios.post('/api/orders', order, {
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
    return <div className="cart-empty">Your cart is empty.</div>;
  }

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      <table className="cart-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {cart.map(item => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>${item.price.toFixed(2)}</td>
              <td>
                <div className="custom-quantity-vertical">
                  <input
                    type="number"
                    value={item.quantity}
                    min={1}
                    onChange={e => handleQuantityChange(item._id, Number(e.target.value))}
                  />
                  <div className="vertical-arrows">
                    <button
                      className="neon-arrow-vertical"
                      onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                      type="button"
                    >+</button>
                    <button
                      className="neon-arrow-vertical"
                      onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                      type="button"
                    >-</button>
                  </div>
                </div>
              </td>
              <td>${(item.price * item.quantity).toFixed(2)}</td>
              <td>
                <button onClick={() => handleRemove(item._id)} className="remove-cart-item">Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="cart-total">
        <strong>Total: ${total.toFixed(2)}</strong>
      </div>
      <div style={{ marginTop: '20px' }}>
        <button onClick={handleCheckout} disabled={loading} className="checkout-button">
          {loading ? 'Placing Order...' : 'Checkout'}
        </button>
        {checkoutStatus && <div className="checkout-status">{checkoutStatus}</div>}
      </div>
    </div>
  );
};

export default Cart;