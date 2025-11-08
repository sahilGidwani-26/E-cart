# 🛍️ Vibe Commerce (Mock)
A simple mock e-commerce web app built with React, Node.js, and SQLite3 — designed for demo and screening use.
It lets users browse products, add them to a cart, and simulate a checkout flow (without real payments).

# Features
✅ Product Listing – Displays seeded products with images, price, and description
✅ Add to Cart – Users can add, update, or remove items from cart
✅ Checkout Modal – Collects user details before placing order
✅ Mock Receipt – Shows a realistic receipt after checkout
✅ SQLite3 Database – Lightweight local storage for demo
✅ Responsive UI – Works well on desktop and mobile

# 🧩 Tech Stack
| Layer        | Technology Used                                     |
| ------------ | --------------------------------------------------- |
| **Frontend** | React (Vite or CRA), CSS (Custom + Variables)       |
| **Backend**  | Node.js + Express                                   |
| **Database** | SQLite3 (local file database)                       |
| **Styling**  | Modern minimal design using CSS variables (`:root`) |

# ⚙️ Installation & Setup

1️⃣ Install backend dependencies
cd backend
npm install
3️⃣ Initialize database and start backend
node server.js

This will:
Create a database.sqlite file
Seed demo products (like Vibe Laptop, T-shirt, etc.)
Backend runs at 👉 http://localhost:5000

# 🔗 API Endpoints Overview
| Method     | Endpoint        | Description                          |
| ---------- | --------------- | ------------------------------------ |
| **GET**    | `/api/products` | Fetch all available products         |
| **GET**    | `/api/cart`     | Get cart items and total             |
| **POST**   | `/api/cart`     | Add item to cart                     |
| **PATCH**  | `/api/cart/:id` | Update quantity                      |
| **DELETE** | `/api/cart/:id` | Remove item                          |
| **POST**   | `/api/checkout` | Simulate checkout and return receipt |

# 🧠 How It Works
When backend starts, it seeds some demo products into the SQLite DB.
The React app fetches all products from /api/products.
Each product card shows an image, name, price, and Add to Cart button.
The cart sidebar shows items with quantity controls and a total.
Clicking Checkout opens a modal (CheckoutModal.jsx) that collects user details.
After “Place Order,” a mock receipt is generated and displayed on screen.

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/727663c4-aebf-4d92-bd98-0f66ff77be1a" />

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/e4aa6c3f-b66d-4ee4-ad9d-a50efd8709be" />

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/e9687e56-ec1c-46b2-941e-4395dcaffd9f" />

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/4d8c309d-28e4-43e8-91b8-57d22df1cf2b" />




