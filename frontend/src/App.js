import React, { useEffect, useState } from 'react';
import Products from './components/Products';
import Cart from './components/Cart';
import CheckoutModal from './components/CheckoutModal';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

function App() {
  const [products, setProducts] = useState([]);
  const [cartSnapshot, setCartSnapshot] = useState({ items: [], total: 0 });
  const [showCheckout, setShowCheckout] = useState(false);
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  async function fetchProducts() {
    try {
      const res = await fetch(`${API_BASE}/api/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchCart() {
    try {
      const res = await fetch(`${API_BASE}/api/cart`);
      const data = await res.json();
      setCartSnapshot(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function addToCart(productId, qty = 1) {
    try {
      const res = await fetch(`${API_BASE}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, qty })
      });
      if (!res.ok) throw new Error('Add failed');
      await fetchCart();
    } catch (err) {
      console.error(err);
    }
  }

  async function removeFromCart(cartId) {
    try {
      const res = await fetch(`${API_BASE}/api/cart/${cartId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      await fetchCart();
    } catch (err) {
      console.error(err);
    }
  }

  async function updateCartQty(cartId, qty) {
    try {
      const res = await fetch(`${API_BASE}/api/cart/${cartId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qty })
      });
      if (!res.ok) throw new Error('Update failed');
      await fetchCart();
    } catch (err) {
      console.error(err);
    }
  }

  async function checkout(details) {
    try {
      const cartItems = cartSnapshot.items.map(i => ({
        productId: i.productId,
        qty: i.qty
      }));

      const res = await fetch(`${API_BASE}/api/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItems, ...details })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Checkout failed');

      setReceipt(data.receipt);
      setShowCheckout(false);
      await fetchCart();
    } catch (err) {
      console.error(err);
      alert('Checkout failed');
    }
  }

  return (
    <div className="container">
      <header className="header glassy">
        <h1 className="brand">
           <span>Vibe Commerce</span>
        </h1>
        <button className="cart-btn glow" onClick={() => setShowCheckout(true)}>
          View Checkout
        </button>
      </header>

      <main className="main-grid">
        <Products products={products} onAdd={addToCart} />
        <Cart
          cart={cartSnapshot}
          onRemove={removeFromCart}
          onUpdateQty={updateCartQty}
          onOpenCheckout={() => setShowCheckout(true)}
        />
      </main>

      {showCheckout && (
        <CheckoutModal
          onClose={() => setShowCheckout(false)}
          onSubmit={checkout}
          cart={cartSnapshot}
        />
      )}

      {receipt && (
        <div className="receipt-modal">
          <div className="receipt-card animate-fade">
            <h2> Order Receipt</h2>
            <p><strong>Name:</strong> {receipt.name}</p>
            <p><strong>Email:</strong> {receipt.email || '-'}</p>
            <p><strong>Total:</strong> Rs.{receipt.total}</p>
            <p><strong>Time:</strong> {new Date(receipt.timestamp).toLocaleString()}</p>
            <h3>Items</h3>
            <ul>
              {receipt.items.map((it, idx) => (
                <li key={idx}>
                  {it.name} — {it.qty} × Rs{it.price}
                </li>
              ))}
            </ul>
            <button className="primary" onClick={() => setReceipt(null)}>Close</button>
          </div>
        </div>
      )}

      <footer className="footer">
        <small>© 2025 Vibe Commerce — Crafted with ❤️ by Sahil</small>
      </footer>
    </div>
  );
}

export default App;
