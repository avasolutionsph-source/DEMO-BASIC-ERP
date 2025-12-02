// AVA Solutions - Business Management System
// Fully offline - All data stored in localStorage

// ============================================
// DATA STORAGE & INITIALIZATION
// ============================================

const defaultData = {
    settings: {
        businessName: 'My Business',
        currency: 'PHP',
        currencySymbol: '₱',
        taxRate: 12,
        markupRate: 30,
        lowStockThreshold: 10,
        dailyGoal: 15000,
        contactEmail: ''
    },
    products: [],
    customers: [],
    orders: []
};

let appData = JSON.parse(JSON.stringify(defaultData));
let posCart = [];
let currentOrderNumber = 1;
let deferredPrompt = null;

// ============================================
// PWA INSTALL HANDLER
// ============================================

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    // Show install button if on landing page
    const installBtn = document.getElementById('installBtn');
    if (installBtn) {
        installBtn.style.display = 'inline-flex';
    }
});

window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    const installBtn = document.getElementById('installBtn');
    if (installBtn) {
        installBtn.style.display = 'none';
    }
    showNotification('App installed successfully!', 'success');
});

// ============================================
// STORAGE FUNCTIONS
// ============================================

function loadData() {
    const saved = localStorage.getItem('avaErpData');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            // Preserve all saved values including 0, only use defaults for missing keys
            appData = {
                settings: { ...defaultData.settings },
                products: parsed.products || [],
                customers: parsed.customers || [],
                orders: parsed.orders || []
            };
            // Explicitly copy each setting to preserve 0 values
            if (parsed.settings) {
                Object.keys(parsed.settings).forEach(key => {
                    if (parsed.settings[key] !== undefined) {
                        appData.settings[key] = parsed.settings[key];
                    }
                });
            }
        } catch (e) {
            console.error('Error loading data:', e);
            appData = JSON.parse(JSON.stringify(defaultData));
        }
    }
    // Load order number counter
    const savedOrderNumber = localStorage.getItem('avaOrderNumber');
    if (savedOrderNumber) {
        currentOrderNumber = parseInt(savedOrderNumber) || 1;
    }
}

function saveData() {
    localStorage.setItem('avaErpData', JSON.stringify(appData));
    localStorage.setItem('avaOrderNumber', currentOrderNumber.toString());
}

function getAccounts() {
    try {
        return JSON.parse(localStorage.getItem('avaAccounts')) || [];
    } catch (e) {
        return [];
    }
}

function saveAccounts(accounts) {
    localStorage.setItem('avaAccounts', JSON.stringify(accounts));
}

function getCurrentUser() {
    try {
        return JSON.parse(sessionStorage.getItem('avaCurrentUser'));
    } catch (e) {
        return null;
    }
}

function setCurrentUser(user) {
    sessionStorage.setItem('avaCurrentUser', JSON.stringify(user));
    sessionStorage.setItem('avaLoggedIn', 'true');
}

function clearCurrentUser() {
    sessionStorage.removeItem('avaCurrentUser');
    sessionStorage.removeItem('avaLoggedIn');
}

function isLoggedIn() {
    return sessionStorage.getItem('avaLoggedIn') === 'true';
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function formatCurrency(amount) {
    const symbol = appData.settings?.currencySymbol || '₱';
    return symbol + (amount || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getStockStatus(stock, productLowStockAlert = null) {
    // Use product-specific threshold if set, otherwise use global setting
    const threshold = productLowStockAlert !== null && productLowStockAlert !== undefined
        ? productLowStockAlert
        : (appData.settings?.lowStockThreshold ?? 10);
    if (stock <= 0) return { text: 'Out of Stock', class: 'danger' };
    if (stock < threshold) return { text: 'Low Stock', class: 'warning' };
    return { text: 'In Stock', class: 'success' };
}

function generateId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
}

function generateOrderId() {
    return 'ORD-' + (currentOrderNumber++);
}

function showNotification(message, type = 'success') {
    let container = document.getElementById('notificationContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notificationContainer';
        container.className = 'notification-container';
        document.body.appendChild(container);
    }

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    container.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' });
}

function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

// ============================================
// AUTHENTICATION
// ============================================

function initAuth() {
    const landingPage = document.getElementById('landingPage');
    const signupScreen = document.getElementById('signupScreen');
    const loginScreen = document.getElementById('loginScreen');
    const mainApp = document.getElementById('mainApp');
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');
    const logoutBtn = document.getElementById('logoutBtn');
    const getStartedBtn = document.getElementById('getStartedBtn');

    // Always attach logout handler
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        clearCurrentUser();
        location.reload();
    });

    // Get Started button handler
    getStartedBtn.addEventListener('click', function() {
        landingPage.style.display = 'none';
        signupScreen.style.display = 'flex';
    });

    // Install button handler
    const installBtn = document.getElementById('installBtn');
    if (installBtn) {
        // Show button if install prompt is already available
        if (deferredPrompt) {
            installBtn.style.display = 'inline-flex';
        }
        installBtn.addEventListener('click', async function() {
            if (!deferredPrompt) return;
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                deferredPrompt = null;
                installBtn.style.display = 'none';
            }
        });
    }

    const accounts = getAccounts();

    // Check if logged in
    if (isLoggedIn() && getCurrentUser()) {
        showMainApp();
        return;
    }

    // Show landing page if no accounts, otherwise show login
    if (accounts.length === 0) {
        landingPage.style.display = 'flex';
        signupScreen.style.display = 'none';
        loginScreen.style.display = 'none';
        mainApp.style.display = 'none';
    } else {
        landingPage.style.display = 'none';
        signupScreen.style.display = 'none';
        loginScreen.style.display = 'flex';
        mainApp.style.display = 'none';
    }

    // Signup form
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('signupName').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;

        if (password !== confirmPassword) {
            showNotification('Passwords do not match!', 'error');
            return;
        }

        const accounts = getAccounts();
        if (accounts.find(a => a.email === email)) {
            showNotification('Email already exists!', 'error');
            return;
        }

        const newAccount = { id: generateId(), name, email, password, role: 'Owner', createdAt: new Date().toISOString() };
        accounts.push(newAccount);
        saveAccounts(accounts);
        setCurrentUser(newAccount);
        showNotification('Account created successfully!', 'success');
        showMainApp();
    });

    // Login form
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        const accounts = getAccounts();
        const account = accounts.find(a => a.email === email && a.password === password);

        if (account) {
            setCurrentUser(account);
            showNotification('Welcome back, ' + account.name + '!', 'success');
            showMainApp();
        } else {
            showNotification('Invalid email or password!', 'error');
        }
    });
}

