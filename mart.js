let cart = [];

const whatsappNumber = "923148368158"; 

function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    sidebar.classList.toggle('open');
}

function filterCategory(category) {
    const buttons = document.querySelectorAll('.cat-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    if(window.event) {
        window.event.target.classList.add('active');
    }

    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name: name, price: price, quantity: 1 });
    }
    
    updateCartUI();
}

function updateCartUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    const formBlock = document.getElementById('checkout-form-block');
    
    let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.innerText = totalItems;
    
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-msg">Your cart is empty.</p>';
        cartTotal.innerText = '0';
        formBlock.style.display = 'none'; // Hide form if empty
        return;
    }
    formBlock.style.display = 'block';
    
    let totalPrice = 0;
    
    cart.forEach((item, index) => {
        let itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
            <div>
                <h4>${item.name}</h4>
                <small style="color: #7f8c8d;">Rs. ${item.price.toLocaleString()} x ${item.quantity}</small>
            </div>
            <div style="text-align: right;">
                <strong style="color: #2c3e50; font-size: 0.95rem;">Rs. ${itemTotal.toLocaleString()}</strong>
                <br>
                <span style="color:#e74c3c; cursor:pointer; font-size:0.8rem; font-weight:600; text-transform:uppercase; margin-top:4px; display:inline-block;" onclick="removeItem(${index})">Remove 🗑️</span>
            </div>
        `;
        cartItemsContainer.appendChild(itemElement);
    });
    
    cartTotal.innerText = totalPrice.toLocaleString();
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function sendOrderWhatsApp() {
    if (cart.length === 0) {
        alert("Your cart is empty! Please add products before checking out.");
        return;
    }

    const name = document.getElementById('cust-name').value.trim();
    const phone = document.getElementById('cust-phone').value.trim();
    const address = document.getElementById('cust-address').value.trim();
    const payment = document.getElementById('cust-payment').value;

    if (!name || !phone || !address) {
        alert("Please fill in all the required delivery fields to process your order.");
        return;
    }

    let message = "*📦 NEW ORDER RECEIVED - J MART*\n";
    message += "=============================\n\n";
    
    message += "*👤 CUSTOMER PROFILE:*\n";
    message += `• Name: ${name}\n`;
    message += `• Contact Phone: ${phone}\n\n`;
    
    message += "*📍 DELIVERY DETAILS:*\n";
    message += `• Address: ${address}\n\n`;
    
    message += "*💳 PAYMENT CONFIGURATION:*\n";
    message += `• Method Selected: ${payment}\n\n`;
    
    message += "=============================\n";
    message += "*🛒 ORDERED INVENTORY ITEMS:*\n";
    
    cart.forEach((item, i) => {
        message += `${i + 1}. ${item.name}\n   Qty: ${item.quantity} x Rs. ${item.price.toLocaleString()} = *Rs. ${(item.price * item.quantity).toLocaleString()}*\n`;
    });
    
    message += "-----------------------------\n";
    message += `*📊 TOTAL BILL AMOUNT: Rs. ${document.getElementById('cart-total').innerText}*\n`;
    message += "=============================\n\n";
    message += "_Please verify this digital manifest sheet to confirm shipment dispatch tracking details._";

    const encodedMessage = encodeURIComponent(message);

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');

    cart = [];
    document.getElementById('cust-name').value = '';
    document.getElementById('cust-phone').value = '';
    document.getElementById('cust-address').value = '';
    updateCartUI();
    toggleCart();
}