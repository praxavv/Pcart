import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import rubikImg from '../../assets/rubik.jpg';
import './ProductCard.css'; // Assuming you have a CSS file for styling

const API_URL = process.env.REACT_APP_API_URL || "";

const fallbackProducts = [
  {
    _id: 1,
    name: "iPhone 15 Pro",
    imageUrl: "https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=800",
    description: "The latest iPhone with Titanium design and A17 Pro chip.",
    price: 55000,
    stock: 15,
  },
  {
    _id: 2,
    name: "Gaming Mouse RGB",
    imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=800",
    description: "High-precision optical sensor with customizable RGB lighting.",
    price: 1500,
    stock: 25,
  },
  {
    _id: 3,
    name: "Classic Rubik's Cube",
    imageUrl: rubikImg,
    description: "The original 3x3 Rubik's Cube. A challenge for all ages.",
    price: 499,
    stock: 50,
  }
];

// Helper to resolve image path
const getImageUrl = (url) => {
    if (!url) return rubikImg;
    
    // Handle imported modules (objects with a 'default' property or direct strings)
    const path = typeof url === 'object' ? (url.default || url) : url;
    
    if (typeof path !== 'string') return rubikImg;
    
    // If it's a full URL or data URI, return as is
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    
    // If it's a relative path from the public folder (starting with /assets or /static)
    if (path.startsWith('/assets/') || path.startsWith('/static/')) return path;
    
    // Fallback for relative paths that might be resolved by the bundler
    return path;
};

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { dispatch } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/products`);
                // If API returns an empty array, use fallbacks
                if (response.data && response.data.length > 0) {
                    setProducts(response.data);
                } else {
                    setProducts(fallbackProducts);
                }
                setLoading(false);
            } catch (err) {
                setProducts(fallbackProducts);
                setLoading(false);
                console.error('Error fetching products:', err);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return <div className="loading-message">Loading products...</div>;
    }

    return (
        <div className="home-container">
            <div className="hero-banner">
                <div className="stars-container">
                    {[...Array(20)].map((_, i) => (
                        <div 
                            key={i} 
                            className="star" 
                            style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                position: 'absolute',
                                animationDelay: `${Math.random() * 2}s`
                            }}
                        />
                    ))}
                </div>
                <div className="hero-content">
                    <h1> Pranav's Cart <br /> The future of shopping </h1>
                    <p>Experience the ultimate storefront <br /> Fast and Secure</p>
                    <button className="hero-cta" onClick={() => window.scrollTo({ top: window.innerHeight - 80, behavior: 'smooth' })}>
                        Explore Collection
                    </button>
                </div>
            </div>

            <div className="product-grid">
                {products.map(product => (
                    <div key={product._id} className="product-card">
                        <div className="product-image-wrapper">
                            {product.imageUrl && (
                                <img
                                    src={getImageUrl(product.imageUrl)}
                                    alt={product.name}
                                    className="product-image"
                                />
                            )}
                        </div>
                        <div className="product-info">
                            <h3 className="product-title">{product.name}</h3>
                            <div className="product-rating">⭐⭐⭐⭐⭐ <span className="rating-count">(1,240)</span></div>
                            <p className="product-description-text">{product.description}</p>
                            <div className="price-tag">
                                <span className="currency">₹</span>
                                <span className="price-amount">{product.price.toFixed(2)}</span>
                            </div>
                            <p className="product-stock">
                                {product.stock > 0 ? "In Stock" : <span className="out-of-stock">Out of Stock</span>}
                            </p>
                            <button
                                className="add-to-cart-button"
                                onClick={() =>
                                    dispatch({ type: 'ADD_TO_CART', product })
                                }
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;
