function goToAdmin() {
    if (!currentUser || !isAdmin) {
        showNotification('شما دسترسی ادمین ندارید', 'error');
        return;
    }
    goToSection('admin');
    updateAdminDashboard();
}

function switchAdminTab(tabName) {
    document.querySelectorAll('.admin-tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById('admin-' + tabName).classList.add('active');
    event.target.classList.add('active');
    
    if (tabName === 'coupons') updateCouponsList();
    if (tabName === 'users') updateUsersList();
    if (tabName === 'orders') updateOrdersList();
}

function updateAdminDashboard() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
    const today = new Date().toDateString();
    const todaySales = orders
        .filter(o => new Date(o.date).toDateString() === today)
        .reduce((sum, order) => sum + order.amount, 0);
    
    document.getElementById('totalRevenue').textContent = totalRevenue.toLocaleString('fa-IR') + ' تومان';
    document.getElementById('totalOrders').textContent = orders.length;
    document.getElementById('totalUsers').textContent = users.length;
    document.getElementById('todaySales').textContent = todaySales.toLocaleString('fa-IR') + ' تومان';
}

function createCoupon() {
    const code = document.getElementById('couponCode').value;
    const discount = parseInt(document.getElementById('discountPercent').value);
    const usageLimit = parseInt(document.getElementById('usageLimit').value);
    
    if (!code || !discount) {
        showNotification('لطفاً تمام فیلدها را پر کنید', 'error');
        return;
    }
    
    const coupon = {
        id: Date.now(),
        code: code.toUpperCase(),
        discount,
        usageLimit,
        used: 0,
        createdAt: new Date()
    };
    
    let coupons = JSON.parse(localStorage.getItem('coupons')) || [];
    coupons.push(coupon);
    localStorage.setItem('coupons', JSON.stringify(coupons));
    
    document.getElementById('couponCode').value = '';
    document.getElementById('discountPercent').value = '';
    document.getElementById('usageLimit').value = '';
    
    updateCouponsList();
    showNotification('کوپن با موفقیت ایجاد شد', 'success');
}

function updateCouponsList() {
    const coupons = JSON.parse(localStorage.getItem('coupons')) || [];
    const table = document.getElementById('couponsTable');
    
    if (coupons.length === 0) {
        table.innerHTML = '<p>هنوز کوپنی ایجاد نشده است</p>';
        return;
    }
    
    table.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>کد</th>
                    <th>تخفیف</th>
                    <th>حد استفاده</th>
                    <th>استفاده شده</th>
                    <th>عملیات</th>
                </tr>
            </thead>
            <tbody>
                ${coupons.map(coupon => `
                    <tr>
                        <td>${coupon.code}</td>
                        <td>${coupon.discount}%</td>
                        <td>${coupon.usageLimit === 0 ? 'نامحدود' : coupon.usageLimit}</td>
                        <td>${coupon.used}</td>
                        <td><button onclick="deleteCoupon(${coupon.id})" class="btn-small">حذف</button></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function deleteCoupon(id) {
    let coupons = JSON.parse(localStorage.getItem('coupons')) || [];
    coupons = coupons.filter(c => c.id !== id);
    localStorage.setItem('coupons', JSON.stringify(coupons));
    updateCouponsList();
    showNotification('کوپن حذف شد', 'info');
}

function updateUsersList() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const list = document.getElementById('usersList');
    
    if (users.length === 0) {
        list.innerHTML = '<p>هنوز کاربری ثبت نشده است</p>';
        return;
    }
    
    list.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>نام</th>
                    <th>ایمیل</th>
                    <th>تاریخ عضویت</th>
                    <th>کل خریدها</th>
                </tr>
            </thead>
            <tbody>
                ${users.map(user => `
                    <tr>
                        <td>${user.fullName}</td>
                        <td>${user.email}</td>
                        <td>${new Date(user.createdAt).toLocaleDateString('fa-IR')}</td>
                        <td>${user.purchases ? user.purchases.length : 0}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function updateOrdersList() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const list = document.getElementById('ordersList');
    
    if (orders.length === 0) {
        list.innerHTML = '<p>هنوز سفارشی ثبت نشده است</p>';
        return;
    }
    
    list.innerHTML = `
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
                ${orders.map(order => `
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
