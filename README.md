# E-commerce API

A RESTful Node.js and Express API for an e-commerce backend. The API supports catalog management, authentication, user profiles, wishlists, addresses, coupons, carts, reviews, and cash orders with role-based authorization.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running the API](#running-the-api)
- [Authentication and Authorization](#authentication-and-authorization)
- [API Base URL](#api-base-url)
- [Routes](#routes)
- [Query Features](#query-features)
- [File Uploads](#file-uploads)
- [Data Models](#data-models)
- [Error Handling](#error-handling)
- [Seed Data](#seed-data)
- [Available Scripts](#available-scripts)

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express 5
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JSON Web Tokens (`jsonwebtoken`)
- **Password hashing:** `bcryptjs` / `bcrypt`
- **Validation:** `express-validator`
- **Async error handling:** `express-async-handler`
- **Uploads:** Multer memory storage
- **Image processing:** Sharp
- **Email:** Nodemailer
- **Utilities:** dotenv, morgan, slugify, uuid, colors

## Architecture

This project follows a layered REST API architecture:

```text
Client / Frontend
      |
      v
Express Server (server.js)
      |
      v
Route Layer (routes/)
      |
      v
Validation + Auth + Upload Middleware
      |
      v
Service / Controller Layer (services/)
      |
      v
Mongoose Models (models/)
      |
      v
MongoDB
```

### Main architectural responsibilities

- **`server.js`** initializes Express, loads environment variables, connects to MongoDB, mounts routes, serves uploaded assets, and registers global error handling.
- **`routes/`** defines endpoint groups and attaches route-specific middleware.
- **`services/`** contains the request handlers and business logic for each resource.
- **`models/`** defines Mongoose schemas and relationships.
- **`validators/`** contains request validation chains using `express-validator`.
- **`middlewares/`** contains shared middleware for validation errors, image uploads, and global errors.
- **`utils/`** contains reusable helpers such as API filtering, JWT creation, custom API errors, email sending, and dummy data seeding.

## Project Structure

```text
.
├── config/
│   └── database.js
├── middlewares/
│   ├── errorMiddleware.js
│   ├── uploadImagesMiddleware.js
│   └── validatorMiddleware.js
├── models/
│   ├── brandModel.js
│   ├── cartModel.js
│   ├── categoryModel.js
│   ├── couponModel.js
│   ├── orderModel.js
│   ├── productModel.js
│   ├── reviewModel.js
│   ├── subCategoryModel.js
│   └── userModel.js
├── routes/
│   ├── adddress.routes.js
│   ├── auth.routes.js
│   ├── brand.routes.js
│   ├── cart.routes.js
│   ├── category.routes.js
│   ├── coupon.routes.js
│   ├── index.js
│   ├── oder.routes.js
│   ├── product.routes.js
│   ├── review.routes.js
│   ├── subCategory.routes.js
│   ├── user.routes.js
│   └── wishlist.routes.js
├── services/
├── utils/
├── validators/
├── package.json
└── server.js
```

> Note: Some route filenames contain spelling typos (`adddress.routes.js`, `oder.routes.js`) but are mounted correctly by `routes/index.js`.

## Getting Started

### Prerequisites

- Node.js 18 or newer recommended
- npm
- A running MongoDB database, either local or hosted

### Installation

```bash
npm install
```

## Environment Variables

Create a `config.env` file in the project root. The application loads this file from `server.js`.

Example:

```env
NODE_ENV=dev
PORT=8000
BASE_URL=http://localhost:8000
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce-api
JWT_SECRET_KEY=replace_with_a_long_secret
JWT_EXPIRE_TIME=90d

EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email_user
EMAIL_PASSWORD=your_email_password
EMAIL_FROM="E-commerce API <no-reply@example.com>"
```

Required variables used by the codebase:

| Variable | Purpose |
| --- | --- |
| `NODE_ENV` | Controls logging and development/production error responses. Use `dev` for development. |
| `PORT` | Port used by the Express server. |
| `BASE_URL` | Base URL used to build public image URLs. |
| `MONGO_URI` | MongoDB connection string. |
| `JWT_SECRET_KEY` | Secret used to sign and verify JWT access tokens. |
| `JWT_EXPIRE_TIME` | Token expiration value used by JWT creation helper. |
| Email variables | Used by password reset email flow through Nodemailer. |

## Running the API

Development mode:

```bash
npm run dev
```

Production script:

```bash
npm run prod
```

Health/root endpoint:

```http
GET /
```

Response:

```text
Our API V1
```

## Authentication and Authorization

Authenticated endpoints expect a Bearer token:

```http
Authorization: Bearer <jwt_token>
```

The API supports three roles:

- `user`
- `manger` — spelling used in several route guards and the user model
- `admin`

Some order routes use `manager`, while most management routes use `manger`. Use the role values currently enforced by the route you are calling.

## API Base URL

All versioned API endpoints are mounted under:

```text
/api/v1
```

Example local URL:

```text
http://localhost:8000/api/v1/products
```

## Routes

### Auth routes

Base path: `/api/v1/auth`

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/signup` | Public | Register a new user and return a JWT. |
| `POST` | `/login` | Public | Login with email and password and return a JWT. |
| `POST` | `/forgotpassword` | Public | Start password reset flow. |
| `POST` | `/verifyresetcode` | Public | Verify password reset code. |
| `PUT` | `/resetpassword` | Public | Reset password after verification. |

### Category routes

Base path: `/api/v1/categories`

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/` | Public | Get all categories. |
| `POST` | `/` | Admin / manger | Create a category with optional image upload. |
| `GET` | `/:id` | Public | Get a single category. |
| `PUT` | `/:id` | Admin / manger | Update a category. |
| `DELETE` | `/:id` | Admin | Delete a category. |
| `GET` | `/:categoryId/subcategories` | Public | Get subcategories for a category. |
| `POST` | `/:categoryId/subcategories` | Admin / manger | Create a subcategory under a category. |

### Brand routes

Base path: `/api/v1/brands`

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/` | Public | Get all brands. |
| `POST` | `/` | Admin / manger | Create a brand with optional image upload. |
| `GET` | `/:id` | Public | Get a single brand. |
| `PUT` | `/:id` | Admin / manger | Update a brand. |
| `DELETE` | `/:id` | Admin | Delete a brand. |

### Subcategory routes

Base path: `/api/v1/subcategories`

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/` | Public | Get all subcategories. |
| `POST` | `/` | Admin / manger | Create a subcategory. |
| `GET` | `/:id` | Public | Get a single subcategory. |
| `POST` | `/:id` | Admin / manger | Update a subcategory. |
| `DELETE` | `/:id` | Admin | Delete a subcategory. |

> Note: The update route currently uses `POST /:id` instead of the more common `PUT /:id`.

### Product routes

Base path: `/api/v1/products`

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/` | Public | Get all products. |
| `POST` | `/` | Admin / manger | Create a product with image upload. |
| `GET` | `/:id` | Public | Get a single product. |
| `PUT` | `/:id` | Admin / manger | Update a product. |
| `DELETE` | `/:id` | Admin | Delete a product. |
| `GET` | `/:productId/reviews` | Public | Get reviews for a product. |
| `POST` | `/:productId/reviews` | User | Create a review for a product. |

### Review routes

Base path: `/api/v1/reviews`

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/` | Public | Get all reviews. |
| `POST` | `/` | User | Create a review. |
| `GET` | `/:id` | Public | Get a single review. |
| `PUT` | `/:id` | User | Update a review. |
| `DELETE` | `/:id` | User / manger / admin | Delete a review. |

### Wishlist routes

Base path: `/api/v1/wishlist`

All wishlist routes require a logged-in `user` role.

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/` | Get the logged-in user's wishlist. |
| `POST` | `/` | Add a product to the wishlist. |
| `DELETE` | `/:productId` | Remove a product from the wishlist. |

### Address routes

Base path: `/api/v1/addresses`

All address routes require a logged-in `user` role.

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/` | Get logged-in user's addresses. |
| `POST` | `/` | Add an address. |
| `DELETE` | `/:addressId` | Remove an address. |

### Coupon routes

Base path: `/api/v1/coupons`

All coupon routes require `admin` or `manger` role.

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/` | Get all coupons. |
| `POST` | `/` | Create a coupon. |
| `GET` | `/:id` | Get a single coupon. |
| `PUT` | `/:id` | Update a coupon. |
| `DELETE` | `/:id` | Delete a coupon. |

### User routes

Base path: `/api/v1/users`

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| `PUT` | `/changepassword/:id` | Public in current router | Change a user's password by id. |
| `GET` | `/getme` | Authenticated | Get logged-in user's profile. |
| `PUT` | `/updateme` | Authenticated | Update logged-in user's profile data. |
| `PUT` | `/updatemypassword` | Authenticated | Update logged-in user's password. |
| `GET` | `/deleteme` | Public in current router | Deactivate logged-in user data handler. |
| `GET` | `/` | Admin | Get all users. |
| `POST` | `/` | Admin | Create a user with optional image upload. |
| `GET` | `/:id` | Admin | Get a single user. |
| `PUT` | `/:id` | Admin | Update a user. |
| `DELETE` | `/:id` | Admin | Delete a user. |

### Cart routes

Base path: `/api/v1/cart`

All cart routes require a logged-in `user` role.

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/` | Get logged-in user's cart. |
| `POST` | `/` | Add item to cart. |
| `DELETE` | `/` | Clear cart. |
| `DELETE` | `/:itemId` | Remove item from cart. |
| `PUT` | `/:itemId` | Update cart item quantity. |
| `POST` | `/applycoupon` | Apply coupon to cart. |

> Important: Because `/:itemId` is defined before `/applycoupon`, `POST /applycoupon` still works because `/:itemId` only handles `DELETE` and `PUT`.

### Order routes

Base path: `/api/v1/orders`

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/:cartId` | User | Create a cash order from a cart. |
| `GET` | `/` | Admin / manager / user | Get orders. Users are filtered to their own orders. |
| `GET` | `/:id` | Admin / manager / user | Get a specific order. |
| `PUT` | `/:orderId/pay` | Admin / manager | Mark an order as paid. |
| `PUT` | `/:orderId/delivered` | Admin / manager | Mark an order as delivered. |

## Query Features

List endpoints that use the shared API factory can support:

| Feature | Query example | Description |
| --- | --- | --- |
| Filtering | `?price[gte]=100&price[lte]=500` | Supports advanced MongoDB operators: `gte`, `gt`, `lte`, `lt`. |
| Search | `?keyword=phone` | Searches common text fields such as `title`, `name`, and `description`. |
| Sorting | `?sort=price,-createdAt` | Sort ascending or descending by comma-separated fields. |
| Field limiting | `?fields=title,price,imageCover` | Return only selected fields. |
| Pagination | `?page=2&limit=20` | Returns paginated results. Default limit is 50. |

## File Uploads

The API uses Multer with in-memory storage and Sharp image processing.

Common upload fields:

- Category image: `image`
- Brand image: `image`
- User profile image: `profileImage`
- Product cover image: `imageCover`
- Product gallery images: `images`

Uploaded image URLs are generated using `BASE_URL` and served from the static `uploads` directory.

## Data Models

### User

Fields include name, email, password, role, active status, profile image, wishlist, addresses, and password reset metadata.

### Category

Represents a product category with name, slug, and image.

### SubCategory

Represents a child category linked to a parent category.

### Brand

Represents a product brand with name, slug, and image.

### Product

Represents catalog products with title, slug, description, quantity, sold count, price, discount price, colors, cover image, gallery images, category, subcategories, brand, and review statistics.

### Review

Stores user reviews and ratings for products. Review saves/deletes recalculate product average rating and rating quantity.

### Cart

Stores cart items for a user, including product references, quantity, selected color, price, total price, and discounted total.

### Coupon

Stores coupon name, expiration date, and discount value.

### Order

Stores order user, cart items, shipping address, tax, shipping cost, total price, payment method, paid status, and delivered status.

## Error Handling

- Unknown routes are converted into a custom `apiError` with HTTP 404.
- Global error middleware returns detailed stack traces in `NODE_ENV=dev`.
- Production responses hide stack traces and normalize JWT errors.
- Validation middleware returns HTTP 400 with validation error details.

## Seed Data

Dummy product data and a seeder utility are available in:

```text
utils/dummyData/
```

Review the seeder script before running it so you understand whether it imports or deletes data.

## Available Scripts

| Script | Command | Description |
| --- | --- | --- |
| `dev` | `npm run dev` | Start the server with Nodemon. |
| `prod` | `npm run prod` | Start the server in production mode using Nodemon. |
| `test` | `npm test` | Placeholder script that currently exits with an error. |

## Example Requests

### Signup

```bash
curl -X POST http://localhost:8000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

### Login

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Get products

```bash
curl "http://localhost:8000/api/v1/products?page=1&limit=10&sort=-createdAt"
```

### Create category as admin or manger

```bash
curl -X POST http://localhost:8000/api/v1/categories \
  -H "Authorization: Bearer <jwt_token>" \
  -F "name=Electronics" \
  -F "image=@/path/to/image.jpg"
```

## Notes for Contributors

- Keep route definitions in `routes/` thin and place business logic in `services/`.
- Add validation chains in `validators/` for any new request payloads or route params.
- Use `protect` and `allowedTo(...)` for authorization-sensitive routes.
- Prefer reusable factory handlers where CRUD behavior is standard.
- Keep response shapes consistent with existing services.
