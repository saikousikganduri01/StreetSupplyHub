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
let appState = { isLoggedIn: false, role: 'vendor', userName: '' };
let groupOrders = {};
// NAVIGATION
function toggleSidebar() { document.getElementById('left-sidebar').classList.toggle('sidebar-hidden'); }
function toggleCart() { document.getElementById('cart-sidebar').classList.toggle('cart-hidden'); }
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
}

function showLogin() {
    document.getElementById('landing-page').classList.add('hidden');
    document.getElementById('auth-container').classList.remove('hidden');
    document.getElementById('login-page').classList.remove('hidden');
        document.getElementById('register-page').classList.add('hidden');   // 🔥 add this
    document.getElementById('registration-form').classList.add('hidden');
}


function login() {
    const name = document.getElementById('login-name').value.trim();
    const phone = document.getElementById('login-phone').value.trim();

    if (!name) return alert("Enter Name");

    appState.isLoggedIn = true;
    appState.userName = name;

    // Hide login screen
    document.getElementById('auth-container').classList.add('hidden');
    document.getElementById('login-page').classList.add('hidden');

    // Show landing page
    document.getElementById('landing-page').classList.remove('hidden');

    // Hide Login button
    document.getElementById('auth-nav-btn').classList.add('hidden');

    // 🔥 Show profile icon
    document.getElementById('profile-wrapper').classList.remove('hidden');

    // Set profile letter
    const firstLetter = name.charAt(0).toUpperCase();
    document.getElementById('profile-icon').innerText = firstLetter;
    document.getElementById('profile-letter').innerText = firstLetter;

    document.getElementById('profile-display-name').innerText = name;
    document.getElementById('profile-display-phone').innerText = phone || "";
    document.getElementById('menu-btn').classList.remove('hidden');

    setupSidebar();
    renderProducts();
    renderTrendSection();

    document.getElementById('hero-section').innerHTML =
        `<h1>Welcome back, ${name}!</h1>
         <p>Start your bulk procurement today.</p>`;
}
function showRegister() {
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('register-page').classList.remove('hidden');
    document.getElementById('registration-form').classList.add('hidden');
}

function selectRole(role) {
    appState.role = role;
    document.getElementById('registration-form').classList.remove('hidden');
    document.querySelectorAll('.role-block').forEach(b => b.classList.remove('active-role'));
    document.getElementById('block-' + role).classList.add('active-role');
    
    const supplierSection = document.getElementById('supplier-product-section');
    if(role === 'supplier') supplierSection.classList.remove('hidden');
    else supplierSection.classList.add('hidden');
}

function finalizeRegistration() {
    const name = document.getElementById('reg-name').value.trim();
    const business = document.getElementById('reg-biz').value.trim();
    const addr = document.getElementById('reg-addr').value.trim();
    const aadhaarInput = document.getElementById('reg-aadhaar');

    if (!name || !business || !addr || !aadhaarInput.files.length) {
        alert("Please fill all details and upload Aadhaar");
        return;
    }

    // Simulate saving user
    alert("🎉 Account Created Successfully!\nPlease login to continue.");

    // Clear form fields
    document.getElementById('reg-name').value = "";
    document.getElementById('reg-biz').value = "";
    document.getElementById('reg-addr').value = "";
    document.getElementById('reg-aadhaar').value = "";

    // Reset form visibility
    document.getElementById('registration-form').classList.add('hidden');
    document.getElementById('register-page').classList.add('hidden');

    // Go back to login page
    showLogin();
}
function toggleProfileMenu() {
    document.getElementById('profile-dropdown').classList.toggle('hidden');
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
    document.getElementById('profile-display-name').innerText = newName;
    document.getElementById('profile-display-phone').innerText = newPhone;

    const firstLetter = newName.charAt(0).toUpperCase();
    document.getElementById('profile-icon').innerText = firstLetter;
    document.getElementById('profile-letter').innerText = firstLetter;

    alert("Profile Updated Successfully!");
}
function logout() {
    location.reload();
}


// SIDEBAR CONTENT BASED ON ROLE
function setupSidebar() {
    const sidebar = document.getElementById('sidebar-content');
    if(appState.role === 'vendor') {
        sidebar.innerHTML = `
            <a href="#">📦 Previous Orders</a>
            <a href="#">📍 Tracking Orders</a>
            <a href="#">⭐ Saved Suppliers</a>
            <a href="#">⚙️ Profile Settings</a>
        `;
    } else {
        sidebar.innerHTML = `
            <a href="#">📊 Sales Overview</a>
            <a href="#">📦 Manage Inventory</a>
            <a href="#">👥 Customer List</a>
        `;
    }
}

