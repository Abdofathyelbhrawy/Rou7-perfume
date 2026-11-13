# رُوح | ROOH Perfume

A responsive, Arabic-first RTL storefront concept built from plain HTML, CSS, and JavaScript. Open `index.html` in a browser to view it; no build step is needed.

The official user-provided logos are in `assets/branding/`. The JPEG originals are preserved as `source-dark.jpeg` and `source-light.jpeg`; the PNG display assets are cropped to their artwork bounds, with a transparent canvas prepared for the light logo.

The storefront includes theme switching, a responsive catalog, product filtering and search, a local cart, checkout/order confirmation, and a local order lookup. It is a front-end concept: orders and tracking are stored only in the current browser and are not connected to a payment, shipping, or order-management service.

The branded admin overview is available at `admin.html`. It displays the latest locally stored demo order when one exists; it is not an authenticated or server-backed admin system.

The storefront currently has no seeded product records. Its catalog and cart are empty until the product table and Supabase connection are added. The interface is prepared to render product records using fields such as `id`, `name`, `price`, `image_url`, `category`, and `notes`.

The home hero now renders the featured product (`is_featured`) from a product record's `image_url`, `name`, and `notes`; with the catalog empty, it shows a prepared placeholder. The pink promotion below the hero is editable and schedulable from the admin page. Until Supabase is connected, promo settings use same-browser local storage.

The admin page promotion form saves its content and start/end times in local storage for this front-end phase. Connect the form and product query to Supabase when the project URL, anon key, tables, and storage policy are ready.
=======
# Rooh-perfume