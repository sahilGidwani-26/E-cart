const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

function init() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        description TEXT,
        image TEXT
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS cart (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        productId INTEGER NOT NULL,
        qty INTEGER NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (productId) REFERENCES products(id)
      )
    `);

    // ✅ Seed products if empty
    db.get(`SELECT COUNT(*) as cnt FROM products`, (err, row) => {
      if (err) {
        console.error(err);
        return;
      }

      if (row.cnt === 0) {
        const stmt = db.prepare(
          `INSERT INTO products (name, price, description, image) VALUES (?, ?, ?, ?)`
        );

        const products = [
          [
            'Vibe Laptop',
            59.99,
            'Wireless over-ear headphones with deep bass and noise cancellation.',
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=500&q=80'
          ],
          [
            'Vibe T-Shirt',
            19.99,
            '100% cotton breathable T-shirt with premium comfort.',
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=80'
          ],
          
          [
            'Vibe  Sunglasses',
            49.0,
            'Durable daypack with laptop compartment and multiple pockets.',
            'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=500&q=80'
          ],
          [
            'Vibe Toy ',
            24.99,
            'Stylish UV400 sunglasses with polarized lenses.',
            'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=500&q=80'
          ],
         
          [
            'Vibe Mug',
            9.99,
            'Ceramic coffee mug with matte finish.',
            'https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?auto=format&fit=crop&w=500&q=80'
          ]
        ];

        products.forEach(p => stmt.run(p));
        stmt.finalize();
        console.log('✅ Seeded products with correct themed images');
      }
    });
  });
}

module.exports = { db, init };

