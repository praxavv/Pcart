const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { User, Product, Order } = require('./models');
const { protect } = require('./middleware');

// --- User Routes ---
router.post('/users/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        let userByEmail = await User.findOne({ email });
        if (userByEmail) return res.status(400).json({ message: 'User with that email already exists' });
        let userByUsername = await User.findOne({ username });
        if (userByUsername) return res.status(400).json({ message: 'User with that username already exists' });

        const newUser = new User({ username, email, password });
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/users/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
            if (err) throw err;
            res.json({ token, message: 'Logged in successfully!' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// --- Product Routes ---
router.get('/products', async (req, res) => {
    try {
        let products = await Product.find({});
        products = products.map(product => {
            let p = product.toObject();
            let url = p.imageUrl;
            
            // Robust check for imageUrl
            if (!url || typeof url !== 'string' || (!url.toLowerCase().startsWith('/assets/') && !url.toLowerCase().startsWith('http'))) {
                url = '/assets/rubik.jpg';
            } else if (url.toLowerCase().startsWith('/assets/rubik.jpg')) {
                // Ensure correct case for rubik cube if it was messed up
                url = '/assets/rubik.jpg';
            }
            
            return { ...p, imageUrl: url };
        });
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/products', async (req, res) => {
    try {
        const { name, description, price, imageUrl, stock } = req.body;
        if (!name || !description || !price || stock === undefined) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const product = new Product({ name, description, price, imageUrl, stock });
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.put('/products/:id', async (req, res) => {
    try {
        const { name, description, price, imageUrl, stock } = req.body;
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        product.name = name !== undefined ? name : product.name;
        product.description = description !== undefined ? description : product.description;
        product.price = price !== undefined ? price : product.price;
        product.imageUrl = imageUrl !== undefined ? imageUrl : product.imageUrl;
        product.stock = stock !== undefined ? stock : product.stock;

        const updatedProduct = await product.save();
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// --- Order Routes ---
router.post('/orders', protect, async (req, res) => {
  try {
    const { products, totalAmount } = req.body;
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'No products provided.' });
    }
    const order = new Order({
      user: req.user._id,
      products: products,
      totalAmount: totalAmount
    });
    await order.save();
    return res.status(200).json({ message: 'Order placed successfully', order });
  } catch (err) {
    console.error('Order API error:', err);
    return res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

module.exports = router;
