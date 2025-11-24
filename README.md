# Demo ERP System

A fully frontend-only, responsive demo ERP (Enterprise Resource Planning) web application designed to showcase ERP functionality to potential clients.

## Overview

This is a demonstration system built with pure HTML, CSS, and JavaScript. All data is dummy/static and stored in JavaScript objects with localStorage persistence. No backend or database is required.

## Features

### 1. Login Screen
- Simple fake authentication (accepts any email/password)
- Clean, modern design with demo notice
- Redirects to dashboard on login

### 2. Dashboard
- Summary cards showing:
  - Total Sales (Today)
  - Total Orders
  - Total Customers
  - Low Stock Items
- Sales chart (last 7 days)
- Recent orders table

### 3. Inventory Module
- Product listing with search functionality
- Columns: Product Name, SKU, Category, Stock, Price, Status
- Add new products via modal form
- Delete products
- Real-time stock status indicators (In Stock / Low Stock / Out of Stock)

### 4. Sales / Orders Module
- Order listing with search functionality
- Columns: Order ID, Customer, Date, Total Amount, Status
- View detailed order information in modal
- Status badges (Paid / Pending / Cancelled)
- Order items breakdown with tax calculation

### 5. Customers Module
- Customer listing with search functionality
- Columns: Name, Email, Phone, Total Orders, Last Order Date
- Add new customers via modal form
- Delete customers

### 6. Reports Module
- Monthly sales chart
- Top 5 products by revenue
- Top 5 customers by order count
- Visual data representation

### 7. Settings Page
- Business information configuration:
  - Business Name
  - Currency (PHP, USD, EUR)
  - Timezone
  - Contact Email
- Demo-only save functionality

## Technical Details

### Technologies Used
- **HTML5** - Structure and layout
- **CSS3** - Styling with custom properties, flexbox, and grid
- **JavaScript (ES6+)** - Application logic and interactivity
- **Canvas API** - Charts rendering
- **localStorage** - Data persistence across sessions
- **sessionStorage** - Login state management

### Key Features
- **Single Page Application (SPA)** - No page reloads, smooth navigation
- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **LocalStorage Persistence** - Added data persists across browser sessions
- **Modern UI/UX** - Clean, professional SaaS-style interface
- **Search/Filter** - Real-time filtering on all data tables
- **Modal System** - For forms and detail views
- **Notification System** - User feedback for actions

## File Structure

```
DEMO ERP/
├── index.html          # Main HTML structure
├── styles.css          # All styling and responsive design
├── app.js             # Application logic and data management
└── README.md          # This file
```

## How to Use

### Getting Started
1. Open `index.html` in any modern web browser
2. Enter any email and password on the login screen
3. Click "Login to Dashboard" to access the application

### Navigation
- Use the sidebar menu to navigate between modules
- Click on the hamburger menu icon on mobile devices to toggle the sidebar
- All navigation happens without page reloads

### Adding Data
- **Products**: Click "Add Product" button in Inventory module
- **Customers**: Click "Add Customer" button in Customers module
- All added data is stored in localStorage and persists across sessions

### Viewing Details
- **Orders**: Click the eye icon to view full order details
- Details are displayed in a modal overlay

### Searching
- Use the search bars at the top of each module to filter data
- Search works in real-time as you type

### Logging Out
- Click "Logout" in the sidebar to return to the login screen
- Session is cleared, but data persists in localStorage

## Browser Compatibility

Works best in modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Responsive Breakpoints

- **Desktop**: 1024px and above
- **Tablet**: 768px - 1023px
- **Mobile**: Below 768px

## Customization

### Colors
Edit CSS custom properties in `styles.css`:
```css
:root {
    --primary-color: #0EA5E9;      /* Main brand color */
    --success-color: #10B981;       /* Success states */
    --warning-color: #F59E0B;       /* Warning states */
    --danger-color: #EF4444;        /* Danger/error states */
}
```

### Data
Edit dummy data in `app.js`:
```javascript
let dummyData = {
    products: [...],
    orders: [...],
    customers: [...],
    // etc.
};
```

### Adding New Modules
1. Add navigation item in sidebar (HTML)
2. Create page content section (HTML)
3. Add initialization function (JavaScript)
4. Connect navigation handler

## Demo Notice

This is a frontend demonstration only. Features include:
- No real authentication
- No server-side processing
- No database storage
- Data stored in browser localStorage
- All operations are simulated

Footer text clearly states: "Demo ERP System – Frontend Demo Only. No real data is stored."

## Use Cases

Perfect for:
- Client demonstrations
- Sales presentations
- UI/UX showcases
- ERP concept validation
- Training and education
- Portfolio projects

## License

This is a demo project created for demonstration purposes.

## Support

For questions or customization requests, please refer to the code comments in each file.

---

**Demo ERP System** - A modern, responsive ERP demonstration application
