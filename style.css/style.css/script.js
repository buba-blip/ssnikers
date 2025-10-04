// Кошик
let cart = [];
let cartCount = 0;
let totalPrice = 0;

// Елементи DOM
const cartIcon = document.querySelector('.cart-icon');
const cartModal = document.getElementById('cartModal');
const closeModal = document.querySelector('.close');
const cartItemsContainer = document.querySelector('.cart-items');
const totalPriceElement = document.getElementById('total-price');
const cartCountElement = document.querySelector('.cart-count');

// Фільтрація товарів
const categoryBtns = document.querySelectorAll('.category-btn');
const productCards = document.querySelectorAll('.product-card');

// Відкриття/закриття кошика
cartIcon.addEventListener('click', () => {
    cartModal.style.display = 'block';
    updateCartDisplay();
});

closeModal.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

// Додавання товару в кошик
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart')) {
        const product = e.target.dataset.product;
        const price = parseInt(e.target.dataset.price);
        
        addToCart(product, price);
        
        // Анімація додавання
        e.target.textContent = 'Додано!';
        e.target.style.background = '#28a745';
        
        setTimeout(() => {
            e.target.textContent = 'Додати в кошик';
            e.target.style.background = '#667eea';
        }, 2000);
    }
});

// Функція додавання в кошик
function addToCart(product, price) {
    const existingItem = cart.find(item => item.product === product);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            product: product,
            price: price,
            quantity: 1
        });
    }
    
    cartCount++;
    totalPrice += price;
    
    updateCartCounter();
}

// Оновлення лічильника кошика
function updateCartCounter() {
    cartCountElement.textContent = cartCount;
}

// Оновлення відображення кошика
function updateCartDisplay() {
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Кошик порожній</p>';
        totalPriceElement.textContent = '0';
        return;
    }
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = 
            `<div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #eee;">
                <div>
                    <strong>${item.product}</strong>
                    <br>
                    <small>${item.price} ₴ × ${item.quantity}</small>
                </div>
                <div>
                    <strong>${item.price * item.quantity} ₴</strong>
                    <button onclick="removeFromCart('${item.product}')" style="margin-left: 10px; background: #ff4757; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">×</button>
                </div>
            </div>`
        cartItemsContainer.appendChild(cartItem);
    });
    
    totalPriceElement.textContent = totalPrice;
}

// Видалення товару з кошика
function removeFromCart(product) {
    const itemIndex = cart.findIndex(item => item.product === product);
    
    if (itemIndex !== -1) {
        const item = cart[itemIndex];
        cartCount -= item.quantity;
        totalPrice -= item.price * item.quantity;
        cart.splice(itemIndex, 1);
        
        updateCartCounter();
        updateCartDisplay();
    }
}

// Фільтрація товарів за категоріями
categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Видаляємо активний клас з усіх кнопок
categoryBtns.forEach(b => b.classList.remove('active'));
        // Додаємо активний клас до поточної кнопки
        btn.classList.add('active');
        
        const category = btn.dataset.category;
        
        productCards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 100);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Плавна прокрутка для навігації
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Анімація при скролі
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Спостерігаємо за картками товарів
document.querySelectorAll('.product-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(50px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Кнопка "До каталогу"
document.querySelector('.cta-button').addEventListener('click', () => {
    document.querySelector('#catalog').scrollIntoView({
        behavior: 'smooth'
    });
});

// Імітація завантаження зображень (якщо зображення відсутні)
document.querySelectorAll('.product-image img').forEach(img => {
    img.onerror = function() {
        this.src = 'https://via.placeholder.com/300x300?text=Зображення+Товару';
    };
});
