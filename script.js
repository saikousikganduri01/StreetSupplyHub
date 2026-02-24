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
function goHome() {
    document.getElementById('previous-orders-page').classList.add('hidden');
    document.getElementById('tracking-page').classList.add('hidden');
    document.getElementById('auth-container').classList.add('hidden');
    document.getElementById('seller-dashboard').classList.add('hidden');
    document.getElementById('landing-page').classList.remove('hidden');
}

// ---------------- AUTH & OTP ----------------

function showLogin() {
    document.getElementById('landing-page').classList.add('hidden');
    document.getElementById('auth-container').classList.remove('hidden');
    document.getElementById('login-page').classList.remove('hidden');
    document.getElementById('register-page').classList.add('hidden');
}

function showRegister() {
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('register-page').classList.remove('hidden');
}

function selectRole(role) {
    appState.role = role;
    document.querySelectorAll('.role-block').forEach(b => b.classList.remove('active-role'));
    document.getElementById('block-' + role).classList.add('active-role');
    document.getElementById('registration-form').classList.remove('hidden');
    
    if(role === 'supplier') {
        document.getElementById('supplier-product-section').classList.remove('hidden');
    } else {
        document.getElementById('supplier-product-section').classList.add('hidden');
    }
}

function finalizeRegistration() {
    alert("Registration Received. Please login.");
    showLogin();
}
