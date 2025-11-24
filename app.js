// Demo ERP System - Frontend Application
// All data is stored in JavaScript and localStorage for demo purposes

// ============================================
// DATA STORAGE
// ============================================

// Initialize dummy data
let dummyData = {
    products: [
        { id: 1, name: 'Laptop Pro 15"', sku: 'LPT-001', category: 'Electronics', stock: 45, price: 54999, status: 'In Stock' },
        { id: 2, name: 'Wireless Mouse', sku: 'WM-002', category: 'Electronics', stock: 120, price: 899, status: 'In Stock' },
        { id: 3, name: 'Office Chair Ergonomic', sku: 'OCH-003', category: 'Furniture', stock: 8, price: 7500, status: 'Low Stock' },
        { id: 4, name: 'LED Monitor 24"', sku: 'MON-004', category: 'Electronics', stock: 32, price: 8999, status: 'In Stock' },
        { id: 5, name: 'Mechanical Keyboard', sku: 'KB-005', category: 'Electronics', stock: 0, price: 3499, status: 'Out of Stock' },
        { id: 6, name: 'Standing Desk', sku: 'DSK-006', category: 'Furniture', stock: 15, price: 15999, status: 'In Stock' },
        { id: 7, name: 'USB-C Hub', sku: 'HUB-007', category: 'Electronics', stock: 65, price: 1299, status: 'In Stock' },
        { id: 8, name: 'Desk Lamp LED', sku: 'LMP-008', category: 'Office Supplies', stock: 5, price: 899, status: 'Low Stock' },
        { id: 9, name: 'Notebook Set', sku: 'NB-009', category: 'Office Supplies', stock: 200, price: 299, status: 'In Stock' },
        { id: 10, name: 'Coffee Beans Premium', sku: 'CF-010', category: 'Food & Beverage', stock: 3, price: 599, status: 'Low Stock' },
    ],
    orders: [
        { id: 'ORD-1001', customer: 'Juan dela Cruz', date: '2025-01-20', total: 63498, status: 'Paid', items: [{name: 'Laptop Pro 15"', qty: 1, price: 54999}, {name: 'Wireless Mouse', qty: 2, price: 899}] },
        { id: 'ORD-1002', customer: 'Maria Santos', date: '2025-01-20', total: 8999, status: 'Paid', items: [{name: 'LED Monitor 24"', qty: 1, price: 8999}] },
        { id: 'ORD-1003', customer: 'Pedro Garcia', date: '2025-01-19', total: 15999, status: 'Pending', items: [{name: 'Standing Desk', qty: 1, price: 15999}] },
        { id: 'ORD-1004', customer: 'Ana Reyes', date: '2025-01-19', total: 7500, status: 'Paid', items: [{name: 'Office Chair Ergonomic', qty: 1, price: 7500}] },
        { id: 'ORD-1005', customer: 'Carlos Mendoza', date: '2025-01-18', total: 3499, status: 'Cancelled', items: [{name: 'Mechanical Keyboard', qty: 1, price: 3499}] },
        { id: 'ORD-1006', customer: 'Linda Tan', date: '2025-01-18', total: 2598, status: 'Paid', items: [{name: 'USB-C Hub', qty: 2, price: 1299}] },
        { id: 'ORD-1007', customer: 'Robert Chen', date: '2025-01-17', total: 56297, status: 'Paid', items: [{name: 'Laptop Pro 15"', qty: 1, price: 54999}, {name: 'Desk Lamp LED', qty: 1, price: 899}] },
        { id: 'ORD-1008', customer: 'Sofia Rodriguez', date: '2025-01-17', total: 1798, status: 'Paid', items: [{name: 'Wireless Mouse', qty: 2, price: 899}] },
    ],
    customers: [
        { id: 1, name: 'Juan dela Cruz', email: 'juan@email.com', phone: '+63 912 345 6789', totalOrders: 5, lastOrderDate: '2025-01-20' },
        { id: 2, name: 'Maria Santos', email: 'maria@email.com', phone: '+63 923 456 7890', totalOrders: 3, lastOrderDate: '2025-01-20' },
        { id: 3, name: 'Pedro Garcia', email: 'pedro@email.com', phone: '+63 934 567 8901', totalOrders: 2, lastOrderDate: '2025-01-19' },
        { id: 4, name: 'Ana Reyes', email: 'ana@email.com', phone: '+63 945 678 9012', totalOrders: 4, lastOrderDate: '2025-01-19' },
        { id: 5, name: 'Carlos Mendoza', email: 'carlos@email.com', phone: '+63 956 789 0123', totalOrders: 1, lastOrderDate: '2025-01-18' },
        { id: 6, name: 'Linda Tan', email: 'linda@email.com', phone: '+63 967 890 1234', totalOrders: 6, lastOrderDate: '2025-01-18' },
        { id: 7, name: 'Robert Chen', email: 'robert@email.com', phone: '+63 978 901 2345', totalOrders: 8, lastOrderDate: '2025-01-17' },
        { id: 8, name: 'Sofia Rodriguez', email: 'sofia@email.com', phone: '+63 989 012 3456', totalOrders: 2, lastOrderDate: '2025-01-17' },
    ],
    salesData: [
        { day: 'Mon', sales: 45000 },
        { day: 'Tue', sales: 52000 },
        { day: 'Wed', sales: 48000 },
        { day: 'Thu', sales: 61000 },
        { day: 'Fri', sales: 55000 },
        { day: 'Sat', sales: 73000 },
        { day: 'Sun', sales: 68000 },
    ],
    monthlySales: [
        { month: 'Jul', sales: 450000 },
        { month: 'Aug', sales: 520000 },
        { month: 'Sep', sales: 480000 },
        { month: 'Oct', sales: 610000 },
        { month: 'Nov', sales: 550000 },
        { month: 'Dec', sales: 730000 },
    ]
};

