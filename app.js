// =================================================================
// ARCHIVO app.js FINAL CON NOTIFICACIONES
// =================================================================

document.addEventListener('DOMContentLoaded', () => {

    // --- VARIABLES Y SELECTORES ---
    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
    const cartSidebar = document.querySelector('.carrito-sidebar');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalSpan = document.getElementById('cart-total');
    const openCartButton = document.getElementById('open-cart-btn');
    const closeCartButton = document.getElementById('close-cart-btn');
    // NUEVO SELECTOR
    const notificationContainer = document.getElementById('notification-container');

    // --- FUNCIONES ---

    function saveCartToLocalStorage() {
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
    }

    // --- NUEVA FUNCIÓN: Muestra una notificación ---
    function showNotification(productName) {
        // Crea un nuevo div para la notificación
        const notification = document.createElement('div');
        notification.classList.add('notification');
        notification.innerHTML = `✓ <strong>${productName}</strong> ha sido añadido al carrito.`;

        // Lo añade al contenedor
        notificationContainer.appendChild(notification);

        // Se asegura de que se elimine del DOM después de que la animación termine
        setTimeout(() => {
            notification.remove();
        }, 3500); // 3.5 segundos (3s de espera + 0.5s de animación de salida)
    }

    function renderCart() {
        // (Esta función no cambia, es la misma que ya teníamos)
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
                        <button class="quantity-btn minus-btn" data-product-name="${item.name}">-</button>
                        <span class="item-quantity">${item.quantity}</span>
                        <button class="quantity-btn plus-btn" data-product-name="${item.name}">+</button>
                        <button class="remove-item-btn" data-product-name="${item.name}"><i class="fas fa-trash-alt"></i></button>
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

    // --- FUNCIÓN addToCart() ACTUALIZADA ---
    // Ahora llama a la notificación
    function addToCart(e) {
        openCart();
        const productData = e.target.dataset;
        const productName = productData.product;
        const productPrice = parseFloat(productData.price);
        const productImage = productData.image;

        // LLAMAMOS A LA NOTIFICACIÓN
        showNotification(productName);

        const existingItem = cart.find(item => item.name === productName);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ name: productName, price: productPrice, image: productImage, quantity: 1 });
        }
        
        saveCartToLocalStorage();
        renderCart();
    }

    function handleCartActions(e) {
        // (Esta función no cambia, es la misma que ya teníamos)
        const targetButton = e.target.closest('button');
        if (!targetButton) return;
        const productName = targetButton.dataset.productName;
        const itemInCart = cart.find(item => item.name === productName);
        if (targetButton.classList.contains('plus-btn')) {
            itemInCart.quantity++;
        } 
        else if (targetButton.classList.contains('minus-btn')) {
            if (itemInCart.quantity > 1) {
                itemInCart.quantity--;
            } else {
                cart = cart.filter(item => item.name !== productName);
            }
        } 
        else if (targetButton.classList.contains('remove-item-btn')) {
            cart = cart.filter(item => item.name !== productName);
        }
        saveCartToLocalStorage();
        renderCart();
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
    
    renderCart();
});