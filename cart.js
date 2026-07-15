let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartUI();
    alert(`${product.name} به سبد اضافه شد!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const totalPrice = document.getElementById('total-price');
    
    // Update count
    cartCount.textContent = cart.length;
    
    // Update items
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">سبد خرید شما خالی است</div>';
        totalPrice.textContent = '0';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.icon} ${item.name}</div>
                <div class="cart-item-price">${item.price.toLocaleString('fa-IR')} تومان</div>
            </div>
            <button class="btn-remove" onclick="removeFromCart(${item.id})">حذف</button>
        </div>
    `).join('');
    
    // Update total
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    totalPrice.textContent = total.toLocaleString('fa-IR');
}

// Initialize UI
updateCartUI();