function showMainApp() {
    const signupScreen = document.getElementById('signupScreen');
    const loginScreen = document.getElementById('loginScreen');
    const mainApp = document.getElementById('mainApp');

    signupScreen.style.display = 'none';
    loginScreen.style.display = 'none';
    mainApp.style.display = 'flex';

    // Update user info in sidebar
    const user = getCurrentUser();
    if (user) {
        document.getElementById('userName').textContent = user.name;
        document.getElementById('userRole').textContent = user.role || 'Owner';
        document.getElementById('userAvatar').textContent = getInitials(user.name);
    }

    // Update current date
    const dateEl = document.getElementById('currentDate');
    if (dateEl) {
        dateEl.textContent = new Date().toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }

    // Initialize app
    initNavigation();
    initModals();
    initSearch();
    loadDashboard();
}

// ============================================
// NAVIGATION
// ============================================

function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item[data-page]');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');

    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            navigateTo(page);

            // Close mobile menu
            sidebar.classList.remove('active');
        });
    });

    // Mobile menu
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => sidebar.classList.add('active'));
    }
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => sidebar.classList.remove('active'));
    }

    // Sidebar section toggles
    document.querySelectorAll('.nav-section-toggle').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const section = this.closest('.nav-section');
            section.classList.toggle('collapsed');
        });
    });
}

function navigateTo(page) {
    // Update nav active state
    document.querySelectorAll('.nav-item[data-page]').forEach(nav => {
        nav.classList.toggle('active', nav.getAttribute('data-page') === page);
    });

    // Show page content
    document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
    const pageEl = document.getElementById(page + 'Page');
    if (pageEl) pageEl.classList.add('active');

    // Update page title
    const titles = {
        dashboard: { title: 'Dashboard', subtitle: 'Real-time business overview' },
        inventory: { title: 'Inventory', subtitle: 'Manage your products' },
        sales: { title: 'Sales & Orders', subtitle: 'Track your orders' },
        customers: { title: 'Customers', subtitle: 'Manage your customers' },
        reports: { title: 'Reports', subtitle: 'Analytics and insights' },
        settings: { title: 'Settings', subtitle: 'Configure your business' },
        pos: { title: 'Point of Sale', subtitle: 'Process transactions' }
    };

    const titleInfo = titles[page] || { title: page, subtitle: '' };
    document.getElementById('pageTitle').textContent = titleInfo.title;
    document.getElementById('pageSubtitle').textContent = titleInfo.subtitle;

    // Load page data
    switch(page) {
        case 'dashboard': loadDashboard(); break;
        case 'inventory': loadInventory(); break;
        case 'sales': loadSales(); break;
        case 'customers': loadCustomers(); break;
        case 'reports': loadReports(); break;
        case 'settings': loadSettings(); break;
        case 'pos': loadPOS(); break;
    }
}

// ============================================
// DASHBOARD
// ============================================

function loadDashboard() {
    const today = new Date().toISOString().split('T')[0];
    const thisMonthStart = new Date();
    thisMonthStart.setDate(1);

    const paidOrders = appData.orders.filter(o => o.status === 'Paid');
    const todayOrders = paidOrders.filter(o => o.date === today);
    const monthOrders = paidOrders.filter(o => new Date(o.date) >= thisMonthStart);

    // This year orders
    const thisYearStart = new Date();
    thisYearStart.setMonth(0, 1);
    thisYearStart.setHours(0, 0, 0, 0);
    const yearOrders = paidOrders.filter(o => new Date(o.date) >= thisYearStart);

    const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);
    const monthRevenue = monthOrders.reduce((sum, o) => sum + o.total, 0);
    const yearRevenue = yearOrders.reduce((sum, o) => sum + o.total, 0);
    const avgTransaction = paidOrders.length > 0 ? paidOrders.reduce((sum, o) => sum + o.total, 0) / paidOrders.length : 0;

    const globalThreshold = appData.settings?.lowStockThreshold ?? 10;
    // Use product-specific threshold if set, otherwise use global threshold
    const lowStockItems = appData.products.filter(p => {
        const threshold = p.lowStockAlert !== null && p.lowStockAlert !== undefined ? p.lowStockAlert : globalThreshold;
        return p.stock > 0 && p.stock < threshold;
    });
    const outOfStock = appData.products.filter(p => p.stock === 0);
    const criticalStock = appData.products.filter(p => p.stock > 0 && p.stock < 5);
    const inventoryValue = appData.products.reduce((sum, p) => sum + (p.price * p.stock), 0);

    const pendingOrders = appData.orders.filter(o => o.status === 'Pending').length;
    const completedToday = todayOrders.length;

    // Financial Metrics
    document.getElementById('metricTodayRevenue').textContent = formatCurrency(todayRevenue);
    document.getElementById('metricMonthRevenue').textContent = formatCurrency(monthRevenue);
    document.getElementById('metricYearRevenue').textContent = formatCurrency(yearRevenue);
    document.getElementById('metricAvgTransaction').textContent = formatCurrency(avgTransaction);

    // Daily goal progress
    const dailyGoal = appData.settings?.dailyGoal ?? 15000;
    const goalProgress = Math.min((todayRevenue / dailyGoal) * 100, 100);
    document.getElementById('dailyGoalProgress').style.width = goalProgress + '%';
    document.getElementById('dailyGoalPercent').textContent = Math.round(goalProgress) + '%';
    document.getElementById('dailyGoalText').textContent = `${formatCurrency(todayRevenue)} / ${formatCurrency(dailyGoal)}`;

    // Operational Metrics
    document.getElementById('metricPendingOrders').textContent = pendingOrders;
    document.getElementById('metricCompletedToday').textContent = completedToday;

    // Inventory Metrics
    document.getElementById('metricCriticalStock').textContent = criticalStock.length;
    document.getElementById('metricOutOfStock').textContent = outOfStock.length;
    document.getElementById('metricInventoryValue').textContent = formatCurrency(inventoryValue);
    document.getElementById('metricLowStockAlerts').textContent = lowStockItems.length;

    // Update Top Alert Bar
    const topAlertBar = document.getElementById('topAlertBar');
    if (lowStockItems.length > 0) {
        topAlertBar.style.display = 'flex';
        document.getElementById('topAlertCount').textContent = lowStockItems.length;
        document.getElementById('topAlertDetail').textContent = lowStockItems[0].name + ' (' + lowStockItems[0].stock + ' left)';
    } else {
        topAlertBar.style.display = 'none';
    }

    // Render charts
    renderRevenueChart();
    renderCategoryChart();
    renderTopProductsChart();

    // Initialize sales history date picker to today
    const dateInput = document.getElementById('salesHistoryDate');
    if (dateInput) {
        dateInput.value = today;
        loadSalesHistory();
    }
}

