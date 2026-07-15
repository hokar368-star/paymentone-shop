function goToSection(sectionName) {
    if (!currentUser && sectionName !== 'products') {
        showNotification('لطفاً ابتدا وارد حساب خود شوید', 'info');
        showAuthModal();
        return;
    }
    
    // Hide all sections
    document.querySelectorAll('.products, .cart-section, .payment-section, .dashboard-section, .profile-section, .invoices-section, .admin-section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Show selected section
    const section = document.getElementById(sectionName);
    if (section) {
        section.classList.remove('hidden');
        
        if (sectionName === 'products') {
            renderProducts();
        }
    }
}

// Initialize with admin user for testing
function initAdminUser() {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const adminExists = users.find(u => u.email === 'admin@aishop.ir');
    
    if (!adminExists) {
        const adminUser = {
            id: 1,
            fullName: 'مدیر سیستم',
            email: 'admin@aishop.ir',
            phone: '09000000000',
            password: 'admin123',
            createdAt: new Date(),
            isAdmin: true,
            purchases: [],
            totalSpent: 0
        };
        users.push(adminUser);
        localStorage.setItem('users', JSON.stringify(users));
    }
}

// Initialize default coupons
function initDefaultCoupons() {
    let coupons = JSON.parse(localStorage.getItem('coupons')) || [];
    if (coupons.length === 0) {
        const defaultCoupons = [
            { id: 1, code: 'WELCOME20', discount: 20, usageLimit: 0, used: 0, createdAt: new Date() },
            { id: 2, code: 'SAVE50', discount: 50, usageLimit: 10, used: 0, createdAt: new Date() },
            { id: 3, code: 'SUMMER10', discount: 10, usageLimit: 0, used: 0, createdAt: new Date() }
        ];
        localStorage.setItem('coupons', JSON.stringify(defaultCoupons));
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    initAdminUser();
    initDefaultCoupons();
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        const userDropdown = document.getElementById('userDropdown');
        const userMenuBtn = document.getElementById('userMenuBtn');
        
        if (userDropdown && !userDropdown.contains(e.target) && e.target !== userMenuBtn) {
            userDropdown.classList.add('hidden');
        }
    });
});

// Show products by default on page load
window.addEventListener('load', function() {
    if (currentUser) {
        goToSection('products');
    }
});
