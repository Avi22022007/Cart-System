
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory cart storage
let cart = [];
let nextId = 1;

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', version: 'v2' });
});

// View all cart items
app.get('/cart', (req, res) => {
    res.json(cart);
});

// v1: Add an item to the cart
app.post('/cart', (req, res) => {
    const { name, price, quantity } = req.body;

    if (!name || price == null || price < 0 || !(quantity >= 1)) {
        return res.status(400).json({
            error: 'name, price and quantity (>=1) are required'
        });
    }

    const item = {
        id: nextId++,
        name,
        price: Number(price),
        quantity: Number(quantity)
    };

    cart.push(item);

    res.status(201).json(item);
});

// v2: Update quantity of an existing cart item
app.put('/cart/:id', (req, res) => {
    const id = Number(req.params.id);
    const quantity = Number(req.body?.quantity);

    // Validate item ID and quantity
    if (
        !Number.isSafeInteger(id) ||
        id < 1 ||
        req.body?.quantity == null ||
        !Number.isSafeInteger(quantity) ||
        quantity < 1
    ) {
        return res.status(400).json({
            error: 'Valid item ID and quantity (positive integer) are required'
        });
    }

    // Find the item by ID
    const item = cart.find(item => item.id === id);

    if (!item) {
        return res.status(404).json({
            error: 'Item not found'
        });
    }

    // Update quantity
    item.quantity = quantity;

    res.status(200).json(item);
});

// Start server
app.listen(PORT, () => {
    console.log(`Cart v2 running on port ${PORT}`);
});