function loadSalesHistory() {
    const dateInput = document.getElementById('salesHistoryDate');
    if (!dateInput) return;

    const selectedDate = dateInput.value;
    const paidOrders = appData.orders.filter(o => o.status === 'Paid' && o.date === selectedDate);

    const revenue = paidOrders.reduce((sum, o) => sum + o.total, 0);
    const orderCount = paidOrders.length;
    const itemsSold = paidOrders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.qty, 0), 0);

    document.getElementById('historyRevenue').textContent = formatCurrency(revenue);
    document.getElementById('historyOrders').textContent = orderCount;
    document.getElementById('historyItems').textContent = itemsSold;
}

function renderRevenueChart() {
    const canvas = document.getElementById('revenueChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = 200;

    // Get last 7 days sales
    const salesByDay = {};
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        days.push({ date: dateStr, label: date.toLocaleDateString('en-PH', { weekday: 'short' }) });
        salesByDay[dateStr] = 0;
    }

    appData.orders.filter(o => o.status === 'Paid').forEach(order => {
        if (salesByDay[order.date] !== undefined) {
            salesByDay[order.date] += order.total;
        }
    });

    const values = days.map(d => salesByDay[d.date]);
    const maxValue = Math.max(...values, 1);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const padding = { top: 30, right: 20, bottom: 30, left: 50 };
    const chartWidth = canvas.width - padding.left - padding.right;
    const chartHeight = canvas.height - padding.top - padding.bottom;

    // Draw horizontal grid lines
    ctx.strokeStyle = '#E0E0E0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
        const y = padding.top + (chartHeight / 4) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(canvas.width - padding.right, y);
        ctx.stroke();

        // Y-axis labels
        const val = maxValue - (maxValue / 4) * i;
        ctx.fillStyle = '#666666';
        ctx.font = '10px Inter';
        ctx.textAlign = 'right';
        ctx.fillText(formatCurrency(val).replace('₱', ''), padding.left - 8, y + 4);
    }

    // Draw line chart with area fill
    const points = [];
    days.forEach((day, i) => {
        const x = padding.left + (i / (days.length - 1)) * chartWidth;
        const y = padding.top + chartHeight - (values[i] / maxValue) * chartHeight;
        points.push({ x, y, value: values[i] });
    });

    // Draw gradient fill under line
    const gradient = ctx.createLinearGradient(0, padding.top, 0, canvas.height - padding.bottom);
    gradient.addColorStop(0, 'rgba(27, 94, 55, 0.3)');
    gradient.addColorStop(1, 'rgba(27, 94, 55, 0.05)');

    ctx.beginPath();
    ctx.moveTo(points[0].x, canvas.height - padding.bottom);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length - 1].x, canvas.height - padding.bottom);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw line
    ctx.beginPath();
    ctx.strokeStyle = '#1B5E37';
    ctx.lineWidth = 2;
    points.forEach((p, i) => {
        if (i === 0) {
            ctx.moveTo(p.x, p.y);
        } else {
            ctx.lineTo(p.x, p.y);
        }
    });
    ctx.stroke();

    // Draw points
    points.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#1B5E37';
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
    });

    // Draw X-axis labels
    ctx.fillStyle = '#666666';
    ctx.font = '11px Inter';
    ctx.textAlign = 'center';
    days.forEach((day, i) => {
        const x = padding.left + (i / (days.length - 1)) * chartWidth;
        ctx.fillText(day.label, x, canvas.height - 8);
    });
}

