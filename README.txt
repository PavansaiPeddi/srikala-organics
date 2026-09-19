SRIKALA ORGANICS — COMPLETE WEBSITE
====================================

This package replaces the broken frontend with a clean responsive ecommerce site.

Pages:
- index.html       Home + products
- product.html     Product details
- cart.html        Cart + quantity controls
- checkout.html    Customer checkout + Supabase order RPC
- admin.html       Admin login + order management
- config.js        Existing Supabase project configuration
- images/          Built-in product illustrations

IMPORTANT:
1. This package already contains the Supabase URL/key from your existing project.
2. Your existing Supabase RPC functions are expected:
   - create_order
   - get_admin_orders
   - get_admin_order_items
   - update_order_status
3. If you already have your own PNG product images, you can replace the SVGs in /images later.
4. Open index.html with VS Code Live Server.
5. Open admin.html for the admin dashboard.

The site also has local fallback products, so the homepage does not stay stuck on "Loading products..." if Supabase is temporarily unavailable.
