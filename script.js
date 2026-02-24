// --- DATA & STATE ---
const PRODUCTS = [
    { id: 1, name: "Premium Maida (Flour)", price: 45, unit: "kg", moq: 50, category: "flour" },
    { id: 2, name: "Sunflower Oil Tin", price: 1650, unit: "tin", moq: 2, category: "oil" },
    { id: 3, name: "Red Onions", price: 34, unit: "kg", moq: 25, category: "vegetable" }
];

const priceTrends = [
    { id: 1, lastPrice: 50 },
    { id: 2, lastPrice: 1600 },
    { id: 3, lastPrice: 30 }
];

let cart = [];
let previousOrders = [];
let pendingBargains = []; 
let appState = { 
    isLoggedIn: false, 
    role: 'vendor', 
    userName: '', 
    phone: '' 
};
let groupOrders = {};
let currentBargainProduct = null;

// NEW STATE
let myFriends = [];
let pendingRequests = [];
const MOCK_USERS = ["Rahul123", "Priya_Store", "Kirana_King", "Fresh_Mart", "Amit_Wholesale"];

function showGroupHub() {
    hideAllPages();
    document.getElementById('group-hub-page').classList.remove('hidden');
    renderFriends();
}

function searchFriend() {
    const query = document.getElementById('friend-search-input').value.trim();
    const resultDiv = document.getElementById('search-result');
    
    if (MOCK_USERS.includes(query)) {
        resultDiv.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; background:#f0f0f0; padding:10px; border-radius:5px;">
                <span>👤 ${query}</span>
                <button class="btn-primary" style="width:auto; padding:5px 15px;" onclick="sendFriendRequest('${query}')">Add Friend</button>
            </div>`;
    } else {
        resultDiv.innerHTML = `<p style="color:red;">User not found. Try: Rahul123</p>`;
    }
}

function sendFriendRequest(name) {
    alert(`Friend request sent to ${name}!`);
    // Simulating instant acceptance for demo purposes
    setTimeout(() => {
        if (!myFriends.includes(name)) {
            myFriends.push(name);
            renderFriends();
            updateGroupStatus();
        }
    }, 1000);
}

function renderFriends() {
    const list = document.getElementById('friend-list');
    if (myFriends.length === 0) {
        list.innerHTML = `<li style="color:#888;">No friends added yet.</li>`;
        return;
    }
    list.innerHTML = myFriends.map(f => `
        <li style="padding:10px 0; border-bottom:1px solid #eee;">✅ ${f}</li>
    `).join('');
}

function updateGroupStatus() {
    const count = myFriends.length + 1; // +1 for the current user
    document.getElementById('group-count').innerText = `Members: ${count}/5`;
    document.getElementById('group-progress').value = count;
    
    if (count >= 5) {
        document.getElementById('group-benefit').style.display = 'block';
    }
}

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
    document.getElementById('profile-page').classList.add('hidden');
    document.getElementById('previous-orders-page').classList.add('hidden');
    document.getElementById('tracking-page').classList.add('hidden');
    document.getElementById('auth-container').classList.add('hidden');
    document.getElementById('seller-dashboard').classList.add('hidden');
    document.getElementById('landing-page').classList.remove('hidden');
    if (appState.role === 'supplier') {
        if (document.querySelector('.cart-btn')) document.querySelector('.cart-btn').style.display = 'none';
        const cc = document.getElementById('cart-count');
        if (cc) cc.parentElement.style.display = 'none';
    } else {
        // Ensure cart is visible for Vendors
        if (document.querySelector('.cart-btn')) document.querySelector('.cart-btn').style.display = 'block';
        const cc = document.getElementById('cart-count');
        if (cc) cc.parentElement.style.display = 'block';
    }
}
// ---------------- AUTH & OTP ----------------
function showLogin() {
    document.getElementById('auth-container').classList.remove('hidden');
    document.getElementById('login-page').classList.remove('hidden');
    document.getElementById('landing-page').classList.add('hidden'); // Ensure marketplace is hidden
    document.getElementById('seller-dashboard').classList.add('hidden'); // Ensure dashboard is hidden
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

    const name = document.getElementById("reg-name").value.trim();
    const business = document.getElementById("reg-biz").value.trim();
    const address = document.getElementById("reg-addr").value.trim();

    if (!name || !business || !address) {
        alert("Please fill all details");
        return;
    }

    // 🔥 SAVE INTO appState
    appState.userName = name;
    appState.business = business;
    appState.address = address;
    localStorage.setItem("userData", JSON.stringify(appState));

    alert("Registration Successful. Please login.");
    document.getElementById('register-page').classList.add('hidden'); // Hide registration
    document.getElementById('login-page').classList.remove('hidden'); // Show login card

}

// NEW: OTP Functions
function sendOTP() {
    const name = document.getElementById('login-name').value.trim();
    const phone = document.getElementById('login-phone').value.trim();

    if (!name || phone.length < 10) {
        return alert("Please enter your name and 10-digit phone number");
    }

    appState.userName = name;
    appState.phone = phone;

    document.getElementById('login-initial-action').classList.add('hidden');
    document.getElementById('otp-section').classList.remove('hidden');
    alert("Demo OTP sent to " + phone + ". Use code: 1234");
}

function verifyOTP() {
    const otp = document.getElementById('otp-input').value;
    if (otp === "1234") {
        login();
    } else {
        alert("Invalid OTP. Hint: 1234");
    }
}

function login() {
    appState.isLoggedIn = true;

    document.getElementById('auth-container').classList.add('hidden');
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('landing-page').classList.remove('hidden');
    document.getElementById('auth-nav-btn').classList.add('hidden');
    document.getElementById('profile-wrapper').classList.remove('hidden');
    const displayName =  appState.userName;
const firstLetter = displayName.charAt(0).toUpperCase();

document.getElementById('profile-display-name').innerText = appState.userName;
    document.getElementById('profile-icon').innerText = firstLetter;
    document.getElementById('profile-letter').innerText = firstLetter;

    document.getElementById('profile-display-phone').innerText = appState.phone || "";
    document.getElementById('menu-btn').classList.remove('hidden');
    

    setupSidebar();
    renderProducts();
    renderTrendSection();

if (appState.role === "supplier") {
        // --- ADD THESE TWO LINES HERE ---
        if (document.querySelector('.cart-btn')) document.querySelector('.cart-btn').style.display = 'none';
        if (document.getElementById('cart-count')) document.getElementById('cart-count').parentElement.style.display = 'none';
        
        // --- YOUR EXISTING LOGIC ---
        document.getElementById('landing-page').classList.add('hidden'); 
        showSellerDashboard(); 
    } else {
        // --- YOUR EXISTING LOGIC ---
        document.getElementById('landing-page').classList.remove('hidden'); 
        document.getElementById('seller-dashboard').classList.add('hidden');
        document.getElementById('hero-section').innerHTML = 
            `<h1>Welcome back, ${appState.userName}!</h1>
             <p>Start your bulk procurement today with Direct Bargaining.</p>`;
    }
}
function saveProfileChanges() {

    const newName = document.getElementById("profile-edit-name").value;
    const newPhone = document.getElementById("profile-edit-phone").value;
    const newBusiness = document.getElementById("profile-edit-business").value;
    const newAddress = document.getElementById("profile-edit-address").value;

    // Update appState directly
    appState.userName = newName;
    appState.phone = newPhone;
    appState.business = newBusiness;
    appState.address = newAddress;

    // Update dropdown display
    const displayName = appState.business || appState.userName;
    document.getElementById('profile-display-name').innerText = newName;
    document.getElementById('profile-display-phone').innerText = newPhone;

    const firstLetter = newName.charAt(0).toUpperCase();
    document.getElementById('profile-icon').innerText = firstLetter;
    document.getElementById('profile-letter').innerText = firstLetter;
    localStorage.setItem("userData", JSON.stringify(appState));

document.getElementById('hero-section').innerHTML =
    `<h1>Welcome back, ${displayName}!</h1>
     <p>Start your bulk procurement today with Direct Bargaining.</p>`;

    alert("Profile Updated Successfully!");
}
function openProfilePage() {
    hideAllPages();
    document.getElementById("landing-page").classList.add("hidden");
    document.getElementById("previous-orders-page").classList.add("hidden");
    document.getElementById("tracking-page")?.classList.add("hidden");
    document.getElementById("seller-dashboard").classList.add("hidden");

    document.getElementById("profile-page").classList.remove("hidden");

    document.getElementById("profile-edit-name").value = appState.userName || "";
    document.getElementById("profile-edit-phone").value = appState.phone || "";
    document.getElementById("profile-edit-business").value = appState.business || "";
    document.getElementById("profile-edit-address").value = appState.address || "";
}

function openOrdersPage() {

    // Hide everything
    document.getElementById("landing-page").classList.add("hidden");
    document.getElementById("profile-page").classList.add("hidden");
    document.getElementById("tracking-page")?.classList.add("hidden");
    document.getElementById("seller-dashboard").classList.add("hidden");

    // Show orders page
    document.getElementById("previous-orders-page").classList.remove("hidden");

    toggleProfileMenu();
}

function logout() {
    localStorage.removeItem("userData");
    location.reload();
}

// ---------------- SIDEBAR ----------------

function setupSidebar() {
    const sidebarContent = document.getElementById('sidebar-content');
    if (appState.role === 'supplier') {
        sidebarContent.innerHTML = `
            <a href="#" onclick="goHome(); toggleSidebar();">🏪 Marketplace</a>
            <a href="#" onclick="showSalesOverview(); toggleSidebar();">📈 Sales Overview</a>
            <a href="#" onclick="showManageInventory(); toggleSidebar();">📦 Manage Inventory</a>
            <a href="#" onclick="showSellerDashboard(); toggleSidebar();">🤝 Bargain Requests</a>
            <a href="#" onclick="showPastCustomers(); toggleSidebar();">👥 Past Customers</a>
            <hr style="border:0; border-top:1px solid #444; margin:10px 0;">
            <a href="#" onclick="showAbout(); toggleSidebar();">ℹ️ About Us</a>
        `;
    } else {
        sidebarContent.innerHTML = `
            <a href="#" onclick="goHome()">🏠 Home</a>
            <a href="#" onclick="showPreviousOrders()">📦 My Orders</a>
            <a href="#" onclick="showTrackingPage()">📍 Track Orders</a>
            <a href="#" onclick="showGroupHub(); toggleSidebar();">👥 Group Hub (Add Friends)
            <a href="#" onclick="showAbout(); toggleSidebar();">ℹ️ About Us</a>
        `;
    }
}

// ---------------- PRODUCTS & FILTERING ----------------

// 1. The "Manager" - Logic & Filtering
function renderProducts(filter = "") {
    const grid = document.getElementById('product-list');
    if (!grid) return; 
    grid.innerHTML = ""; 
    PRODUCTS
        .filter(p => p.name.toLowerCase().includes(filter.toLowerCase()))
        .forEach(renderProductCard); // Calls the builder below
}

// 2. The "Builder" - HTML & Role-based UI
function renderProductCard(p) {
    const grid = document.getElementById("product-list");
    
    // Check if the user is a supplier to hide buying features
    const isSupplier = (appState.role === 'supplier');

    grid.innerHTML += `
        <div class="prod-card">
            <span class="moq-tag">MOQ: ${p.moq} ${p.unit}</span>
            <h3>${p.name}</h3>
            <p class="price">₹${p.price} / ${p.unit}</p>

            ${isSupplier ? `
                <div class="view-only-tag" style="background:#f9f9f9; color:#777; padding:10px; text-align:center; border-radius:5px; margin:10px 0; font-size:0.8rem; border:1px solid #ddd;">
                    👁️ Supplier View (No Purchasing)
                </div>
            ` : `
                <div class="add-cart-row">
                    <button class="qty-btn" onclick="changeQty(${p.id}, -1)">−</button>
                    <button class="btn-primary add-btn" onclick="addToCart(${p.id})">
                        Add (<span id="qty-${p.id}">${p.moq}</span>)
                    </button>
                    <button class="qty-btn" onclick="changeQty(${p.id}, 1)">+</button>
                </div>
                <button class="group-btn" style="background:#444;" onclick="openBargain(${p.id})">🤝 Bargain Price</button>
                <button class="group-btn" onclick="createGroupOrder(${p.id})">Create Group Order</button>
                <button class="group-btn join-btn hidden" id="join-btn-${p.id}" onclick="joinGroupOrder(${p.id})">Join Group Order</button>
                <p id="group-status-${p.id}" class="group-status hidden">Current Group: 0 ${p.unit}</p>
            `}
        </div>
    `;
}

function filterCategory(category) {
    if (category === "all") {
        renderProducts();
        return;
    }
    const grid = document.getElementById("product-list");
    grid.innerHTML = "";
    PRODUCTS.filter(p => p.category === category).forEach(renderProductCard);
}

function filterProducts() {
    const val = document.getElementById('landing-search').value;
    renderProducts(val);
}

function renderProductCard(p) {
    const grid = document.getElementById("product-list");
    grid.innerHTML += `
        <div class="prod-card">
            <span class="moq-tag">MOQ: ${p.moq} ${p.unit}</span>
            <h3>${p.name}</h3>
            <p class="price">₹${p.price} / ${p.unit}</p>

            <div class="add-cart-row">
                <button class="qty-btn" onclick="changeQty(${p.id}, -1)">−</button>
                <button class="btn-primary add-btn" onclick="addToCart(${p.id})">
                    Add (<span id="qty-${p.id}">${p.moq}</span>)
                </button>
                <button class="qty-btn" onclick="changeQty(${p.id}, 1)">+</button>
            </div>

            <button class="group-btn" style="background:#444;" onclick="openBargain(${p.id})">🤝 Bargain Price</button>
            <button class="group-btn" onclick="createGroupOrder(${p.id})">Create Group Order</button>
            <button class="group-btn join-btn hidden" id="join-btn-${p.id}" onclick="joinGroupOrder(${p.id})">Join Group Order</button>
            <p id="group-status-${p.id}" class="group-status hidden">Current Group: 0 ${p.unit}</p>
        </div>
    `;
}

// ---------------- BARGAINING (NEW) ----------------

function openBargain(pid) {
    if (!appState.isLoggedIn) {
        alert("Please login to bargain with suppliers.");
        showLogin();
        return;
    }
    currentBargainProduct = PRODUCTS.find(p => p.id === pid);
    document.getElementById('bargain-prod-name').innerText = currentBargainProduct.name;
    document.getElementById('current-price-display').innerText = "₹" + currentBargainProduct.price + " / " + currentBargainProduct.unit;
    document.getElementById('bargain-modal').classList.remove('hidden');
}

function closeBargain() {
    document.getElementById('bargain-modal').classList.add('hidden');
}

function submitBargain() {
    const offer = document.getElementById('offer-price').value;
    const qty = document.getElementById('offer-qty').value;
    
    if (!offer || !qty) return alert("Please enter your offer price and quantity.");

    pendingBargains.push({
        vendor: appState.userName,
        product: currentBargainProduct.name,
        original: currentBargainProduct.price,
        offer: offer,
        qty: qty
    });

    alert("Your offer of ₹" + offer + " has been sent to the supplier!");
    closeBargain();
}

// ---------------- GROUP ORDER ----------------

function createGroupOrder(pid) {
    const product = PRODUCTS.find(p => p.id === pid);
    groupOrders[pid] = product.moq;
    document.getElementById(`join-btn-${pid}`).classList.remove("hidden");
    const status = document.getElementById(`group-status-${pid}`);
    status.classList.remove("hidden");
    status.innerText = "Current Group: " + groupOrders[pid] + " " + product.unit;
    alert("Group Order Created 🎉");
}

function joinGroupOrder(pid) {
    const product = PRODUCTS.find(p => p.id === pid);
    if (!groupOrders[pid]) return;
    groupOrders[pid] += product.moq;
    document.getElementById(`group-status-${pid}`).innerText = "Current Group: " + groupOrders[pid] + " " + product.unit;
    if (groupOrders[pid] >= product.moq * 3) {
        alert("🎉 MOQ Achieved! Group Order Ready!");
    }
}

// ---------------- CART & QUANTITY ----------------

function changeQty(pid, direction) {
    const product = PRODUCTS.find(p => p.id === pid);
    const qtyEl = document.getElementById(`qty-${pid}`);
    let qty = parseInt(qtyEl.innerText);
    if (direction === 1) qty += product.moq;
    else if (qty > product.moq) qty -= product.moq;
    qtyEl.innerText = qty;
}

function addToCart(pid) {
    const product = PRODUCTS.find(p => p.id === pid);
    const selectedQty = parseInt(document.getElementById(`qty-${pid}`).innerText);
    const existing = cart.find(x => x.id === pid);
    if (existing) existing.qty += selectedQty;
    else cart.push({ ...product, qty: selectedQty });
    updateCartUI();
}

function updateCartUI() {
    document.getElementById('cart-count').innerText = cart.length;
    const container = document.getElementById('cart-items');
    const totalFooter = document.getElementById('cart-total-footer');

    if (cart.length === 0) {
        container.innerHTML = `<p style="padding:20px; text-align:center;">Empty</p>`;
        if(totalFooter) totalFooter.innerText = "";
        return;
    }

    let total = 0;
    container.innerHTML = cart.map((item, index) => {
        total += item.qty * item.price;
        return `
            <div class="cart-item">
                <div><b>${item.name}</b><br><small>${item.qty} ${item.unit}</small></div>
                <div>₹${item.qty * item.price} <span onclick="removeFromCart(${index})" style="cursor:pointer;color:red;">❌</span></div>
            </div>`;
    }).join('');
    if(totalFooter) totalFooter.innerText = "Total: ₹" + total;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

// ---------------- ORDER FLOW (CHECKOUT FIX) ----------------

function placeOrder() {
    if (!appState.isLoggedIn) {
        alert("Please Login to Place Order");
        showLogin();
        return;
    }
    // Block Suppliers from purchasing
    if (appState.role === 'supplier') {
        alert("Suppliers cannot place orders. Please use a Vendor account.");
        return;
    }
    if (cart.length === 0) {
        alert("Cart is empty");
        return;
    }
    showLoanOptions();
}

function showLoanOptions() {
    let originalTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    
    // 🔥 NEW: Group Discount Logic
    // Current user (1) + My Friends list
    const memberCount = (myFriends ? myFriends.length : 0) + 1; 
    const hasGroupDiscount = memberCount >= 5;
    const finalTotal = hasGroupDiscount ? (originalTotal * 0.9) : originalTotal;

    let popup = document.getElementById("loan-popup-dynamic");
    if(!popup){
        popup = document.createElement("div");
        popup.id = "loan-popup-dynamic";
        popup.className = "loan-popup";
        document.body.appendChild(popup);
    }

    popup.classList.remove('hidden');
    popup.innerHTML = `
        <div class="loan-box">
            <h3>Choose Payment Option</h3>
            
            ${hasGroupDiscount ? `
                <p style="color:#27ae60; font-weight:bold; margin-bottom:5px;">
                    🎉 Group Discount Applied (5+ Members)
                </p>
                <p>Original: <del>₹${originalTotal}</del></p>
                <p>Total Amount: <strong style="font-size:1.4rem;">₹${finalTotal.toFixed(2)}</strong></p>
            ` : `
                <p>Total Amount: <strong>₹${originalTotal}</strong></p>
                <p style="font-size:0.8rem; color:#666;">
                    Tip: Add ${5 - memberCount} more friends to unlock 10% discount!
                </p>
            `}

            <button class="btn-primary" onclick="payFull(${finalTotal})">Pay Full</button>
            <button class="btn-primary" style="background:#f39c12; margin-top:10px;" onclick="payLater(${finalTotal})">7-Day Microloan</button>
            <button class="btn-primary" style="background:#ccc; color:#333; margin-top:10px;" onclick="closeLoanPopup()">Cancel</button>
        </div>
    `;
}

function payFull(total) { 
    showSuccessPopup("Payment Successful!", `₹${total.toFixed(2)} has been paid successfully. Your order is now being processed.`);
    finalizeOrder("Paid");
}
function payLater(total) { 
    showSuccessPopup("Microloan Approved!", `₹${total.toFixed(2)} has been credited to your account. Your payment is due in 7 days.`);
    finalizeOrder("Credit");
}
function showSuccessPopup(title, message) {
    // Create the overlay background
    const overlay = document.createElement("div");
    overlay.className = "custom-popup-overlay";
    
    // Create the message box
    overlay.innerHTML = `
        <div class="custom-popup-box">
            <div class="success-icon">✅</div>
            <h2>${title}</h2>
            <p>${message}</p>
            <button class="btn-primary" onclick="this.parentElement.parentElement.remove()">Great!</button>
        </div>
    `;
    
    document.body.appendChild(overlay);

    // Automatically remove after 4 seconds if they don't click the button
    setTimeout(() => {
        if (overlay.parentNode) overlay.remove();
    }, 4000);
}
function finalizeOrder(paymentStatus) {
    // Re-calculate the actual total including the group discount
    let total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const memberCount = (myFriends ? myFriends.length : 0) + 1; 
    
    // Apply 10% discount if 5+ members
    const finalTotal = memberCount >= 5 ? (total * 0.9) : total;

    const order = {
        id: "ORD" + Math.floor(Math.random() * 100000),
        customerName: appState.userName,
        items: [...cart],
        total: finalTotal.toFixed(2), // Save the discounted amount
        status: "Processing",
        payment: paymentStatus,
        date: new Date().toLocaleDateString()
    };

    previousOrders.push(order);
    cart = [];
    updateCartUI();
    closeLoanPopup();

    if(document.getElementById('cart-sidebar').classList.contains('cart-hidden') === false) toggleCart(); 
    
    // Custom Pop-up is already triggered by payFull/payLater, so we just switch pages
    showPreviousOrders();
}

function closeLoanPopup() {
    const popup = document.getElementById("loan-popup-dynamic");
    if (popup) popup.classList.add('hidden');
}

// ---------------- PAGES & DASHBOARDS ----------------

function showPreviousOrders() {
    goHome();
    document.getElementById('landing-page').classList.add('hidden');
    document.getElementById('previous-orders-page').classList.remove('hidden');

    const container = document.getElementById('previous-orders-list');
    container.innerHTML = previousOrders.length ? previousOrders.map(o => `
        <div class="prod-card">
            <h3>Order ID: ${o.id}</h3>
            <p><strong>Customer:</strong> ${o.customerName || "Me"}</p>
            <p><strong>Status:</strong> ${o.status}</p>
            <p><strong>Payment:</strong> ${o.payment}</p>
            <p><strong>Total:</strong> ₹${o.total}</p>
        </div>`).join('') : "<p>No orders found.</p>";
}

function showTrackingPage() {
    goHome();
    // Hide all other sections
    document.getElementById('landing-page').classList.add('hidden');
    document.getElementById('profile-page').classList.add('hidden');
    document.getElementById('previous-orders-page').classList.add('hidden');
    document.getElementById('seller-dashboard').classList.add('hidden');
    
    // Show tracking page
    document.getElementById('tracking-page').classList.remove('hidden');

    const container = document.getElementById('tracking-list');
    container.innerHTML = previousOrders.length ? previousOrders.map(o => `
        <div class="prod-card">
            <h3>Order ID: ${o.id}</h3>
            <p>Status: 🚚 ${o.status}</p>
            <div style="background: #eee; border-radius: 10px; height: 10px; width: 100%; margin: 10px 0;">
                <div style="background: #27ae60; width: 50%; height: 100%; border-radius: 10px;"></div>
            </div>
            <p><small>Estimated Delivery: 2 Days</small></p>
        </div>`).join('') : "<p style='padding:20px; text-align:center;'>No active orders to track.</p>";
}

function showSellerDashboard() {
    // This now acts as the "Bargain Requests" page
    const dash = document.getElementById('seller-dashboard');
    dash.classList.remove('hidden');
    document.getElementById('landing-page').classList.add('hidden');

    let rows = pendingBargains.map((b, i) => `
        <tr>
            <td>${b.vendor}</td>
            <td>${b.product}</td>
            <td>₹${b.offer}</td>
            <td>${b.qty}</td>
            <td><button onclick="pendingBargains.splice(${i},1); showSellerDashboard();" style="color:green; cursor:pointer;">Accept</button></td>
        </tr>`).join('');

    dash.innerHTML = `
        <div class="container">
            <h2>🤝 Bargain Requests</h2>
            <div class="trend-section">
                <table class="seller-table">
                    <thead><tr><th>Vendor</th><th>Product</th><th>Offer</th><th>Qty</th><th>Action</th></tr></thead>
                    <tbody>${rows || '<tr><td colspan="5">No active requests</td></tr>'}</tbody>
                </table>
            </div>
        </div>`;
}

// NEW FUNCTION: PAST CUSTOMERS
function showPastCustomers() {
    hideAllPages();
    const dash = document.getElementById('seller-dashboard');
    dash.classList.remove('hidden');

    // Filter unique customer names from all orders
    const customers = [...new Set(previousOrders.map(order => order.customerName || "Regular Vendor"))];

    dash.innerHTML = `
        <div class="container">
            <h2>👥 Past Customers List</h2>
            <div class="trend-section" style="padding:20px;">
                <table class="seller-table">
                    <thead>
                        <tr>
                            <th>Customer Name</th>
                            <th>Total Orders</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${customers.length > 0 ? customers.map(name => `
                            <tr>
                                <td><strong>${name}</strong></td>
                                <td>${previousOrders.filter(o => (o.customerName || "Regular Vendor") === name).length}</td>
                                <td>
                                    <button class="btn-primary" style="padding:5px 10px; width:auto;" onclick="alert('Messaging ${name}...')">💬 Message</button>
                                </td>
                            </tr>
                        `).join('') : '<tr><td colspan="3">No past customers found yet.</td></tr>'}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// Logic for Manage Inventory
function processAddProduct() {
    const name = document.getElementById('add-name').value;
    const price = document.getElementById('add-price').value;
    const qty = document.getElementById('add-qty').value;
    const img = document.getElementById('add-img').value;

    if (!name || !price || !qty) return alert("Please fill Name, Price, and Quantity!");

    const newProduct = {
        id: Date.now(),
        name: name,
        price: parseFloat(price),
        unit: "units",
        moq: parseInt(qty),
        image: img || "https://via.placeholder.com/150",
        category: "general"
    };

    PRODUCTS.push(newProduct);
    alert("Product added successfully!");
    showManageInventory();
    renderProducts();
}

function updateProduct(index, field, value) {
    PRODUCTS[index][field] = parseFloat(value);
    renderProducts(); // Update marketplace
    alert("Updated successfully!");
}

function deleteProduct(index) {
    if(confirm("Remove this product?")) {
        PRODUCTS.splice(index, 1);
        showManageInventory();
        renderProducts();
    }
}

function showAbout() {
    // Hide all other sections first
    hideAllPages();
    
    // Show the about page
    document.getElementById('about-page').classList.remove('hidden');
}

function hideAllPages() {
    const pages = [
        'landing-page', 
        'seller-dashboard', 
        'previous-orders-page', 
        'tracking-page', 
        'profile-page', 
        'auth-container',
        'about-page',
        'group-hub-page'
    ];
    
    pages.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });
}

