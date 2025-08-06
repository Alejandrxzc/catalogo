// =================================================================
// ARCHIVO app.js FINAL CON GUARDADO EN LOCALSTORAGE
// =================================================================

document.addEventListener('DOMContentLoaded', () => {

    // --- VARIABLES Y SELECTORES ---
    // AHORA "cart" se inicializa cargando desde localStorage
    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

    const cartSidebar = document.querySelector('.carrito-sidebar');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalSpan = document.getElementById('cart-total');
    const openCartButton = document.getElementById('open-cart-btn');
    const closeCartButton = document.getElementById('close-cart-btn');

    // --- FUNCIONES ---

    // NUEVA FUNCIÓN: Guarda el estado actual del carrito en localStorage
    function saveCartToLocalStorage() {
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
    }

    function renderCart() {
        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (cart.length > 0) {
            cart.forEach(item => {
                const cartItemLi = document.createElement('li');
                cartItemLi.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <span class="cart-item-name">${item.name}</span>
                        <span class="cart-item-price">$${item.price.toLocaleString('es-CO')}</span>
                    </div>
                    <div class="cart-item-controls">
                        <span class="cart-item-quantity">x${item.quantity}</span>
                        <button class="remove-item-btn" data-product-name="${item.name}">&times;</button>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItemLi);
                total += item.price * item.quantity;
            });
        } else {
            cartItemsContainer.innerHTML = '<li class="cart-empty-msg">Tu carrito está vacío</li>';
        }
        
        cartTotalSpan.textContent = `$${total.toLocaleString('es-CO')}`;
    }

    function addToCart(e) {
        openCart();
        const productData = e.target.dataset;
        const productName = productData.product;
        const productPrice = parseFloat(productData.price);
        const productImage = productData.image;

        const existingItem = cart.find(item => item.name === productName);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ name: productName, price: productPrice, image: productImage, quantity: 1 });
        }
        
        saveCartToLocalStorage(); // Guardamos el carrito cada vez que añadimos algo
        renderCart();
    }

    function handleCartActions(e) {
        if (e.target.classList.contains('remove-item-btn')) {
            const productName = e.target.dataset.productName;
            cart = cart.filter(item => item.name !== productName);
            
            saveCartToLocalStorage(); // Guardamos el carrito cada vez que eliminamos algo
            renderCart();
        }
    }
    
    function openCart() {
        cartSidebar.classList.add('open');
    }

    function closeCart() {
        cartSidebar.classList.remove('open');
    }

    // --- EVENT LISTENERS ---
    addToCartButtons.forEach(button => button.addEventListener('click', addToCart));
    cartItemsContainer.addEventListener('click', handleCartActions);
    openCartButton.addEventListener('click', openCart);
    closeCartButton.addEventListener('click', closeCart);
    
    // Renderiza el carrito al cargar la página para mostrar los productos guardados
    renderCart();
});