function renderCategoryChart() {
    const canvas = document.getElementById('categoryChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = 200;
    canvas.height = 200;

    // Get sales by category
    const categorySales = {};
    appData.orders.filter(o => o.status === 'Paid').forEach(order => {
        order.items.forEach(item => {
            const product = appData.products.find(p => p.id === item.productId);
            const category = product ? product.category : 'Other';
            if (!categorySales[category]) {
                categorySales[category] = 0;
            }
            categorySales[category] += item.price * item.qty;
        });
    });

    const categories = Object.entries(categorySales).sort((a, b) => b[1] - a[1]);
    const total = categories.reduce((sum, [, val]) => sum + val, 0);

    if (total === 0) {
        ctx.fillStyle = '#E0E0E0';
        ctx.beginPath();
        ctx.arc(100, 100, 80, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#666666';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('No data', 100, 105);
        return;
    }

    const colors = ['#1B5E37', '#666666', '#999999', '#1A1A1A', '#D97706', '#DC2626'];
    let startAngle = -Math.PI / 2;

    categories.forEach(([category, value], i) => {
        const sliceAngle = (value / total) * Math.PI * 2;

        ctx.beginPath();
        ctx.moveTo(100, 100);
        ctx.arc(100, 100, 80, startAngle, startAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();

        startAngle += sliceAngle;
    });

    // Draw center circle (donut effect)
    ctx.beginPath();
    ctx.arc(100, 100, 50, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();

    // Draw total in center
    ctx.fillStyle = '#1A1A1A';
    ctx.font = 'bold 14px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(formatCurrency(total), 100, 100);
    ctx.font = '10px Inter';
    ctx.fillStyle = '#666666';
    ctx.fillText('Total Sales', 100, 115);

    // Update legend
    const legend = document.getElementById('categoryLegend');
    if (legend) {
        legend.innerHTML = categories.slice(0, 4).map(([cat, val], i) => `
            <div class="legend-item">
                <span class="legend-color" style="background: ${colors[i % colors.length]}"></span>
                <span class="legend-label">${cat}</span>
                <span class="legend-value">${Math.round((val / total) * 100)}%</span>
            </div>
        `).join('');
    }
}

function renderTopProductsChart() {
    const canvas = document.getElementById('topProductsChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = 200;

    // Get top products by revenue
    const productSales = {};
    appData.orders.filter(o => o.status === 'Paid').forEach(order => {
        order.items.forEach(item => {
            if (!productSales[item.name]) {
                productSales[item.name] = 0;
            }
            productSales[item.name] += item.price * item.qty;
        });
    });

    const topProducts = Object.entries(productSales)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    if (topProducts.length === 0) {
        ctx.fillStyle = '#666666';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('No sales data yet', canvas.width / 2, canvas.height / 2);
        return;
    }

    const maxValue = Math.max(...topProducts.map(([, v]) => v), 1);
    const barHeight = 30;
    const gap = 10;
    const startY = 20;
    const maxBarWidth = canvas.width - 150;

    topProducts.forEach(([name, value], i) => {
        const y = startY + i * (barHeight + gap);
        const barWidth = (value / maxValue) * maxBarWidth;

        // Draw bar
        ctx.fillStyle = '#1B5E37';
        ctx.beginPath();
        ctx.roundRect(120, y, barWidth, barHeight, 4);
        ctx.fill();

        // Draw product name
        ctx.fillStyle = '#1A1A1A';
        ctx.font = '11px Inter';
        ctx.textAlign = 'right';
        const shortName = name.length > 15 ? name.substring(0, 15) + '...' : name;
        ctx.fillText(shortName, 110, y + barHeight / 2 + 4);

        // Draw value
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'left';
        if (barWidth > 60) {
            ctx.fillText(formatCurrency(value), 130, y + barHeight / 2 + 4);
        } else {
            ctx.fillStyle = '#1A1A1A';
            ctx.fillText(formatCurrency(value), 125 + barWidth + 5, y + barHeight / 2 + 4);
        }
    });
}

// ============================================
// INVENTORY
// ============================================

function loadInventory(searchTerm = '') {
    const table = document.getElementById('inventoryTable');
    let products = [...appData.products];

    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        products = products.filter(p =>
            p.name.toLowerCase().includes(term) ||
            p.category.toLowerCase().includes(term)
        );
    }

    table.innerHTML = products.map(product => {
        const status = getStockStatus(product.stock, product.lowStockAlert);
        return `
            <tr>
                <td><strong>${product.name}</strong></td>
                <td>${product.category}</td>
                <td>${product.stock}</td>
                <td>${formatCurrency(product.price)}</td>
                <td><span class="badge ${status.class}">${status.text}</span></td>
                <td>
                    <button class="btn-icon" onclick="editProduct(${product.id})" title="Edit">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </button>
                    <button class="btn-icon danger" onclick="deleteProduct(${product.id})" title="Delete">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function editProduct(id) {
    const product = appData.products.find(p => p.id === id);
    if (!product) return;

    document.getElementById('productModalTitle').textContent = 'Edit Product';
    document.getElementById('productSubmitBtn').textContent = 'Update Product';
    document.getElementById('editProductId').value = id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productLowStockAlert').value = product.lowStockAlert !== null && product.lowStockAlert !== undefined ? product.lowStockAlert : '';

    openModal('addProductModal');
}

function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    appData.products = appData.products.filter(p => p.id !== id);
    saveData();
    loadInventory();
    showNotification('Product deleted successfully!', 'success');
}

// ============================================
// SALES / ORDERS
// ============================================

function loadSales(searchTerm = '') {
    const table = document.getElementById('ordersTable');
    let orders = [...appData.orders].sort((a, b) => new Date(b.date) - new Date(a.date));

    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        orders = orders.filter(o =>
            o.id.toLowerCase().includes(term) ||
            o.customerName.toLowerCase().includes(term)
        );
    }

    table.innerHTML = orders.map(order => `
        <tr>
            <td><strong>${order.id}</strong></td>
            <td>${order.customerName}</td>
            <td>${formatDate(order.date)}</td>
            <td>${formatCurrency(order.total)}</td>
            <td><span class="badge ${order.status === 'Paid' ? 'success' : order.status === 'Pending' ? 'warning' : 'danger'}">${order.status}</span></td>
            <td>
                <button class="btn-icon" onclick="viewOrder('${order.id}')" title="View Details">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/></svg>
                </button>
            </td>
        </tr>
    `).join('');
}

function viewOrder(orderId) {
    const order = appData.orders.find(o => o.id === orderId);
    if (!order) return;

    const content = document.getElementById('orderDetailsContent');
    const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const taxRate = appData.settings?.taxRate ?? 12;
    const tax = subtotal * (taxRate / 100);

    content.innerHTML = `
        <div class="order-detail-grid">
            <div class="detail-item">
                <span class="detail-label">Order ID</span>
                <span class="detail-value">${order.id}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Customer</span>
                <span class="detail-value">${order.customerName}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Date</span>
                <span class="detail-value">${formatDate(order.date)}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Status</span>
                <span class="detail-value"><span class="badge ${order.status === 'Paid' ? 'success' : order.status === 'Pending' ? 'warning' : 'danger'}">${order.status}</span></span>
            </div>
        </div>
        <div class="order-items-section">
            <h4>Order Items</h4>
            <table class="table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    ${order.items.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.qty}</td>
                            <td>${formatCurrency(item.price)}</td>
                            <td>${formatCurrency(item.price * item.qty)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <div class="order-summary">
                <div class="summary-row">
                    <span>Subtotal</span>
                    <span>${formatCurrency(subtotal)}</span>
                </div>
                <div class="summary-row">
                    <span>Tax (${taxRate}%)</span>
                    <span>${formatCurrency(tax)}</span>
                </div>
                <div class="summary-row total">
                    <span>Total</span>
                    <span>${formatCurrency(order.total)}</span>
                </div>
            </div>
        </div>
    `;

    openModal('orderDetailsModal');
}

// ============================================
// CUSTOMERS
// ============================================

function loadCustomers(searchTerm = '') {
    const table = document.getElementById('customersTable');
    let customers = [...appData.customers];

    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        customers = customers.filter(c =>
            c.name.toLowerCase().includes(term) ||
            c.email.toLowerCase().includes(term) ||
            c.phone.includes(term)
        );
    }

    table.innerHTML = customers.map(customer => `
        <tr>
            <td><strong>${customer.name}</strong></td>
            <td>${customer.email}</td>
            <td>${customer.phone}</td>
            <td>${customer.totalOrders}</td>
            <td>${customer.lastOrderDate ? formatDate(customer.lastOrderDate) : 'Never'}</td>
            <td>
                <button class="btn-icon" onclick="editCustomer(${customer.id})" title="Edit">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
                <button class="btn-icon danger" onclick="deleteCustomer(${customer.id})" title="Delete">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
            </td>
        </tr>
    `).join('');
}

function editCustomer(id) {
    const customer = appData.customers.find(c => c.id === id);
    if (!customer) return;

    document.getElementById('customerModalTitle').textContent = 'Edit Customer';
    document.getElementById('customerSubmitBtn').textContent = 'Update Customer';
    document.getElementById('editCustomerId').value = id;
    document.getElementById('customerName').value = customer.name;
    document.getElementById('customerEmail').value = customer.email;
    document.getElementById('customerPhone').value = customer.phone;

    openModal('addCustomerModal');
}

function deleteCustomer(id) {
    if (!confirm('Are you sure you want to delete this customer?')) return;

    appData.customers = appData.customers.filter(c => c.id !== id);
    saveData();
    loadCustomers();
    showNotification('Customer deleted successfully!', 'success');
}

// ============================================
// REPORTS
// ============================================

function loadReports() {
    // Top products
    const productSales = {};
    appData.orders.filter(o => o.status === 'Paid').forEach(order => {
        order.items.forEach(item => {
            if (!productSales[item.name]) {
                productSales[item.name] = { qty: 0, revenue: 0 };
            }
            productSales[item.name].qty += item.qty;
            productSales[item.name].revenue += item.price * item.qty;
        });
    });

    const topProducts = Object.entries(productSales)
        .sort((a, b) => b[1].revenue - a[1].revenue)
        .slice(0, 5);

    document.getElementById('topProductsList').innerHTML = topProducts.length > 0
        ? topProducts.map(([name, data]) => `
            <div class="top-item">
                <span class="top-item-name">${name}</span>
                <span class="top-item-value">${formatCurrency(data.revenue)}</span>
            </div>
        `).join('')
        : '<p style="color: var(--text-secondary);">No sales data yet</p>';

    // Top customers
    const customerSpending = {};
    appData.orders.filter(o => o.status === 'Paid').forEach(order => {
        if (!customerSpending[order.customerName]) {
            customerSpending[order.customerName] = 0;
        }
        customerSpending[order.customerName] += order.total;
    });

    const topCustomers = Object.entries(customerSpending)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    document.getElementById('topCustomersList').innerHTML = topCustomers.length > 0
        ? topCustomers.map(([name, total]) => `
            <div class="top-item">
                <span class="top-item-name">${name}</span>
                <span class="top-item-value">${formatCurrency(total)}</span>
            </div>
        `).join('')
        : '<p style="color: var(--text-secondary);">No customer data yet</p>';

    // Monthly sales chart
    renderMonthlySalesChart();
}

function renderMonthlySalesChart() {
    const canvas = document.getElementById('reportsRevenueChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = 250;

    // Get sales by month
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const salesByMonth = new Array(12).fill(0);

    appData.orders.filter(o => o.status === 'Paid').forEach(order => {
        const month = new Date(order.date).getMonth();
        salesByMonth[month] += order.total;
    });

    const maxValue = Math.max(...salesByMonth, 1);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    const barWidth = chartWidth / 12 * 0.6;

    months.forEach((month, i) => {
        const value = salesByMonth[i];
        const barHeight = (value / maxValue) * chartHeight;
        const x = padding + i * (chartWidth / 12) + (chartWidth / 12 - barWidth) / 2;
        const y = canvas.height - padding - barHeight;

        ctx.fillStyle = value > 0 ? '#1B5E37' : '#E0E0E0';
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight || 2, 4);
        ctx.fill();

        ctx.fillStyle = '#666666';
        ctx.font = '11px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(month, x + barWidth / 2, canvas.height - 10);
    });
}

// ============================================
// SETTINGS
// ============================================

function loadSettings() {
    document.getElementById('businessName').value = appData.settings.businessName || '';
    document.getElementById('currency').value = appData.settings.currency || 'PHP';
    document.getElementById('taxRate').value = appData.settings.taxRate ?? 12;
    document.getElementById('markupRate').value = appData.settings.markupRate ?? 30;
    document.getElementById('lowStockThreshold').value = appData.settings.lowStockThreshold ?? 10;
    document.getElementById('dailyGoal').value = appData.settings.dailyGoal ?? 15000;
    document.getElementById('contactEmail').value = appData.settings.contactEmail || '';

    // Settings form
    const form = document.getElementById('settingsForm');
    form.onsubmit = function(e) {
        e.preventDefault();
        appData.settings.businessName = document.getElementById('businessName').value;
        appData.settings.currency = document.getElementById('currency').value;
        appData.settings.currencySymbol = { PHP: '₱', USD: '$', EUR: '€' }[appData.settings.currency] || '₱';
        const taxVal = parseFloat(document.getElementById('taxRate').value);
        appData.settings.taxRate = isNaN(taxVal) ? 12 : taxVal;
        const markupVal = parseFloat(document.getElementById('markupRate').value);
        appData.settings.markupRate = isNaN(markupVal) ? 30 : markupVal;
        const stockVal = parseInt(document.getElementById('lowStockThreshold').value);
        appData.settings.lowStockThreshold = isNaN(stockVal) ? 10 : stockVal;
        const goalVal = parseFloat(document.getElementById('dailyGoal').value);
        appData.settings.dailyGoal = isNaN(goalVal) ? 15000 : goalVal;
        appData.settings.contactEmail = document.getElementById('contactEmail').value;
        saveData();
        showNotification('Settings saved successfully!', 'success');
    };

    // Download App button - try PWA install first, fallback to landing page
    const settingsDownloadBtn = document.getElementById('settingsDownloadBtn');
    if (settingsDownloadBtn) {
        settingsDownloadBtn.onclick = async function() {
            if (deferredPrompt) {
                // PWA install available - trigger it
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                if (outcome === 'accepted') {
                    deferredPrompt = null;
                }
            } else {
                // Show landing page with install instructions
                document.getElementById('mainApp').style.display = 'none';
                document.getElementById('landingPage').style.display = 'flex';
            }
        };
    }
}

function exportData() {
    const dataStr = JSON.stringify(appData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ava-erp-backup-' + new Date().toISOString().split('T')[0] + '.json';
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Data exported successfully!', 'success');
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const imported = JSON.parse(e.target.result);
            if (imported.products && imported.orders && imported.customers) {
                appData = imported;
                saveData();
                showNotification('Data imported successfully!', 'success');
                loadDashboard();
            } else {
                showNotification('Invalid data format!', 'error');
            }
        } catch (err) {
            showNotification('Error reading file!', 'error');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

function clearAllData() {
    if (!confirm('Are you sure you want to clear ALL data? This cannot be undone!')) return;
    if (!confirm('This will delete all products, orders, and customers. Continue?')) return;

    appData = JSON.parse(JSON.stringify(defaultData));
    saveData();
    showNotification('All data has been cleared!', 'success');
    loadDashboard();
}

// ============================================
// POS (Point of Sale)
// ============================================

function loadPOS() {
    renderPOSProducts();
    updatePOSCustomers();
    renderPOSCart();
    updatePOSTotals();

    // Search
    const searchInput = document.getElementById('posProductSearch');
    const categoryFilter = document.getElementById('posCategoryFilter');

    searchInput.oninput = () => renderPOSProducts(searchInput.value, categoryFilter.value);
    categoryFilter.onchange = () => renderPOSProducts(searchInput.value, categoryFilter.value);

    // Clear cart
    document.getElementById('posClearCartBtn').onclick = () => {
        posCart = [];
        renderPOSCart();
        updatePOSTotals();
    };

    // Checkout
    document.getElementById('posCheckoutBtn').onclick = completePOSSale;

    // Update tax rate display
    document.getElementById('posTaxRate').textContent = appData.settings?.taxRate ?? 12;
}

function renderPOSProducts(searchTerm = '', category = '') {
    const grid = document.getElementById('posProductsGrid');
    let products = appData.products.filter(p => p.stock > 0);

    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        products = products.filter(p => p.name.toLowerCase().includes(term));
    }

    if (category) {
        products = products.filter(p => p.category === category);
    }

    grid.innerHTML = products.map(product => {
        const stockClass = product.stock < (appData.settings?.lowStockThreshold ?? 10) ? 'low' : '';
        return `
            <div class="pos-product-card" onclick="addToCart(${product.id})">
                <div class="pos-product-name">${product.name}</div>
                <div class="pos-product-price">${formatCurrency(product.price)}</div>
                <div class="pos-product-stock ${stockClass}">${product.stock} in stock</div>
            </div>
        `;
    }).join('');

    if (products.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 40px;">No products found</p>';
    }
}

function updatePOSCustomers() {
    const select = document.getElementById('posCustomer');
    select.innerHTML = '<option value="">Walk-in Customer</option>' +
        appData.customers.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
}

function addToCart(productId) {
    const product = appData.products.find(p => p.id === productId);
    if (!product || product.stock <= 0) return;

    const existing = posCart.find(item => item.productId === productId);
    if (existing) {
        if (existing.qty < product.stock) {
            existing.qty++;
        } else {
            showNotification('Maximum stock reached!', 'warning');
            return;
        }
    } else {
        posCart.push({
            productId: product.id,
            name: product.name,
            price: product.price,
            qty: 1,
            maxStock: product.stock
        });
    }

    renderPOSCart();
    updatePOSTotals();
}

function renderPOSCart() {
    const container = document.getElementById('posCartItems');

    if (posCart.length === 0) {
        container.innerHTML = `
            <div class="pos-cart-empty">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" stroke="currentColor" stroke-width="2"/>
                    <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" stroke="currentColor" stroke-width="2"/>
                    <path d="M1 1H5L7.68 14.39C7.77 14.83 8.02 15.22 8.38 15.5C8.74 15.78 9.19 15.92 9.64 15.9H19.36C19.81 15.92 20.26 15.78 20.62 15.5C20.98 15.22 21.23 14.83 21.32 14.39L23 6H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <p>Cart is empty</p>
                <span>Click products to add them</span>
            </div>
        `;
        return;
    }

    container.innerHTML = posCart.map((item, index) => `
        <div class="pos-cart-item">
            <div class="pos-cart-item-info">
                <div class="pos-cart-item-name">${item.name}</div>
                <div class="pos-cart-item-price">${formatCurrency(item.price)}</div>
            </div>
            <div class="pos-cart-item-qty">
                <button class="pos-qty-btn" onclick="updateCartQty(${index}, -1)">−</button>
                <span>${item.qty}</span>
                <button class="pos-qty-btn" onclick="updateCartQty(${index}, 1)">+</button>
            </div>
            <div class="pos-cart-item-total">${formatCurrency(item.price * item.qty)}</div>
            <button class="pos-cart-item-remove" onclick="removeFromCart(${index})">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </button>
        </div>
    `).join('');
}

function updateCartQty(index, delta) {
    const item = posCart[index];
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
        posCart.splice(index, 1);
    } else if (item.qty > item.maxStock) {
        item.qty = item.maxStock;
        showNotification('Maximum stock reached!', 'warning');
    }

    renderPOSCart();
    updatePOSTotals();
}

function removeFromCart(index) {
    posCart.splice(index, 1);
    renderPOSCart();
    updatePOSTotals();
}

function updatePOSTotals() {
    const subtotal = posCart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const taxRate = appData.settings?.taxRate ?? 12;
    const tax = subtotal * (taxRate / 100);
    const total = subtotal + tax;

    document.getElementById('posSubtotal').textContent = formatCurrency(subtotal);
    document.getElementById('posTax').textContent = formatCurrency(tax);
    document.getElementById('posTotal').textContent = formatCurrency(total);
    document.getElementById('posCheckoutBtn').disabled = posCart.length === 0;
}

function showCheckoutModal() {
    if (posCart.length === 0) return;

    const modal = document.getElementById('checkoutModal');
    const itemsList = document.getElementById('checkoutItemsList');

    // Render cart items
    itemsList.innerHTML = posCart.map(item => `
        <div class="checkout-item">
            <span class="checkout-item-name">${item.name}</span>
            <span class="checkout-item-qty">x${item.qty}</span>
            <span class="checkout-item-price">${formatCurrency(item.price * item.qty)}</span>
        </div>
    `).join('');

    // Set default values from settings
    const markupRate = appData.settings?.markupRate ?? 30;
    const taxRate = appData.settings?.taxRate ?? 12;

    document.getElementById('checkoutMarkup').value = markupRate;
    document.getElementById('checkoutTaxRate').value = taxRate;
    document.getElementById('checkoutDiscount').value = 0;

    // Populate customer dropdown
    const customerSelect = document.getElementById('checkoutCustomer');
    const currentCustomerId = document.getElementById('posCustomer').value;
    customerSelect.innerHTML = '<option value="">Walk-in Customer</option>' +
        appData.customers.map(c => `<option value="${c.id}" ${c.id == currentCustomerId ? 'selected' : ''}>${c.name}</option>`).join('');

    // Calculate and display totals
    updateCheckoutTotals();

    // Add event listeners for real-time calculation
    document.getElementById('checkoutMarkup').oninput = updateCheckoutTotals;
    document.getElementById('checkoutTaxRate').oninput = updateCheckoutTotals;
    document.getElementById('checkoutDiscount').oninput = updateCheckoutTotals;

    // Show modal
    modal.classList.add('active');

    // Set up confirm button
    document.getElementById('confirmCheckoutBtn').onclick = confirmCheckout;
}

function updateCheckoutTotals() {
    const subtotal = posCart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const markupRate = parseFloat(document.getElementById('checkoutMarkup').value) || 0;
    const taxRate = parseFloat(document.getElementById('checkoutTaxRate').value) || 0;
    const discount = parseFloat(document.getElementById('checkoutDiscount').value) || 0;

    const markupAmount = subtotal * (markupRate / 100);
    const sellingPrice = subtotal + markupAmount;
    const taxAmount = sellingPrice * (taxRate / 100);
    const grandTotal = sellingPrice + taxAmount - discount;

    document.getElementById('checkoutSubtotal').textContent = formatCurrency(subtotal);
    document.getElementById('checkoutMarkupAmount').textContent = '+' + formatCurrency(markupAmount);
    document.getElementById('checkoutSellingPrice').textContent = formatCurrency(sellingPrice);
    document.getElementById('checkoutTaxAmount').textContent = '+' + formatCurrency(taxAmount);
    document.getElementById('checkoutDiscountDisplay').textContent = '-' + formatCurrency(discount);
    document.getElementById('checkoutGrandTotal').textContent = formatCurrency(grandTotal);
}

function confirmCheckout() {
    const customerId = document.getElementById('checkoutCustomer').value;
    const customer = customerId ? appData.customers.find(c => c.id === parseInt(customerId)) : null;
    const paymentMethod = document.getElementById('checkoutPaymentMethod').value;
    const notes = document.getElementById('checkoutNotes').value;

    const subtotal = posCart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const markupRate = parseFloat(document.getElementById('checkoutMarkup').value) || 0;
    const taxRate = parseFloat(document.getElementById('checkoutTaxRate').value) || 0;
    const discount = parseFloat(document.getElementById('checkoutDiscount').value) || 0;

    const markupAmount = subtotal * (markupRate / 100);
    const sellingPrice = subtotal + markupAmount;
    const taxAmount = sellingPrice * (taxRate / 100);
    const grandTotal = sellingPrice + taxAmount - discount;

    // Create order
    const order = {
        id: generateOrderId(),
        customerId: customer ? customer.id : null,
        customerName: customer ? customer.name : 'Walk-in Customer',
        date: new Date().toISOString().split('T')[0],
        subtotal: subtotal,
        markup: markupRate,
        markupAmount: markupAmount,
        taxRate: taxRate,
        taxAmount: taxAmount,
        discount: discount,
        total: grandTotal,
        paymentMethod: paymentMethod,
        notes: notes,
        status: 'Paid',
        items: posCart.map(item => ({
            productId: item.productId,
            name: item.name,
            qty: item.qty,
            price: item.price
        }))
    };

    appData.orders.push(order);

    // Update product stock
    posCart.forEach(item => {
        const product = appData.products.find(p => p.id === item.productId);
        if (product) {
            product.stock -= item.qty;
        }
    });

    // Update customer
    if (customer) {
        customer.totalOrders++;
        customer.lastOrderDate = order.date;
    }

    saveData();
    posCart = [];

    // Close modal
    document.getElementById('checkoutModal').classList.remove('active');

    // Reset form
    document.getElementById('checkoutNotes').value = '';

    renderPOSCart();
    updatePOSTotals();
    renderPOSProducts();
    showNotification(`Sale completed! Order ${order.id} - ${formatCurrency(grandTotal)}`, 'success');
}

// Keep old function name for compatibility but redirect to modal
function completePOSSale() {
    showCheckoutModal();
}

// ============================================
// MODALS
// ============================================

function initModals() {
    // Close buttons
    document.querySelectorAll('.modal-close, [data-modal]').forEach(btn => {
        btn.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            if (modalId) closeModal(modalId);
        });
    });

    // Click outside to close
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) closeModal(this.id);
        });
    });

    // Add Product button
    document.getElementById('addProductBtn').addEventListener('click', () => {
        document.getElementById('productModalTitle').textContent = 'Add New Product';
        document.getElementById('productSubmitBtn').textContent = 'Add Product';
        document.getElementById('addProductForm').reset();
        document.getElementById('editProductId').value = '';
        openModal('addProductModal');
    });

    // Add Customer button
    document.getElementById('addCustomerBtn').addEventListener('click', () => {
        document.getElementById('customerModalTitle').textContent = 'Add New Customer';
        document.getElementById('customerSubmitBtn').textContent = 'Add Customer';
        document.getElementById('addCustomerForm').reset();
        document.getElementById('editCustomerId').value = '';
        openModal('addCustomerModal');
    });

    // Product form
    document.getElementById('addProductForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const editId = document.getElementById('editProductId').value;

        const lowStockVal = document.getElementById('productLowStockAlert').value;
        const productData = {
            name: document.getElementById('productName').value.trim(),
            category: document.getElementById('productCategory').value,
            stock: parseInt(document.getElementById('productStock').value) || 0,
            price: parseFloat(document.getElementById('productPrice').value) || 0,
            lowStockAlert: lowStockVal !== '' ? parseInt(lowStockVal) : null
        };

        if (editId) {
            const product = appData.products.find(p => p.id === parseInt(editId));
            if (product) {
                Object.assign(product, productData);
                showNotification('Product updated successfully!', 'success');
            }
        } else {
            productData.id = Date.now();
            appData.products.push(productData);
            showNotification('Product added successfully!', 'success');
        }

        saveData();
        closeModal('addProductModal');
        loadInventory();
    });

    // Customer form
    document.getElementById('addCustomerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const editId = document.getElementById('editCustomerId').value;

        const customerData = {
            name: document.getElementById('customerName').value.trim(),
            email: document.getElementById('customerEmail').value.trim(),
            phone: document.getElementById('customerPhone').value.trim()
        };

        if (editId) {
            const customer = appData.customers.find(c => c.id === parseInt(editId));
            if (customer) {
                Object.assign(customer, customerData);
                showNotification('Customer updated successfully!', 'success');
            }
        } else {
            customerData.id = Date.now();
            customerData.totalOrders = 0;
            customerData.lastOrderDate = null;
            appData.customers.push(customerData);
            showNotification('Customer added successfully!', 'success');
        }

        saveData();
        closeModal('addCustomerModal');
        loadCustomers();
    });
}

function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// ============================================
// SEARCH
// ============================================

function initSearch() {
    document.getElementById('productSearch').addEventListener('input', function() {
        loadInventory(this.value);
    });

    document.getElementById('orderSearch').addEventListener('input', function() {
        loadSales(this.value);
    });

    document.getElementById('customerSearch').addEventListener('input', function() {
        loadCustomers(this.value);
    });
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    loadData();
    initAuth();
});
