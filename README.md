# Sutainbuyant E-commerce

Next.js App Router + TypeScript + Tailwind CSS storefront connected to the Sutainbuyant REST API.

## Requirements
- Node.js 18.17+ (Node 20 LTS recommended)
- npm

## Run locally
```bash
cp .env.example .env.local
npm install
npm run dev
```
Open http://localhost:3000.

## API configuration
`.env.local`:
```env
NEXT_PUBLIC_API_URL=https://job.sutainbuyant.com/api/v1
```

Implemented API operations:
- POST `/register`
- POST `/login`
- GET `/me`
- POST `/logout`
- GET `/shop/categories`
- GET `/shop/categories/{id}` (client method available)
- GET `/shop/tags`
- GET `/shop/products` with documented query parameters
- GET `/shop/products/{id}`
- GET/PUT `/shop/profile`
- PUT `/shop/profile/password`
- GET/POST `/shop/orders`
- GET `/shop/orders/{id}`
- POST `/shop/orders/{id}/cancel`

## Important integration notes
1. The API response schema was not supplied as a JSON/OpenAPI file. The API client therefore includes a small `unwrap` adapter for common list response envelopes. Inspect actual API responses and adjust `lib/api.ts`, `lib/types.ts`, and form payloads to match the server precisely.
2. The login form currently stores the returned token in localStorage to make this starter usable in a browser-only setup. For production, move token handling to a server-managed session with a secure HttpOnly cookie and same-origin Route Handler proxy. Never store production secrets in client-accessible variables.
3. Checkout is protected because `POST /shop/orders` requires Bearer authentication. It sends `customer_name`, `customer_phone`, `shipping_address`, `note`, and `items: [{ product_id, quantity }]`.
4. Some API response details (image fields, order ID envelope, profile fields, order statuses, register schema) may differ. Verify with the actual Postman collection before production deployment.
5. Product prices in the cart are display estimates from the product response; the backend must validate final stock/prices on order creation.
6. Product detail currently displays related products when they are included in the returned response. Verify whether the API nests them under `related` or another field.
7. API CORS/network settings must permit requests from the development origin. If browser CORS blocks requests, implement a Next.js Route Handler proxy and keep auth server-side.

## Commands
```bash
npm run dev
npm run typecheck
npm run build
```

## Main routes
- `/`
- `/products`
- `/products/[id]`
- `/cart`
- `/login`
- `/register`
- `/checkout`
- `/orders`
- `/orders/[id]`
- `/profile`

This project is an implementation starter; run against the actual API, inspect response schemas, and complete security hardening before production use.
# ecom-sutaibuynt
