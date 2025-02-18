import { getProducts, createOrder, login, register, isAuthenticated } from './api.js';

// Gestion du panier
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Vérification de l'authentification pour les actions protégées
function requireAuth(action) {
    if (!isAuthenticated()) {
        alert('Veuillez vous connecter pour effectuer cette action');
        window.location.href = 'compte.html';
        return false;
    }
    return true;
}

function addToCart(product) {
    if (!requireAuth(() => {})) return;
    
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

function removeFromCart(productId) {
    if (!requireAuth(() => {})) return;
    
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

function updateQuantity(productId, newQuantity) {
    if (!requireAuth(() => {})) return;
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(1, newQuantity);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
    }
}

// Affichage des produits
async function displayProducts() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;

    try {
        const products = await getProducts();
        productsGrid.innerHTML = products.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <p class="product-price">${product.price_htg} HTG</p>
                    ${isAuthenticated() ? 
                        `<button class="add-to-cart" data-product='${JSON.stringify(product)}'>
                            Ajouter au panier
                        </button>` :
                        `<button onclick="window.location.href='compte.html'" class="add-to-cart">
                            Connectez-vous pour acheter
                        </button>`
                    }
                </div>
            </div>
        `).join('');

        // Ajouter les gestionnaires d'événements pour les boutons "Ajouter au panier"
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (event) => {
                const product = JSON.parse(event.target.getAttribute('data-product'));
                addToCart(product);
            });
        });
    } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
        productsGrid.innerHTML = '<p>Une erreur est survenue lors du chargement des produits.</p>';
    }
}

// Gestion du panier
function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    if (!cartItems) return;

    if (!isAuthenticated()) {
        cartItems.innerHTML = `
            <div class="cart-login-prompt">
                <p>Veuillez vous connecter pour voir votre panier</p>
                <button onclick="window.location.href='compte.html'" class="cta-button">
                    Se connecter
                </button>
            </div>`;
        return;
    }

    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Votre panier est vide</p>';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p>${item.price_htg} HTG</p>
            </div>
            <div class="cart-item-quantity">
                <button onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
            </div>
            <p class="cart-item-total">${item.price_htg * item.quantity} HTG</p>
            <button onclick="removeFromCart('${item.id}')" class="remove-item">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');

    updateCartSummary();
}

function updateCartSummary() {
    if (!isAuthenticated()) return;

    const subtotal = cart.reduce((sum, item) => sum + (item.price_htg * item.quantity), 0);
    const shipping = subtotal > 0 ? 500 : 0;
    const total = subtotal + shipping;

    const summaryElements = {
        subtotal: document.getElementById('subtotal'),
        shipping: document.getElementById('shipping'),
        total: document.getElementById('total')
    };

    Object.entries(summaryElements).forEach(([key, element]) => {
        if (element) element.textContent = `${key === 'subtotal' ? subtotal : 
                                           key === 'shipping' ? shipping : total} HTG`;
    });
}

// Gestion du profil utilisateur
function showUserProfile() {
    if (!isAuthenticated()) return;

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'none';
    const userProfile = document.getElementById('user-profile');
    userProfile.style.display = 'block';

    // Mise à jour des informations du profil
    ['name', 'email', 'phone'].forEach(field => {
        const element = document.getElementById(`profile-${field}`);
        if (element) element.textContent = user[field] || 'Non renseigné';
    });

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('user');
            localStorage.removeItem('cart');
            cart = [];
            window.location.href = 'index.html';
        });
    }
}

// Gestion de l'authentification
function initAuthForms() {
    const forms = {
        login: document.getElementById('loginForm'),
        register: document.getElementById('registerForm'),
        showRegister: document.getElementById('showRegister'),
        showLogin: document.getElementById('showLogin')
    };

    if (isAuthenticated()) {
        showUserProfile();
        return;
    }

    // Gestionnaires d'événements pour basculer entre les formulaires
    ['showRegister', 'showLogin'].forEach(btn => {
        if (forms[btn]) {
            forms[btn].addEventListener('click', (e) => {
                e.preventDefault();
                const isRegister = btn === 'showRegister';
                document.getElementById('login-form').style.display = isRegister ? 'none' : 'block';
                document.getElementById('register-form').style.display = isRegister ? 'block' : 'none';
            });
        }
    });

    // Gestion des soumissions de formulaires
    if (forms.login) {
        forms.login.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(forms.login);
            try {
                await login({
                    email: formData.get('email'),
                    password: formData.get('password')
                });
                window.location.reload();
            } catch (error) {
                alert('Erreur de connexion: ' + error.message);
            }
        });
    }

    if (forms.register) {
        forms.register.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(forms.register);
            try {
                await register({
                    name: formData.get('name'),
                    email: formData.get('email'),
                    password: formData.get('password'),
                    phone: formData.get('phone')
                });
                window.location.reload();
            } catch (error) {
                alert('Erreur d\'inscription: ' + error.message);
            }
        });
    }
}

// Initialisation
async function init() {
    // Vérification de l'authentification globale
    const isAuth = isAuthenticated();
    
    // Attacher les fonctions au window
    Object.assign(window, {
        addToCart,
        removeFromCart,
        updateQuantity
    });

    // Navigation sécurisée
    const protectedPages = ['panier.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage) && !isAuth) {
        window.location.href = 'compte.html';
        return;
    }

    // Initialiser les différentes sections selon la page
    if (document.getElementById('products-grid')) {
        await displayProducts();
    }

    if (document.getElementById('cart-items')) {
        updateCartDisplay();
    }

    if (document.getElementById('login-form')) {
        initAuthForms();
    }

    // Initialiser le checkout
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', async () => {
            if (!requireAuth(() => {})) return;

            try {
                const order = await createOrder({
                    items: cart.map(item => ({
                        product_id: item.id,
                        quantity: item.quantity
                    }))
                });
                
                cart = [];
                localStorage.removeItem('cart');
                updateCartDisplay();
                
                alert('Commande créée avec succès!');
                window.location.href = 'compte.html';
            } catch (error) {
                alert('Erreur lors de la création de la commande: ' + error.message);
            }
        });
    }
}

// Démarrer l'application
document.addEventListener('DOMContentLoaded', init);
