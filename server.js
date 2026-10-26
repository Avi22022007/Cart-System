const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let cart = [];
let nextId = 1;

app.get('/health', (req, res) => res.json({ status: 'ok', version: 'v1' }));

app.get('/cart', (req, res) => res.json(cart));

app.post('/cart', (req, res) => {
  const { name, price, quantity } = req.body;
  if (!name || price == null || price < 0 || !(quantity >= 1)) {
    return res.status(400).json({ error: 'name, price and quantity (>=1) are required' });
  }
  const item = { id: nextId++, name, price: Number(price), quantity: Number(quantity) };
  cart.push(item);
  res.status(201).json(item);
});

app.listen(PORT, () => console.log(`Cart v1 running on port ${PORT}`));