// ============================================
// LOCAL STORAGE MANAGEMENT
// ============================================

function loadFromStorage() {
    const stored = localStorage.getItem('demoERPData');
    if (stored) {
        try {
            dummyData = JSON.parse(stored);
        } catch (e) {
            console.error('Error loading data from localStorage:', e);
        }
    }
}

function saveToStorage() {
    try {
        localStorage.setItem('demoERPData', JSON.stringify(dummyData));
    } catch (e) {
        console.error('Error saving data to localStorage:', e);
    }
}

// ============================================
// AUTHENTICATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    loadFromStorage();

    const loginForm = document.getElementById('loginForm');
    const loginScreen = document.getElementById('loginScreen');
    const mainApp = document.getElementById('mainApp');
    const logoutBtn = document.getElementById('logoutBtn');

    // Check if already logged in
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (isLoggedIn) {
        showMainApp();
    }

    // Login handler
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        sessionStorage.setItem('isLoggedIn', 'true');
        showMainApp();
    });

    // Logout handler
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        sessionStorage.removeItem('isLoggedIn');
        mainApp.style.display = 'none';
        loginScreen.style.display = 'flex';
    });

    function showMainApp() {
        loginScreen.style.display = 'none';
        mainApp.style.display = 'flex';
        initializeApp();
    }
});

// ============================================
// APP INITIALIZATION
// ============================================

function initializeApp() {
    // Initialize navigation
    initNavigation();

    // Initialize mobile menu
    initMobileMenu();

    // Load dashboard by default
    loadDashboard();

    // Initialize all modules
    initInventory();
    initSales();
    initCustomers();
    initReports();
    initSettings();
    initModals();
}

// ============================================
// NAVIGATION
// ============================================

function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item[data-page]');
    const pageTitle = document.getElementById('pageTitle');

    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();

            // Update active state
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');

            // Hide all pages
            document.querySelectorAll('.page-content').forEach(page => {
                page.classList.remove('active');
            });

            // Show selected page
            const pageName = this.getAttribute('data-page');
            const page = document.getElementById(pageName + 'Page');
            if (page) {
                page.classList.add('active');

                // Update page title
                const titles = {
                    'dashboard': 'Dashboard',
                    'inventory': 'Product Inventory',
                    'sales': 'Sales & Orders',
                    'customers': 'Customers',
                    'reports': 'Reports & Analytics',
                    'settings': 'Settings'
                };
                pageTitle.textContent = titles[pageName] || 'Dashboard';

                // Load page-specific data
                if (pageName === 'dashboard') loadDashboard();
                if (pageName === 'reports') loadReports();
            }
        });
    });
}

function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');

    mobileMenuBtn.addEventListener('click', function() {
        sidebar.classList.toggle('active');
    });

    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.remove('active');
    });

    // Close sidebar when clicking nav item on mobile
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
            }
        });
    });
}

// ============================================
// DASHBOARD
// ============================================

function loadDashboard() {
    renderRecentOrders();
    renderSalesChart();
}

function renderRecentOrders() {
    const tbody = document.getElementById('recentOrdersTable');
    const recentOrders = dummyData.orders.slice(0, 5);

    tbody.innerHTML = recentOrders.map(order => `
        <tr>
            <td><strong>${order.id}</strong></td>
            <td>${order.customer}</td>
            <td>₱${order.total.toLocaleString()}</td>
            <td><span class="badge ${getStatusClass(order.status)}">${order.status}</span></td>
        </tr>
    `).join('');
}