window.onload = () => {
    const savedUser = localStorage.getItem("userData");

    if (savedUser) {
        appState = JSON.parse(savedUser);

        if (appState.isLoggedIn) {
            // --- USER IS LOGGED IN ---
            document.getElementById('profile-wrapper').classList.remove('hidden');
            document.getElementById('auth-nav-btn').classList.add('hidden');
            document.getElementById('menu-btn').classList.remove('hidden');
            document.getElementById('auth-container').classList.add('hidden'); // Hide Login UI

            const displayName = appState.userName;
            const firstLetter = displayName.charAt(0).toUpperCase();

            document.getElementById('profile-display-name').innerText = displayName;
            document.getElementById('profile-display-phone').innerText = appState.phone || "";
            document.getElementById('profile-icon').innerText = firstLetter;
            document.getElementById('profile-letter').innerText = firstLetter;
            
            setupSidebar();

            if (appState.role === "supplier") {
                // SUPPLIER VIEW: Hide marketplace, show dashboard
                document.getElementById('landing-page').classList.add('hidden');
                showSellerDashboard();
            } else {
                // VENDOR VIEW: Show marketplace, show welcome message
                document.getElementById('landing-page').classList.remove('hidden');
                document.getElementById('hero-section').innerHTML =
                    `<h1>Welcome back, ${displayName}!</h1>
                     <p>Start your bulk procurement today with Direct Bargaining.</p>`;
            }
        } else {
            // User data exists but isLoggedIn is false
            showLogin();
        }
    } else {
        // --- NO USER DATA: SHOW LOGIN FIRST ---
        showLogin();
    }

    renderTrendSection();
    renderProducts();
};