// SELLER DASHBOARD VIEW
function showSellerDashboard() {
    document.getElementById('landing-page').classList.add('hidden');
    const dash = document.getElementById('seller-dashboard');
    dash.classList.remove('hidden');
    
    dash.innerHTML = `
        <div class="card">
            <h3>📦 Current Stock Inventory</h3>
            <p>Maida: 500kg | Oil: 40 Tins | Onions: 200kg</p>
        </div>
        <h3>🛒 Recent Vendor Purchases</h3>
        <table class="seller-table">
            <thead>
                <tr><th>Vendor Name</th><th>Product</th><th>Qty</th><th>Amount</th></tr>
            </thead>
            <tbody>
                <tr><td>Raju's Snacks</td><td>Premium Maida</td><td>100kg</td><td>₹4,500</td></tr>
                <tr><td>Sai Tiffin Center</td><td>Sunflower Oil</td><td>4 Tins</td><td>₹6,600</td></tr>
            </tbody>
        </table>
    `;
}

// PRODUCT RENDERING
function renderProducts(filter = "") {
    const grid = document.getElementById('product-list');
    grid.innerHTML = "";

    PRODUCTS
        .filter(p => p.name.toLowerCase().includes(filter.toLowerCase()))
        .forEach(p => {

            grid.innerHTML += `
                <div class="prod-card">
                    <span class="moq-tag">MOQ: ${p.moq} ${p.unit}</span>
                    <h3>${p.name}</h3>
                    <p class="price">₹${p.price} / ${p.unit}</p>

                    <div class="add-cart-row">
                        <button class="qty-btn" onclick="changeQty(${p.id}, -1)">−</button>

                        <button class="btn-primary add-btn"
                                onclick="addToCart(${p.id})">
                            Add (${p.moq}) 
                            
                            <span id="qty-${p.id}">${p.moq}</span>
                        </button>

                        <button class="qty-btn" onclick="changeQty(${p.id}, 1)">+</button>
                    </div>
         <button class="group-btn" onclick="createGroupOrder(${p.id})">
    Create Group Order
</button>

<button class="group-btn join-btn hidden" 
        id="join-btn-${p.id}"
        onclick="joinGroupOrder(${p.id})">
    Join Group Order
</button>

<p id="group-status-${p.id}" class="group-status hidden">
    Current Group: 0 ${p.unit}
</p>
                </div>
            `;
        });
}
function createGroupOrder(pid) {
    const product = PRODUCTS.find(p => p.id === pid);

    groupOrders[pid] = product.moq;

    // Show join button
    document.getElementById(`join-btn-${pid}`).classList.remove("hidden");

    // Show status
    const status = document.getElementById(`group-status-${pid}`);
    status.classList.remove("hidden");
    status.innerText = "Current Group: " + groupOrders[pid] + " " + product.unit;

    alert("Group Order Created 🎉");
}
function changeQty(pid, direction) {
    const product = PRODUCTS.find(p => p.id === pid);
    const qtyEl = document.getElementById(`qty-${pid}`);
    let qty = parseInt(qtyEl.innerText);

    if (direction === 1) {
        qty += product.moq;
    } else {
        if (qty > product.moq) {
            qty -= product.moq;
        }
    }

    qtyEl.innerText = qty;
}

function filterProducts() { renderProducts(document.getElementById('landing-search').value); }

function addToCart(pid) {
    const product = PRODUCTS.find(p => p.id === pid);
    const selectedQty = parseInt(document.getElementById(`qty-${pid}`).innerText);

    const existing = cart.find(x => x.id === pid);

    if (existing) {
        existing.qty += selectedQty;
    } else {
        cart.push({ ...product, qty: selectedQty });
    }

    updateCartUI();
}

function updateCartUI() {
    document.getElementById('cart-count').innerText = cart.length;
    const container = document.getElementById('cart-items');

    if(cart.length === 0) {
        container.innerHTML = `<p style="padding:20px; text-align:center;">Empty</p>`;
        return;
    }

    let html = cart.map((item, index) => `
        <div class="cart-item" style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid #eee;">
            
            <div>
                <b>${item.name}</b><br>
                <small>${item.qty} ${item.unit}</small>
            </div>

            <div style="text-align:right;">
                <div>₹${item.qty * item.price}</div>
                <span onclick="removeFromCart(${index})"
                      style="cursor:pointer; color:red; font-size:18px;">
                      ❌
                </span>
            </div>

        </div>
    `).join('');

    container.innerHTML = html;
}
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}
function joinGroupOrder(pid) {
    const product = PRODUCTS.find(p => p.id === pid);

    if (!groupOrders[pid]) {
        alert("No group order exists. Please create one first.");
        return;
    }

    groupOrders[pid] += product.moq;

    document.getElementById(`group-status-${pid}`).innerText =
        "Current Group: " + groupOrders[pid] + " " + product.unit;

    if (groupOrders[pid] >= product.moq * 3) {
        alert("🎉 MOQ Achieved! Group Order Ready to Place!");
    }
}