function renderSalesChart() {
    const canvas = document.getElementById('salesChart');
    const ctx = canvas.getContext('2d');

    // Simple bar chart
    const data = dummyData.salesData;
    const maxSales = Math.max(...data.map(d => d.sales));
    const padding = 40;
    const chartHeight = canvas.height - padding * 2;
    const chartWidth = canvas.width - padding * 2;
    const barWidth = chartWidth / data.length;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = 300;

    // Draw bars
    data.forEach((item, index) => {
        const barHeight = (item.sales / maxSales) * chartHeight;
        const x = padding + index * barWidth;
        const y = canvas.height - padding - barHeight;

        // Draw bar
        ctx.fillStyle = '#0EA5E9';
        ctx.fillRect(x + 10, y, barWidth - 20, barHeight);

        // Draw label
        ctx.fillStyle = '#64748B';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(item.day, x + barWidth / 2, canvas.height - 20);

        // Draw value
        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 11px Inter';
        ctx.fillText('₱' + (item.sales / 1000).toFixed(0) + 'k', x + barWidth / 2, y - 5);
    });
}

// ============================================
// INVENTORY MODULE
// ============================================

function initInventory() {
    renderProducts();

    // Search functionality
    const searchInput = document.getElementById('productSearch');
    searchInput.addEventListener('input', function() {
        renderProducts(this.value);
    });

    // Add product button
    const addBtn = document.getElementById('addProductBtn');
    addBtn.addEventListener('click', function() {
        openModal('addProductModal');
    });

    // Add product form
    const form = document.getElementById('addProductForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        addProduct();
    });
}

function renderProducts(searchTerm = '') {
    const tbody = document.getElementById('productsTable');
    let products = dummyData.products;

    // Filter products
    if (searchTerm) {
        products = products.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    tbody.innerHTML = products.map(product => `
        <tr>
            <td><strong>${product.name}</strong></td>
            <td>${product.sku}</td>
            <td>${product.category}</td>
            <td>${product.stock}</td>
            <td>₱${product.price.toLocaleString()}</td>
            <td><span class="badge ${getStockStatusClass(product.stock)}">${product.status}</span></td>
            <td>
                <button class="btn-icon" onclick="editProduct(${product.id})" title="Edit">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M12.5 2.5L15.5 5.5L5.5 15.5H2.5V12.5L12.5 2.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <button class="btn-icon danger" onclick="deleteProduct(${product.id})" title="Delete">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M3 4H15M7 4V3C7 2.44772 7.44772 2 8 2H10C10.5523 2 11 2.44772 11 3V4M5 4V14C5 14.5523 5.44772 15 6 15H12C12.5523 15 13 14.5523 13 14V4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                </button>
            </td>
        </tr>
    `).join('');
}

function addProduct() {
    const product = {
        id: Date.now(),
        name: document.getElementById('productName').value,
        sku: document.getElementById('productSKU').value,
        category: document.getElementById('productCategory').value,
        stock: parseInt(document.getElementById('productStock').value),
        price: parseFloat(document.getElementById('productPrice').value),
        status: getStockStatus(parseInt(document.getElementById('productStock').value))
    };

    dummyData.products.unshift(product);
    saveToStorage();
    renderProducts();
    closeModal('addProductModal');
    document.getElementById('addProductForm').reset();
    showNotification('Product added successfully!');
}

function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        dummyData.products = dummyData.products.filter(p => p.id !== id);
        saveToStorage();
        renderProducts();
        showNotification('Product deleted successfully!');
    }
}

function editProduct(id) {
    showNotification('Edit functionality - Demo only');
}

function getStockStatus(stock) {
    if (stock === 0) return 'Out of Stock';
    if (stock < 10) return 'Low Stock';
    return 'In Stock';
}

function getStockStatusClass(stock) {
    if (stock === 0) return 'danger';
    if (stock < 10) return 'warning';
    return 'success';
}

// ============================================
// SALES MODULE
// ============================================

function initSales() {
    renderOrders();

    // Search functionality
    const searchInput = document.getElementById('orderSearch');
    searchInput.addEventListener('input', function() {
        renderOrders(this.value);
    });
}

