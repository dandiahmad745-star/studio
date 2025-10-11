# **App Name**: Kopimi Kafe Web App

## Core Features:

- Menu Display: Display the available menu items with details like name, price, description, and image.
- Promo Display: Showcase active promotions with titles, descriptions, and valid date ranges.
- Customer Reviews: Allow customers to submit reviews with ratings and comments; display existing reviews and admin replies.
- Admin Authentication: Secure the admin area with email and password-based login, using sessionStorage to persist the session.
- Menu Management: Enable admin users to create, read, update, and delete menu items, including image uploads and previews.
- Promo Management: Enable admin users to create, read, update, and delete promotions with date validation and active status.
- Shop Settings Management: Provide a form for admins to update shop details like name, address, contact information, and logo (Data URL).
- Data Persistence: Store and retrieve all application data (menus, promos, reviews, settings) using localStorage, with initial data from database.js.
- Image Handling: Handle image uploads in the admin panel by converting images to Data URLs (base64) and storing them in localStorage, eliminating the need for a backend server.
- Form Validations: Implement robust client-side form validations, including required fields, numeric values for prices, valid URL formats for links, and proper date formats for promotions, ensuring data integrity.
- Notification System: Display toast notifications for successful or failed actions (add, edit, delete) to provide immediate feedback to the user.
- Responsive Design: Ensure a responsive and mobile-first design approach, adapting the layout for different screen sizes and devices, with a hamburger menu for smaller screens.

## Style Guidelines:

- Primary color: Leaf Green (#88B04B) for a natural and inviting feel, reflecting the cafe's organic aesthetic.
- Background color: Off-White (#F2F0F0) for a clean, calm backdrop that emphasizes the content.
- Accent color: Warm Yellow (#E4B363) to highlight key actions and create a sense of warmth and appetite.
- Font: 'Poppins', a geometric sans-serif, for both headers and body text to give a modern, accessible, and slightly fashionable feel. Note: currently only Google Fonts are supported.
- Use a grid-based layout for menu items and promotions; card elements with hover effects for interactivity.
- Subtle transitions for modal windows (0.3s) and a sliding animation for toast notifications.
- Minimalist, line-style icons to complement the natural color palette, symbolizing relevant actions (e.g., edit, delete, add).
- Implement a clear and intuitive admin dashboard layout with a sidebar for navigation and a main content area, ensuring easy access to key functionalities.
- Design modal windows with a semi-transparent backdrop and a blur effect to focus attention on the modal content while keeping the background visible but subdued.