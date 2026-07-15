let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let users = JSON.parse(localStorage.getItem('users')) || [];
let isAdmin = JSON.parse(localStorage.getItem('isAdmin')) || false;

function showAuthModal() {
    document.getElementById('authModal').classList.add('show');
}

function closeAuthModal() {
    document.getElementById('authModal').classList.remove('show');
}

function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName + 'Form').classList.add('active');
    event.target.classList.add('active');
}

function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.toggle('hidden');
}

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    const password = this.querySelector('input[type="password"]').value;
    
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        localStorage.setItem('isAdmin', JSON.stringify(user.isAdmin || false));
        isAdmin = user.isAdmin || false;
        closeAuthModal();
        updateUI();
        showNotification('خوش آمدید ' + user.fullName, 'success');
    } else {
        showNotification('ایمیل یا رمز عبور اشتباه است', 'error');
    }
});

document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const fullName = this.querySelector('input[type="text"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const phone = this.querySelectorAll('input[type="tel"]')[0].value;
    const password = this.querySelectorAll('input[type="password"]')[0].value;
    const passwordConfirm = this.querySelectorAll('input[type="password"]')[1].value;
    
    if (password !== passwordConfirm) {
        showNotification('رمز عبور‌ها مطابقت ندارند', 'error');
        return;
    }
    
    if (users.find(u => u.email === email)) {
        showNotification('این ایمیل قبلاً ثبت شده است', 'error');
        return;
    }
    
    const newUser = {
        id: Date.now(),
        fullName,
        email,
        phone,
        password,
        createdAt: new Date(),
        isAdmin: false,
        purchases: [],
        totalSpent: 0
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    closeAuthModal();
    updateUI();
    showNotification('حساب شما با موفقیت ایجاد شد', 'success');
});

function logout() {
    currentUser = null;
    isAdmin = false;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAdmin');
    updateUI();
    showNotification('از حساب خود خارج شدید', 'info');
}

function updateUI() {
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userDropdown = document.getElementById('userDropdown');
    const heroBtn = document.getElementById('heroBtn');
    
    if (currentUser) {
        userMenuBtn.textContent = '👤 ' + currentUser.fullName;
        userDropdown.classList.add('hidden');
        heroBtn.textContent = 'برو به محصولات';
        if (isAdmin) {
            document.querySelector('.user-dropdown a:nth-child(5)').style.display = 'block';
        }
    } else {
        userMenuBtn.textContent = '👤 کاربر';
        heroBtn.textContent = 'شروع کنید';
    }
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#2ed573' : type === 'error' ? '#ff4757' : '#ffa502'};
        color: white;
        border-radius: 5px;
        z-index: 2000;
        animation: slideDown 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

updateUI();
