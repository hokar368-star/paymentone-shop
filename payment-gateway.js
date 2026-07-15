let selectedGateway = null;

function goToPayment() {
    if (cart.length === 0) {
        showNotification('سبد خرید شما خالی است', 'error');
        return;
    }
    
    goToSection('payment');
}

function selectGateway(gateway) {
    selectedGateway = gateway;
    document.querySelectorAll('.gateway-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.target.closest('.gateway-card').classList.add('selected');
}

function proceedToPayment() {
    if (!selectedGateway) {
        showNotification('لطفاً یک درگاه پرداخت انتخاب کنید', 'error');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + item.price, 0) - discountAmount;
    
    switch(selectedGateway) {
        case 'test':
            showTestPaymentModal(total);
            break;
        case 'paymentone':
            processPaymentOne(total);
            break;
        case 'zarinpal':
            processZarinpal(total);
            break;
        case 'idpay':
            processIdpay(total);
            break;
    }
}

function showTestPaymentModal(amount) {
    const modal = document.getElementById('testPaymentModal');
    const orderId = 'ORD_' + Date.now();
    document.getElementById('testOrderId').textContent = orderId;
    document.getElementById('testAmount').textContent = amount.toLocaleString('fa-IR');
    modal.classList.add('show');
    
    window.currentOrderId = orderId;
    window.currentOrderAmount = amount;
}

function completeTestPayment(success) {
    if (success) {
        const order = {
            id: window.currentOrderId,
            amount: window.currentOrderAmount,
            items: cart,
            gateway: 'test',
            status: 'completed',
            date: new Date(),
            coupon: appliedCoupon
        };
        
        // Save order
        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Update user
        currentUser.purchases = currentUser.purchases || [];
        currentUser.purchases.push(order);
        currentUser.totalSpent = (currentUser.totalSpent || 0) + window.currentOrderAmount;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Update coupon usage
        if (appliedCoupon) {
            let coupons = JSON.parse(localStorage.getItem('coupons')) || [];
            const coupon = coupons.find(c => c.code === appliedCoupon.code);
            if (coupon) coupon.used += 1;
            localStorage.setItem('coupons', JSON.stringify(coupons));
        }
        
        showNotification('پرداخت با موفقیت انجام شد', 'success');
        clearCart();
        closeTestPayment();
        goToSection('dashboard');
    } else {
        showNotification('پرداخت ناموفق بود', 'error');
        closeTestPayment();
    }
}

function closeTestPayment() {
    document.getElementById('testPaymentModal').classList.remove('show');
}

function processPaymentOne(amount) {
    showNotification('درگاه Payment One فعال‌سازی شد', 'info');
    // Implementation for Payment One gateway
    // This would typically redirect to Payment One's API
}

function processZarinpal(amount) {
    showNotification('درگاه زرین‌پال فعال‌سازی شد', 'info');
    // Implementation for Zarinpal gateway
}

function processIdpay(amount) {
    showNotification('درگاه آی‌دی‌پی فعال‌سازی شد', 'info');
    // Implementation for IDPay gateway
}
