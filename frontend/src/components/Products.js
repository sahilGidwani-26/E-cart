import React from 'react';

export default function Products({ products = [], onAdd }) {
  return (
    <section className="products">
      <h2>Products</h2>
      <div className="grid">
        {products.map(p => (
          <div className="card" key={p.id}>
            <img src={p.image || 'https://via.placeholder.com/200'} alt={p.name} />
            <h3>{p.name}</h3>
            <p className="price">Rs.{Number(p.price).toFixed(2)}</p>
            <p className="desc">{p.description}</p>
            <button onClick={() => onAdd(p.id, 1)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </section>
  );
}
