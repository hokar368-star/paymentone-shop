const products = [
    {
        id: 1,
        name: 'ChatGPT Pro',
        description: 'دسترسی نامحدود به ChatGPT 4',
        price: 199000,
        icon: '🤖',
        category: 'chat'
    },
    {
        id: 2,
        name: 'Claude Pro',
        description: 'اکانت Anthropic Claude Premium',
        price: 179000,
        icon: '🧠',
        category: 'chat'
    },
    {
        id: 3,
        name: 'Gemini Advanced',
        description: 'Google Gemini با ویژگی‌های پیشرفته',
        price: 149000,
        icon: '✨',
        category: 'chat'
    },
    {
        id: 4,
        name: 'Midjourney',
        description: 'تولید تصاویر هنری با AI',
        price: 219000,
        icon: '🎨',
        category: 'image'
    },
    {
        id: 5,
        name: 'Copilot Pro',
        description: 'GitHub Copilot برای برنامه‌نویسان',
        price: 129000,
        icon: '💻',
        category: 'code'
    },
    {
        id: 6,
        name: 'Adobe Firefly',
        description: 'تولید محتوای خلاقانه',
        price: 159000,
        icon: '🔥',
        category: 'image'
    }
];

function renderProducts() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-icon">${product.icon}</div>
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="product-price">${product.price.toLocaleString('fa-IR')} تومان</div>
            <button class="btn-add" onclick="addToCart(${product.id})">افزودن به سبد</button>
        `;
        productsGrid.appendChild(productCard);
    });
}

function getProductById(id) {
    return products.find(p => p.id === id);
}

renderProducts();
