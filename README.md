# AVA Solutions ERP

A fully frontend-only, responsive ERP (Enterprise Resource Planning) Progressive Web App built with pure HTML, CSS, and JavaScript. All data is stored locally using localStorage - no backend required.

## Overview

AVA Solutions ERP is a complete point-of-sale and business management system designed for small to medium businesses. It features user authentication, inventory management, sales processing, customer tracking, and comprehensive reporting.

## Features

### Authentication
- Account registration with email/password
- Secure login with session management
- Multiple user accounts supported
- Automatic session persistence

### Dashboard
- Real-time business metrics:
  - Today's Revenue
  - Monthly Revenue
  - Yearly Revenue
  - Inventory Value
- Revenue trend chart (7 days)
- Sales by category breakdown
- Orders and inventory status cards
- Daily sales goal tracking with progress
- Sales history by date

### Point of Sale (POS)
- Product grid with quick add to cart
- Real-time cart management
- Customer selection
- Configurable markup and tax rates
- Discount support
- Auto-generated order numbers
- Receipt generation

### Inventory Management
- Product listing with search
- Add/Edit/Delete products
- Category management
- Stock quantity tracking
- Price management
- Product-specific low stock alerts
- Stock status indicators (In Stock / Low Stock / Out of Stock)

### Sales / Orders
- Complete order history
- Order details with item breakdown
- Status tracking (Paid / Pending / Cancelled)
- Tax and total calculations
- Customer association

### Customers
- Customer database management
- Contact information storage
- Order history per customer
- Add/Edit/Delete customers

### Reports & Analytics
- Top products by revenue
- Top customers by spending
- Monthly sales chart
- Visual data representation

### Settings
- Business name configuration
- Currency selection (PHP, USD, EUR)
- Tax rate configuration
- Markup rate settings
- Low stock threshold (global)
- Daily sales goal
- Data export (JSON)
- Data import functionality

### Progressive Web App (PWA)
- Installable on mobile and desktop
- Offline capability
- App icon and splash screen
- Standalone display mode

## Technical Stack

- **HTML5** - Structure and semantic markup
- **CSS3** - Custom properties, Flexbox, Grid, responsive design
- **JavaScript (ES6+)** - Application logic
- **Canvas API** - Custom chart rendering
- **localStorage** - Data persistence
- **sessionStorage** - Session management
- **Service Worker** - Offline caching (PWA)
- **Web App Manifest** - PWA configuration

## File Structure

```
DEMO ERP/
├── index.html          # Main application
├── styles.css          # All styling
├── app.js              # Application logic
├── manifest.json       # PWA manifest
├── sw.js               # Service worker
├── images/
│   ├── icon.svg        # App icon
│   └── Ava transparent.png  # Logo
└── README.md           # Documentation
```

## Getting Started

### Option 1: Direct Open
1. Open `index.html` in a modern web browser

### Option 2: Local Server (Recommended for PWA)
1. Run a local server: `npx http-server -p 5500`
2. Open `http://localhost:5500`

### First Time Setup
1. Create an account on the signup screen
2. Login with your credentials
3. Configure settings (business name, currency, tax rate)
4. Add products to inventory
5. Start making sales!

## Usage Guide

### Making a Sale
1. Navigate to "New Sale" in the sidebar
2. Click products to add them to cart
3. Adjust quantities as needed
4. Select or add a customer
5. Click "Checkout" to review
6. Adjust markup, tax, or add discounts
7. Confirm the sale

### Managing Inventory
1. Go to "Inventory" module
2. Click "Add Product" to add new items
3. Set product-specific low stock alerts
4. Edit or delete products as needed

### Viewing Reports
1. Navigate to "Reports" module
2. View top products and customers
3. Analyze monthly sales trends

### Installing as PWA
1. Open the app in Chrome/Edge
2. Click the install icon in the address bar
3. Or use browser menu > "Install App"

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Responsive Design

- **Desktop**: 1024px and above
- **Tablet**: 768px - 1023px
- **Mobile**: Below 768px

## Customization

### Theme Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --primary-color: #1B5E37;    /* AVA Green */
    --success-color: #10B981;
    --warning-color: #F59E0B;
    --danger-color: #EF4444;
}
```

### Currency
Change in Settings page or edit `defaultData` in `app.js`

## Data Storage

All data is stored in browser localStorage:
- `avaErpData` - Products, customers, orders, settings
- `avaAccounts` - User accounts
- `avaOrderNumber` - Order number counter

## Notes

- This is a frontend-only application
- No server-side processing
- Data persists in browser localStorage
- Clear browser data to reset the application

---

**AVA Solutions ERP** - Enterprise Resource Planning System
