let cart = JSON.parse(localStorage.getItem('cart')) || [];
let appliedCoupon = null;
let discountAmount = 0;

function addToCart(productId) {
    if (!currentUser) {
        showNotification('لطفاً ابتدا وارد حساب خود شوید', 'info');
        showAuthModal();
        return;
    }
    
    const product = getProductById(productId);
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
    showNotification(product.name + ' به سبد اضافه شد', 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
    showNotification('محصول از سبد حذف شد', 'info');
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const totalPrice = document.getElementById('total-price');
    const finalPrice = document.getElementById('final-price');
    
    if (cartCount) cartCount.textContent = cart.length;
    
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">سبد خرید شما خالی است</div>';
        if (totalPrice) totalPrice.textContent = '0';
        if (finalPrice) finalPrice.textContent = '0';
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
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    if (totalPrice) totalPrice.textContent = total.toLocaleString('fa-IR');
    
    const final = total - discountAmount;
    if (finalPrice) finalPrice.textContent = final.toLocaleString('fa-IR');
}

function applyCoupon() {
    const couponCode = document.getElementById('coupon-code').value;
    const coupons = JSON.parse(localStorage.getItem('coupons')) || [];
    const coupon = coupons.find(c => c.code === couponCode && (c.usageLimit === 0 || c.used < c.usageLimit));
    
    if (!coupon) {
        showNotification('کد تخفیف نامعتبر است', 'error');
        return;
    }
    
    appliedCoupon = coupon;
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    discountAmount = Math.floor(total * (coupon.discount / 100));
    
    const discountInfo = document.getElementById('discount-info');
    discountInfo.textContent = `کوپن ${coupon.code}: تخفیف ${coupon.discount}% (${discountAmount.toLocaleString('fa-IR')} تومان)`;
    discountInfo.classList.remove('hidden');
    
    updateCartUI();
    showNotification('کد تخفیف با موفقیت اعمال شد', 'success');
}

function clearCart() {
    cart = [];
    appliedCoupon = null;
    discountAmount = 0;
    saveCart();
    updateCartUI();
}

updateCartUI();
