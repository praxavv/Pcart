// In App.js


import React, { useState, useEffect, useMemo } from 'react';
import ProductList from './components/Products/ProductList';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Cart from './components/Cart/Cart';
import Login from './components/Auth/Login';

function App() {
 const numberOfStars = 80;

const stars = useMemo(() => {
  return [...Array(numberOfStars)].map((_, i) => {
    const x = Math.random() * 100 + 'vw';
    const y = Math.random() * 100 + 'vh';
    const size = Math.random() * 6 + 'px';
    const animationDelay = Math.random() * 2 + 's';

    return (
      <div
        key={i}
        className="star"
        style={{
          top: y,
          left: x,
          width: size,
          height: size,
          animationDelay: animationDelay,
        }}
      ></div>
    );
  });
}, []);
 const [isAuthenticated, setIsAuthenticated] = useState(false);

 useEffect(() => {
   setIsAuthenticated(!!localStorage.getItem('token'));
 }, []);

 const handleLogout = () => {
   localStorage.removeItem('token');
   setIsAuthenticated(false);
 };

 const handleAuth = () => {
   setIsAuthenticated(true);
 };
 return (
 <Router>
 <div className="App">
 {stars}
 <header className="amazon-header">
   <div className="header-top">
     <Link to="/" className="logo">PCART</Link>
     <div className="search-bar">
       <input type="text" placeholder="Search products..." />
       <button className="search-btn">🔍</button>
     </div>
     <div className="header-nav-links">
       {isAuthenticated ? (
         <div className="nav-item">
           <span className="nav-line-1">Hello, User</span>
           <button onClick={handleLogout} className="logout-btn">Sign Out</button>
         </div>
       ) : (
         <Link to="/login" className="nav-item">
           <span className="nav-line-1">Hello, sign in</span>
           <span className="nav-line-2">Account & Lists</span>
         </Link>
       )}
       <Link to="/cart" className="nav-item cart-link">
         <span className="cart-icon">🛒</span>
         <span className="cart-text">Cart</span>
       </Link>
     </div>
   </div>
   <nav className="header-bottom">
     <Link to="/">All</Link>
     <Link to="/">Electronics</Link>
     <Link to="/">Gaming</Link>
     <Link to="/">Deals</Link>
     <Link to="/">Customer Service</Link>
   </nav>
 </header>
 <main className="content-area">
 <Routes>
 <Route path="/" element={<ProductList />} />
 <Route path="/cart" element={<Cart />} />
 <Route path="/login" element={<Login onLogin={handleAuth} />} />
 </Routes>
 </main>
 </div>
 </Router>
 );
 }




export default App;