function renderOrders(searchTerm = '') {
    const tbody = document.getElementById('ordersTable');
    let orders = dummyData.orders;

    // Filter orders
    if (searchTerm) {
        orders = orders.filter(o =>
            o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.customer.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    tbody.innerHTML = orders.map(order => `
        <tr>
            <td><strong>${order.id}</strong></td>
            <td>${order.customer}</td>
            <td>${order.date}</td>
            <td>₱${order.total.toLocaleString()}</td>
            <td><span class="badge ${getStatusClass(order.status)}">${order.status}</span></td>
            <td>
                <button class="btn-icon" onclick="viewOrderDetails('${order.id}')" title="View Details">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M9 12C10.6569 12 12 10.6569 12 9C12 7.34315 10.6569 6 9 6C7.34315 6 6 7.34315 6 9C6 10.6569 7.34315 12 9 12Z" stroke="currentColor" stroke-width="1.5"/>
                        <path d="M2 9C2 9 4 4 9 4C14 4 16 9 16 9C16 9 14 14 9 14C4 14 2 9 2 9Z" stroke="currentColor" stroke-width="1.5"/>
                    </svg>
                </button>
            </td>
        </tr>
    `).join('');
}

function viewOrderDetails(orderId) {
    const order = dummyData.orders.find(o => o.id === orderId);
    if (!order) return;

    const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const tax = subtotal * 0.12;
    const total = subtotal + tax;

    const content = document.getElementById('orderDetailsContent');
    content.innerHTML = `
        <div class="order-detail-grid">
            <div class="detail-item">
                <span class="detail-label">Order ID</span>
                <span class="detail-value"><strong>${order.id}</strong></span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Status</span>
                <span class="detail-value"><span class="badge ${getStatusClass(order.status)}">${order.status}</span></span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Customer</span>
                <span class="detail-value">${order.customer}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Date</span>
                <span class="detail-value">${order.date}</span>
            </div>
        </div>

        <div class="order-items-section">
            <h4>Order Items</h4>
            <table class="table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    ${order.items.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.qty}</td>
                            <td>₱${item.price.toLocaleString()}</td>
                            <td>₱${(item.price * item.qty).toLocaleString()}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <div class="order-summary">
                <div class="summary-row">
                    <span>Subtotal:</span>
                    <span>₱${subtotal.toLocaleString()}</span>
                </div>
                <div class="summary-row">
                    <span>Tax (12%):</span>
                    <span>₱${tax.toLocaleString()}</span>
                </div>
                <div class="summary-row total">
                    <span>Total:</span>
                    <span>₱${total.toLocaleString()}</span>
                </div>
            </div>
        </div>
    `;

    openModal('orderDetailsModal');
}

function getStatusClass(status) {
    const classes = {
        'Paid': 'success',
        'Pending': 'warning',
        'Cancelled': 'danger',
        'Processing': 'info'
    };
    return classes[status] || 'secondary';
}

// ============================================
// CUSTOMERS MODULE
// ============================================

function initCustomers() {
    renderCustomers();

    // Search functionality
    const searchInput = document.getElementById('customerSearch');
    searchInput.addEventListener('input', function() {
        renderCustomers(this.value);
    });

    // Add customer button
    const addBtn = document.getElementById('addCustomerBtn');
    addBtn.addEventListener('click', function() {
        openModal('addCustomerModal');
    });

    // Add customer form
    const form = document.getElementById('addCustomerForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        addCustomer();
    });
}

function renderCustomers(searchTerm = '') {
    const tbody = document.getElementById('customersTable');
    let customers = dummyData.customers;

    // Filter customers
    if (searchTerm) {
        customers = customers.filter(c =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.phone.includes(searchTerm)
        );
    }

    tbody.innerHTML = customers.map(customer => `
        <tr>
            <td><strong>${customer.name}</strong></td>
            <td>${customer.email}</td>
            <td>${customer.phone}</td>
            <td>${customer.totalOrders}</td>
            <td>${customer.lastOrderDate}</td>
            <td>
                <button class="btn-icon" onclick="viewCustomerProfile(${customer.id})" title="View Profile">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M9 12C10.6569 12 12 10.6569 12 9C12 7.34315 10.6569 6 9 6C7.34315 6 6 7.34315 6 9C6 10.6569 7.34315 12 9 12Z" stroke="currentColor" stroke-width="1.5"/>
                        <path d="M2 9C2 9 4 4 9 4C14 4 16 9 16 9C16 9 14 14 9 14C4 14 2 9 2 9Z" stroke="currentColor" stroke-width="1.5"/>
                    </svg>
                </button>
                <button class="btn-icon danger" onclick="deleteCustomer(${customer.id})" title="Delete">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M3 4H15M7 4V3C7 2.44772 7.44772 2 8 2H10C10.5523 2 11 2.44772 11 3V4M5 4V14C5 14.5523 5.44772 15 6 15H12C12.5523 15 13 14.5523 13 14V4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                </button>
            </td>
        </tr>
    `).join('');
}

function addCustomer() {
    const customer = {
        id: Date.now(),
        name: document.getElementById('customerName').value,
        email: document.getElementById('customerEmail').value,
        phone: document.getElementById('customerPhone').value,
        totalOrders: 0,
        lastOrderDate: 'N/A'
    };

    dummyData.customers.unshift(customer);
    saveToStorage();
    renderCustomers();
    closeModal('addCustomerModal');
    document.getElementById('addCustomerForm').reset();
    showNotification('Customer added successfully!');
}

function deleteCustomer(id) {
    if (confirm('Are you sure you want to delete this customer?')) {
        dummyData.customers = dummyData.customers.filter(c => c.id !== id);
        saveToStorage();
        renderCustomers();
        showNotification('Customer deleted successfully!');
    }
}

function viewCustomerProfile(id) {
    showNotification('Customer profile view - Demo only');
}

// ============================================
// REPORTS MODULE
// ============================================

function initReports() {
    // Reports will be loaded when page is shown
}

function loadReports() {
    renderMonthlySalesChart();
    renderTopProducts();
    renderTopCustomers();
}

function renderMonthlySalesChart() {
    const canvas = document.getElementById('monthlySalesChart');
    const ctx = canvas.getContext('2d');

    const data = dummyData.monthlySales;
    const maxSales = Math.max(...data.map(d => d.sales));
    const padding = 40;
    const chartHeight = canvas.height - padding * 2;
    const chartWidth = canvas.width - padding * 2;
    const barWidth = chartWidth / data.length;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = 300;

    // Draw bars
    data.forEach((item, index) => {
        const barHeight = (item.sales / maxSales) * chartHeight;
        const x = padding + index * barWidth;
        const y = canvas.height - padding - barHeight;

        // Draw bar
        ctx.fillStyle = '#10B981';
        ctx.fillRect(x + 10, y, barWidth - 20, barHeight);

        // Draw label
        ctx.fillStyle = '#64748B';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(item.month, x + barWidth / 2, canvas.height - 20);

        // Draw value
        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 11px Inter';
        ctx.fillText('₱' + (item.sales / 1000).toFixed(0) + 'k', x + barWidth / 2, y - 5);
    });
}

function renderTopProducts() {
    const container = document.getElementById('topProducts');
    const topProducts = [
        { name: 'Laptop Pro 15"', value: '₱274,995' },
        { name: 'Standing Desk', value: '₱159,990' },
        { name: 'LED Monitor 24"', value: '₱134,985' },
        { name: 'Office Chair Ergonomic', value: '₱97,500' },
        { name: 'Mechanical Keyboard', value: '₱73,479' },
    ];

    container.innerHTML = topProducts.map((product, index) => `
        <div class="top-item">
            <div>
                <div class="top-item-name">${index + 1}. ${product.name}</div>
            </div>
            <div class="top-item-value">${product.value}</div>
        </div>
    `).join('');
}

function renderTopCustomers() {
    const container = document.getElementById('topCustomers');
    const topCustomers = dummyData.customers
        .sort((a, b) => b.totalOrders - a.totalOrders)
        .slice(0, 5);

    container.innerHTML = topCustomers.map((customer, index) => `
        <div class="top-item">
            <div>
                <div class="top-item-name">${index + 1}. ${customer.name}</div>
            </div>
            <div class="top-item-value">${customer.totalOrders} orders</div>
        </div>
    `).join('');
}

// ============================================
// SETTINGS MODULE
// ============================================

function initSettings() {
    const form = document.getElementById('settingsForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        showNotification('Settings saved (demo only)');
    });
}

// ============================================
// MODAL MANAGEMENT
// ============================================

function initModals() {
    // Close buttons
    document.querySelectorAll('.modal-close, [data-modal]').forEach(btn => {
        btn.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            if (modalId) {
                closeModal(modalId);
            }
        });
    });

    // Click outside to close
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this.id);
            }
        });
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10B981;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        animation: slideInRight 0.3s ease;
        font-size: 14px;
        font-weight: 500;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============================================
// WINDOW RESIZE HANDLER
// ============================================

window.addEventListener('resize', function() {
    // Redraw charts on resize
    const salesChart = document.getElementById('salesChart');
    const monthlyChart = document.getElementById('monthlySalesChart');

    if (salesChart && salesChart.offsetParent !== null) {
        renderSalesChart();
    }

    if (monthlyChart && monthlyChart.offsetParent !== null) {
        renderMonthlySalesChart();
    }
});
