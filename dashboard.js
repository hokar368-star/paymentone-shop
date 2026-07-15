function goToDashboard() {
    if (!currentUser) {
        showAuthModal();
        return;
    }
    goToSection('dashboard');
    updateDashboard();
}

function updateDashboard() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const userOrders = orders.filter(o => o.userId === currentUser.id);
    
    document.getElementById('totalPurchases').textContent = userOrders.length;
    document.getElementById('totalSpent').textContent = (currentUser.totalSpent || 0).toLocaleString('fa-IR');
    document.getElementById('activeAccounts').textContent = currentUser.purchases ? currentUser.purchases.length : 0;
    
    // Recent orders
    const recentOrders = document.getElementById('recentOrders');
    if (userOrders.length > 0) {
        recentOrders.innerHTML = userOrders.slice(-3).reverse().map(order => `
            <div style="padding: 0.5rem; border-bottom: 1px solid #ccc;">
                <strong>${order.id}</strong> - ${order.amount.toLocaleString('fa-IR')} تومان
            </div>
        `).join('');
    } else {
        recentOrders.innerHTML = '<p>سفارش جدیدی ثبت نشده است</p>';
    }
}

function goToInvoices() {
    if (!currentUser) {
        showAuthModal();
        return;
    }
    goToSection('invoices');
    updateInvoices();
}

function updateInvoices() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const userOrders = orders.filter(o => o.userId === currentUser.id);
    
    const invoicesTable = document.getElementById('invoicesTable');
    if (userOrders.length === 0) {
        invoicesTable.innerHTML = '<p>صورت‌حساب‌ی برای نمایش وجود ندارد</p>';
        return;
    }
    
    invoicesTable.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>شماره سفارش</th>
                    <th>مبلغ</th>
                    <th>درگاه</th>
                    <th>وضعیت</th>
                    <th>تاریخ</th>
                </tr>
            </thead>
            <tbody>
                ${userOrders.map(order => `
                    <tr>
                        <td>${order.id}</td>
                        <td>${order.amount.toLocaleString('fa-IR')} تومان</td>
                        <td>${order.gateway}</td>
                        <td>${order.status === 'completed' ? '✅ تکمیل' : '❌ ناموفق'}</td>
                        <td>${new Date(order.date).toLocaleDateString('fa-IR')}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function goToGiftCards() {
    if (!currentUser) {
        showAuthModal();
        return;
    }
    showNotification('بخش کد‌های هدیه به‌زودی فعال می‌شود', 'info');
}

function goToProfile() {
    if (!currentUser) {
        showAuthModal();
        return;
    }
    goToSection('profile');
    
    document.getElementById('fullName').value = currentUser.fullName;
    document.getElementById('email').value = currentUser.email;
    document.getElementById('phone').value = currentUser.phone;
    
    document.getElementById('profileForm').addEventListener('submit', function(e) {
        e.preventDefault();
        currentUser.fullName = document.getElementById('fullName').value;
        currentUser.email = document.getElementById('email').value;
        currentUser.phone = document.getElementById('phone').value;
        
        const newPassword = document.getElementById('newPassword').value;
        if (newPassword) {
            currentUser.password = newPassword;
        }
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        let users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            localStorage.setItem('users', JSON.stringify(users));
        }
        
        updateUI();
        showNotification('پروفایل شما بروزرسانی شد', 'success');
    });
}
