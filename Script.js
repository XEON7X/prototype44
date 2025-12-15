/* --- Product Data (Mock Database) --- */
const products = [
    {
        id: 1,
        name: "Eternity Diamond Ring",
        category: "Rings",
        price: 3499,
        image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=600",
        purity: "18k White Gold",
        weight: "4.5g",
        stone: "VS1 Diamond, 1.2ct"
    },
    {
        id: 2,
        name: "Royal Sapphire Necklace",
        category: "Necklaces",
        price: 5200,
        image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=600",
        purity: "24k Gold",
        weight: "12g",
        stone: "Blue Sapphire"
    },
    {
        id: 3,
        name: "Golden Pearl Earrings",
        category: "Earrings",
        price: 1800,
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600",
        purity: "22k Gold",
        weight: "8g",
        stone: "Freshwater Pearl"
    },
    {
        id: 4,
        name: "Minimalist Gold Bracelet",
        category: "Bracelets",
        price: 950,
        image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600",
        purity: "18k Rose Gold",
        weight: "6g",
        stone: "None"
    },
    {
        id: 5,
        name: "Solitaire Pendant",
        category: "Necklaces",
        price: 2100,
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=600",
        purity: "18k Yellow Gold",
        weight: "3g",
        stone: "Si2 Diamond"
    },
    {
        id: 6,
        name: "Vintage Ruby Ring",
        category: "Rings",
        price: 4100,
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600",
        purity: "Platinum",
        weight: "5g",
        stone: "Burmese Ruby"
    }
];

/* --- Initialization --- */
document.addEventListener('DOMContentLoaded', () => {
    // Init AOS
    AOS.init({
        once: true,
        offset: 100
    });

    // Init Swiper
    new Swiper(".mySwiper", {
        slidesPerView: 1,
        spaceBetween: 20,
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        breakpoints: {
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
        },
    });

    renderProducts();
    updateCartUI();
    updateWishlistCount();
});

/* --- DOM Elements --- */
const productContainer = document.getElementById('product-container');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const cartBtn = document.getElementById('cart-btn');
const closeCartBtn = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const cartCountEl = document.getElementById('cart-count');
const wishlistCountEl = document.getElementById('wishlist-count');
const modal = document.getElementById('product-modal');
const closeModalBtn = document.getElementById('close-modal');
const modalBody = document.getElementById('modal-body');

/* --- State Management --- */
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

/* --- Render Products --- */
function renderProducts() {
    productContainer.innerHTML = products.map(product => `
        <div class="product-card" data-aos="fade-up">
            <div class="product-img-wrapper">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-actions">
                    <div class="action-btn" onclick="addToCart(${product.id})">
                        <i class="fa-solid fa-cart-plus"></i>
                    </div>
                    <div class="action-btn" onclick="openModal(${product.id})">
                        <i class="fa-regular fa-eye"></i>
                    </div>
                    <div class="action-btn" onclick="toggleWishlist(${product.id})">
                        <i class="${isInWishlist(product.id) ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                    </div>
                </div>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">$${product.price.toLocaleString()}</div>
            </div>
        </div>
    `).join('');
}

/* --- Cart Logic --- */
function addToCart(id) {
    const item = cart.find(p => p.id === id);
    if (item) {
        item.qty++;
    } else {
        const product = products.find(p => p.id === id);
        cart.push({ ...product, qty: 1 });
    }
    saveCart();
    updateCartUI();
    openCart();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartUI();
}

function changeQty(id, change) {
    const item = cart.find(p => p.id === id);
    if (item) {
        item.qty += change;
        if (item.qty <= 0) removeFromCart(id);
        else saveCart();
        updateCartUI();
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartUI() {
    // Update Count
    const totalCount = cart.reduce((acc, item) => acc + item.qty, 0);
    cartCountEl.textContent = totalCount;

    // Update List
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-msg">Your cart is empty.</p>';
        cartTotalEl.textContent = '$0.00';
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>$${item.price.toLocaleString()}</p>
                <div class="cart-controls">
                    <div class="qty-btn" onclick="changeQty(${item.id}, -1)">-</div>
                    <span>${item.qty}</span>
                    <div class="qty-btn" onclick="changeQty(${item.id}, 1)">+</div>
                    <i class="fa-solid fa-trash remove-item" onclick="removeFromCart(${item.id})"></i>
                </div>
            </div>
        </div>
    `).join('');

    // Update Total
    const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    cartTotalEl.textContent = '$' + total.toLocaleString();
}

function openCart() {
    cartSidebar.classList.add('active');
    cartOverlay.style.display = 'block';
}

function closeCart() {
    cartSidebar.classList.remove('active');
    cartOverlay.style.display = 'none';
}

cartBtn.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

/* --- Wishlist Logic --- */
function toggleWishlist(id) {
    const index = wishlist.indexOf(id);
    if (index === -1) {
        wishlist.push(id);
        alert("Added to Wishlist");
    } else {
        wishlist.splice(index, 1);
        alert("Removed from Wishlist");
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistCount();
    renderProducts(); // Re-render to update heart icon
}

function isInWishlist(id) {
    return wishlist.includes(id);
}

function updateWishlistCount() {
    wishlistCountEl.textContent = wishlist.length;
}

/* --- Modal Logic --- */
function openModal(id) {
    const product = products.find(p => p.id === id);
    modalBody.innerHTML = `
        <div class="modal-img">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="modal-details">
            <h2>${product.name}</h2>
            <h3 style="color:var(--accent-color); margin-bottom:1rem;">$${product.price.toLocaleString()}</h3>
            <p>Experience the epitome of luxury with this handcrafted masterpiece.</p>
            <div class="detail-meta">
                <span><strong>Category:</strong> ${product.category}</span>
                <span><strong>Purity:</strong> ${product.purity}</span>
                <span><strong>Weight:</strong> ${product.weight}</span>
                <span><strong>Stone:</strong> ${product.stone}</span>
            </div>
            <button class="btn-primary" onclick="addToCart(${product.id}); closeModal();">Add to Bag</button>
        </div>
    `;
    modal.style.display = 'flex';
}

function closeModal() {
    modal.style.display = 'none';
}

closeModalBtn.addEventListener('click', closeModal);
window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
}
