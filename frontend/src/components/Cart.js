import React from 'react';

export default function Cart({ cart = { items: [], total: 0 }, onRemove, onUpdateQty, onOpenCheckout }) {
  const items = cart.items || [];

  return (
    <aside className="cart">
      <h2>Your Cart</h2>
      {items.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          <ul className="cart-list">
            {items.map(item => (
              <li key={item.cartId} className="cart-item">
                <img src={item.image || 'https://via.placeholder.com/80'} alt={item.name} />
                <div className="cart-item-info">
                  <div className="cart-item-title">{item.name}</div>
                  <div>Rs.{Number(item.price).toFixed(2)}</div>
                  <div className="qty-controls">
                    <button onClick={() => onUpdateQty(item.cartId, Math.max(1, item.qty - 1))}>−</button>
                    <input value={item.qty} readOnly />
                    <button onClick={() => onUpdateQty(item.cartId, item.qty + 1)}>+</button>
                  </div>
                </div>
                <div>
                  <div>Rs.{Number(item.lineTotal).toFixed(2)}</div>
                  <button className="remove" onClick={() => onRemove(item.cartId)}>Remove</button>
                </div>
              </li>
            ))}
          </ul>

          <div className="cart-summary">
            <div><strong>Total:</strong> Rs.{Number(cart.total).toFixed(2)}</div>
            <button className="primary" onClick={onOpenCheckout}>Proceed to Checkout</button>
          </div>
        </div>
      )}
    </aside>
  );
}
