function checkout() {
    if (cart.length === 0) {
        alert('سبد خرید شما خالی است!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const items = cart.map(item => `${item.name} (${item.price.toLocaleString('fa-IR')} تومان)`).join('\n');
    
    // Payment One Integration
    const paymentData = {
        amount: total,
        currency: 'IRT',
        mobile: '', // Will be filled by user
        email: '', // Will be filled by user
        description: `خرید: ${items}`,
        orderId: 'ORDER_' + Date.now(),
        callback: window.location.href
    };
    
    // Create payment request
    const paymentWindow = window.open('', 'PaymentOneWindow', 'width=600,height=700');
    
    // Show payment form
    showPaymentForm(total);
}

function showPaymentForm(total) {
    const formHTML = `
        <!DOCTYPE html>
        <html lang="fa" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>پرداخت Payment One</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; padding: 20px; }
                .payment-container { max-width: 400px; margin: 50px auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                .payment-header { text-align: center; margin-bottom: 30px; }
                .payment-header h1 { color: #667eea; font-size: 1.5rem; margin-bottom: 10px; }
                .payment-amount { text-align: center; font-size: 2rem; color: #333; font-weight: bold; margin-bottom: 30px; }
                .form-group { margin-bottom: 20px; }
                .form-group label { display: block; margin-bottom: 5px; color: #333; font-weight: 500; }
                .form-group input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-size: 1rem; }
                .form-group input:focus { outline: none; border-color: #667eea; box-shadow: 0 0 5px rgba(102, 126, 234, 0.3); }
                .btn-pay { width: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px; border: none; border-radius: 5px; font-size: 1rem; font-weight: bold; cursor: pointer; transition: transform 0.3s; }
                .btn-pay:hover { transform: scale(1.02); }
                .info-text { text-align: center; color: #999; font-size: 0.9rem; margin-top: 15px; }
            </style>
        </head>
        <body>
            <div class="payment-container">
                <div class="payment-header">
                    <h1>💳 پرداخت از طریق Payment One</h1>
                </div>
                <div class="payment-amount">${total.toLocaleString('fa-IR')} تومان</div>
                <form id="paymentForm">
                    <div class="form-group">
                        <label for="mobile">شماره موبایل</label>
                        <input type="tel" id="mobile" name="mobile" placeholder="09xxxxxxxxx" required>
                    </div>
                    <div class="form-group">
                        <label for="email">ایمیل</label>
                        <input type="email" id="email" name="email" placeholder="your@email.com" required>
                    </div>
                    <button type="submit" class="btn-pay">پرداخت کنید</button>
                    <p class="info-text">💡 لطفاً اطلاعات صحیح وارد کنید</p>
                </form>
            </div>
            <script>
                document.getElementById('paymentForm').addEventListener('submit', function(e) {
                    e.preventDefault();
                    const mobile = document.getElementById('mobile').value;
                    const email = document.getElementById('email').value;
                    
                    // Payment One API Call
                    const paymentData = {
                        amount: ${total},
                        mobile: mobile,
                        email: email,
                        description: 'خرید اکانت‌های AI',
                        orderId: 'ORDER_' + Date.now()
                    };
                    
                    // Simulate payment process
                    alert('درخواست پرداخت ارسال شد!\nشماره سفارش: ' + paymentData.orderId);
                    window.close();
                });
            </script>
        </body>
        </html>
    `;
    
    const newWindow = window.open('', 'PaymentWindow', 'width=500,height=600');
    newWindow.document.write(formHTML);
}