function renderTrendSection() {
    const trendList = document.getElementById("trend-list");
    if(!trendList) return;
    trendList.innerHTML = priceTrends.map(t => {
        const product = PRODUCTS.find(p => p.id === t.id);
        if(!product) return '';
        const diff = product.price - t.lastPrice;
        const dir = diff >= 0 ? "up" : "down";
        return `
            <div class="trend-card">
                <h4>${product.name}</h4>
                <p><span class="${dir}">${dir === "up" ? "⬆" : "⬇"} ₹${Math.abs(diff)}</span></p>
                <small>${((diff / t.lastPrice) * 100).toFixed(1)}% change</small>
            </div>`;
    }).join('');
}

function showSalesOverview() {
    hideAllPages();
    const dash = document.getElementById('seller-dashboard');
    dash.classList.remove('hidden');
    document.getElementById('landing-page').classList.add('hidden');

    dash.innerHTML = `
        <div class="container">
            <h2>📊 Sales & Stock Overview</h2>
            <div class="trend-section">
                <h3>Current Inventory Status</h3>
                <table class="seller-table">
                    <thead>
                        <tr><th>Product</th><th>Original Stock</th><th>Current Stock</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                        ${PRODUCTS.map(p => {
                            const stockStatus = p.moq < 10 ? '<span style="color:red">Low Stock</span>' : '<span style="color:green">Healthy</span>';
                            return `<tr>
                                <td>${p.name}</td>
                                <td>100 ${p.unit}</td> <td>${p.moq} ${p.unit}</td>
                                <td>${stockStatus}</td>
                            </tr>`;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function showManageInventory() {
    hideAllPages(); 
    const dash = document.getElementById('seller-dashboard');
    dash.classList.remove('hidden'); 
    
    dash.innerHTML = `
        <div class="container">
            <h2>📦 Manage Inventory</h2>
            
            <div class="trend-section" style="padding:20px; margin-bottom:20px;">
                <h3>Add New Product</h3>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                    <input type="text" id="add-name" class="input-field" placeholder="Product Name">
                    <input type="number" id="add-price" class="input-field" placeholder="Price (₹)">
                    <input type="number" id="add-qty" class="input-field" placeholder="Stock Quantity">
                    <input type="text" id="add-img" class="input-field" placeholder="Image URL">
                </div>
                <button class="btn-primary" onclick="processAddProduct()" style="margin-top:10px;">➕ Add Product</button>
            </div>

            <div class="trend-section">
                <h3>Existing Inventory</h3>
                <table class="seller-table">
                    <thead>
                        <tr><th>Product</th><th>Price (₹)</th><th>Qty</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        ${PRODUCTS.map((p, i) => `
                            <tr>
                                <td>${p.name}</td>
                                <td><input type="number" value="${p.price}" onchange="updateProduct(${i}, 'price', this.value)" style="width:60px;"></td>
                                <td><input type="number" value="${p.moq}" onchange="updateProduct(${i}, 'moq', this.value)" style="width:60px;"></td>
                                <td>
                                    <button onclick="deleteProduct(${i})" style="color:red; background:none; border:none; cursor:pointer;">🗑️ Remove</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}