function placeOrder() {
    if (!appState.isLoggedIn) {
        alert("Please Login to Place Order");
        showLogin();
        return;
    }

    if (cart.length === 0) {
        alert("Cart is empty");
        return;
    }

    showLoanOptions();
}
function showLoanOptions() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    const popup = document.createElement("div");
    popup.id = "loan-popup";
    popup.className = "loan-popup";

    popup.innerHTML = `
        <div class="loan-box">
            <h3>Choose Payment Option</h3>
            <p>Total Amount: ₹${total}</p>

            <button onclick="payFull(${total})">Pay Full</button>
            <button onclick="payHalf(${total})">Pay 50% Now (₹${total/2})</button>
            <button onclick="payLater(${total})">7-Day Microloan</button>

            <br><br>
            <button onclick="closeLoanPopup()">Cancel</button>
        </div>
    `;

    document.body.appendChild(popup);
}
function payFull(total) {
    alert("Payment Successful! ₹" + total + " Paid.");
    finalizeOrder();
}

function payHalf(total) {
    alert("₹" + (total/2) + " Paid Now.\nRemaining Due in 7 Days.");
    finalizeOrder();
}

function payLater(total) {
    alert("Microloan Approved! ₹" + total + " Due in 7 Days.");
    finalizeOrder();
}

function finalizeOrder() {
    cart = [];
    updateCartUI();
    closeLoanPopup();
}
function closeLoanPopup() {
    const popup = document.getElementById("loan-popup");
    if (popup) popup.remove();
}
function filterCategory(category) {
    if (category === "all") {
        renderProducts();
        return;
    }

    const grid = document.getElementById("product-list");
    grid.innerHTML = "";

    PRODUCTS
        .filter(p => p.category === category)
        .forEach(p => {
            grid.innerHTML += `
                <div class="prod-card">
                    <span class="moq-tag">MOQ: ${p.moq} ${p.unit}</span>
                    <h3>${p.name}</h3>
                    <p class="price">₹${p.price} / ${p.unit}</p>

                    <div class="add-cart-row">
                        <button class="qty-btn" onclick="changeQty(${p.id}, -1)">−</button>

                        <button class="btn-primary add-btn"
                                onclick="addToCart(${p.id})">
                            Add (${p.moq}) 
                            <span id="qty-${p.id}">${p.moq}</span>
                        </button>

                        <button class="qty-btn" onclick="changeQty(${p.id}, 1)">+</button>
                    </div>
                </div>
            `;
        });
}
function renderTrendSection() {
    const trendList = document.getElementById("trend-list");
    trendList.innerHTML = "";

    priceTrends.forEach(t => {
        const product = PRODUCTS.find(p => p.id === t.id);
        if (!product) return;

        const diff = product.price - t.lastPrice;
        const percent = ((diff / t.lastPrice) * 100).toFixed(1);
        const direction = diff >= 0 ? "up" : "down";

        trendList.innerHTML += `
            <div class="trend-card">
                <h4>${product.name}</h4>
                <p>
                   <span class="${direction}">
                     ${direction === "up" ? "⬆" : "⬇"} ₹${Math.abs(diff)}
                   </span>
                </p>
                <small>${percent}% ${direction === "up" ? "increase" : "decrease"}</small>
            </div>
        `;
    });
}
// --- CHATBOT LOGIC ---

function toggleChatWindow() {
    const window = document.getElementById('chat-window');
    window.classList.toggle('hidden');
}

function handleChatKey(event) {
    if (event.key === "Enter") sendChatMessage();
}

async function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    // 1. Guard clause: Don't send empty messages
    if (!message) return;

    // 2. Display user message in the chat body
    const chatBody = document.getElementById('chat-body');
    chatBody.innerHTML += `<div class="user-msg">${message}</div>`;
    
    // 3. Clear input and scroll to bottom
    input.value = "";
    chatBody.scrollTop = chatBody.scrollHeight;

    // 4. Create a unique ID for the "Thinking..." bubble
    const thinkingId = "think-" + Date.now();
    chatBody.innerHTML += `<div class="bot-msg" id="${thinkingId}">...</div>`;
    chatBody.scrollTop = chatBody.scrollHeight;

    try {
        // 5. Fetch response from your Python Backend
        const response = await fetch('http://127.0.0.1:5000/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message })
        });
        
        if (!response.ok) throw new Error("Server error");
        
        const data = await response.json();
        
        // 6. Format the reply: Replace **text** with <b>text</b>
        const formattedReply = data.reply.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
        
        // 7. Update the thinking bubble with the actual formatted response
        document.getElementById(thinkingId).innerHTML = formattedReply;

    } catch (error) {
        // Handle connection errors gracefully
        console.error("Chat Error:", error);
        document.getElementById(thinkingId).innerText = "Sorry, I'm having trouble connecting to the market database.";
    }
    
    chatBody.scrollTop = chatBody.scrollHeight;
}
// Initial Call
window.onload = () => {
    renderTrendSection(); 
    renderProducts();
};
