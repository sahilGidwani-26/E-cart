const express = require('express');
const cors = require('cors');
const { db, init } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

init();

app.use(cors());
app.use(express.json());

// GET /api/products
app.get('/api/products', (req, res) => {
  db.all(`SELECT id, name, price, description, image FROM products`, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST /api/cart : { productId, qty }
app.post('/api/cart', (req, res) => {
  const { productId, qty } = req.body;
  if (!productId || !qty) return res.status(400).json({ error: 'productId and qty required' });

  const stmt = `INSERT INTO cart (productId, qty) VALUES (?, ?)`;
  db.run(stmt, [productId, qty], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    const newId = this.lastID;
    // return the cart item created
    db.get(`SELECT c.id, c.productId, c.qty, p.name, p.price, p.image
            FROM cart c JOIN products p ON c.productId = p.id
            WHERE c.id = ?`, [newId], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json(row);
    });
  });
});

// DELETE /api/cart/:id
app.delete('/api/cart/:id', (req, res) => {
  const id = req.params.id;
  db.run(`DELETE FROM cart WHERE id = ?`, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Cart item not found' });
    res.json({ success: true });
  });
});

// PATCH /api/cart/:id to update qty (nice to have)
app.patch('/api/cart/:id', (req, res) => {
  const id = req.params.id;
  const { qty } = req.body;
  if (qty == null) return res.status(400).json({ error: 'qty required' });

  db.run(`UPDATE cart SET qty = ? WHERE id = ?`, [qty, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Cart item not found' });
    db.get(`SELECT c.id, c.productId, c.qty, p.name, p.price, p.image
            FROM cart c JOIN products p ON c.productId = p.id
            WHERE c.id = ?`, [id], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(row);
    });
  });
});

// GET /api/cart : returns items and total
app.get('/api/cart', (req, res) => {
  db.all(`
    SELECT c.id as cartId, p.id as productId, p.name, p.price, p.image, c.qty,
           (p.price * c.qty) as lineTotal
    FROM cart c
    JOIN products p ON c.productId = p.id
  `, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const total = rows.reduce((s, r) => s + (r.lineTotal || 0), 0);
    res.json({ items: rows, total: Number(total.toFixed(2)) });
  });
});

// POST /api/checkout : { cartItems, name, email } -> mock receipt
app.post('/api/checkout', (req, res) => {
  const { cartItems, name, email } = req.body;
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return res.status(400).json({ error: 'cartItems required' });
  }
  // compute total server-side to be safe
  const placeholders = cartItems.map(() => '?').join(',');
  const productIds = cartItems.map(ci => ci.productId);

  db.all(`SELECT id, price, name FROM products WHERE id IN (${placeholders})`, productIds, (err, products) => {
    if (err) return res.status(500).json({ error: err.message });

    // map productId -> price
    const priceMap = {};
    products.forEach(p => priceMap[p.id] = { price: p.price, name: p.name });

    let total = 0;
    cartItems.forEach(ci => {
      const p = priceMap[ci.productId];
      if (p) total += p.price * (ci.qty || 1);
    });

    total = Number(total.toFixed(2));
    const timestamp = new Date().toISOString();

    // clear cart after checkout
    db.run(`DELETE FROM cart`, [], function (err) {
      if (err) console.error('Error clearing cart:', err);
      // return receipt
      const receipt = {
        name: name || 'Guest',
        email: email || null,
        total,
        timestamp,
        items: cartItems.map(ci => ({
          productId: ci.productId,
          qty: ci.qty,
          price: priceMap[ci.productId] ? priceMap[ci.productId].price : 0,
          name: priceMap[ci.productId] ? priceMap[ci.productId].name : 'Unknown'
        }))
      };
      res.json({ receipt });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
