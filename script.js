let cart = [];
let previousOrders = [];
let pendingBargains = []; // For Supplier Dashboard
let appState = { 
    isLoggedIn: false, 
    role: 'vendor', 
    userName: '', 
    phone: '' 
};
let groupOrders = {};
let currentBargainProduct = null;

// ---------------- NAVIGATION ----------------

function toggleSidebar() {
    document.getElementById('left-sidebar').classList.toggle('sidebar-hidden');
}

function toggleCart() {
    document.getElementById('cart-sidebar').classList.toggle('cart-hidden');
}

function toggleProfileMenu() {
    const dropdown = document.getElementById('profile-dropdown');
    if (dropdown) dropdown.classList.toggle('hidden');
}
