document.addEventListener('DOMContentLoaded', () => {

    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
    const allProductsOnPage = document.querySelectorAll('.producto');
    const cartSidebar = document.querySelector('.carrito-sidebar');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalSpan = document.getElementById('cart-total');
    const openCartButton = document.getElementById('open-cart-btn');
    const closeCartButton = document.getElementById('close-cart-btn');
    const notificationContainer = document.getElementById('notification-container');

    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const noResultsMessage = document.getElementById('no-results-message');
    const productSections = document.querySelectorAll('.categoria-productos');

    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
        });

        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            let productsFound = 0;

            allProductsOnPage.forEach(product => {
                const productName = product.querySelector('h3').textContent.toLowerCase();
                if (productName.includes(searchTerm)) {
                    product.style.display = 'flex';
                    productsFound++;
                } else {
                    product.style.display = 'none';
                }
            });

            productSections.forEach(section => {
                const visibleProductsInSection = section.querySelectorAll('.producto:not([style*="display: none"])');
                if (visibleProductsInSection.length === 0) {
                    section.style.display = 'none';
                } else {
                    section.style.display = 'block';
                }
            });

            if (productsFound === 0 && searchTerm !== '') {
                noResultsMessage.style.display = 'block';
            } else {
                noResultsMessage.style.display = 'none';
            }
        });
    }

    const backToTopButton = document.getElementById('back-to-top-btn');

    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });

        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    function updateButtonStates() {
        allProductsOnPage.forEach(productCard => {
            const productName = productCard.querySelector('h3').textContent;
            const button = productCard.querySelector('.add-to-cart');
            if (!button) return;

            const isInCart = cart.some(item => item.name === productName);
            if (isInCart) {
                button.classList.add('in-cart');
                button.innerHTML = '✓ En el Carrito';
                button.disabled = true;
            } else {
                button.classList.remove('in-cart');
                button.innerHTML = 'Añadir al Carrito';
                button.disabled = false;
            }
        });
    }

    function saveCartToLocalStorage() {
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
        if (typeof updateButtonStates === 'function') {
            updateButtonStates();
        }
    }

    function showNotification(productName) {
        if (!notificationContainer) return;
        const notification = document.createElement('div');
        notification.classList.add('notification');
        notification.innerHTML = `✓ <strong>${productName}</strong> ha sido añadido al carrito.`;
        notificationContainer.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 3500);
    }

    function renderCart() {
        if (!cartItemsContainer) return;
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

    function addToCart(e) {
        openCart();
        const productData = e.target.dataset;
        const productName = productData.product;
        const productPrice = parseFloat(productData.price);
        const productImage = productData.image;
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
        const targetButton = e.target.closest('button');
        if (!targetButton) return;
        const productName = targetButton.dataset.productName;
        const itemInCart = cart.find(item => item.name === productName);
        if (!itemInCart) return;
        if (targetButton.classList.contains('plus-btn')) {
            itemInCart.quantity++;
        } else if (targetButton.classList.contains('minus-btn')) {
            if (itemInCart.quantity > 1) {
                itemInCart.quantity--;
            } else {
                cart = cart.filter(item => item.name !== productName);
            }
        } else if (targetButton.classList.contains('remove-item-btn')) {
            cart = cart.filter(item => item.name !== productName);
        }
        saveCartToLocalStorage();
        renderCart();
    }

    function openCart() {
        if (cartSidebar) cartSidebar.classList.add('open');
    }

    function closeCart() {
        if (cartSidebar) cartSidebar.classList.remove('open');
    }

    if (addToCartButtons.length) {
        addToCartButtons.forEach(button => button.addEventListener('click', addToCart));
    }
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', handleCartActions);
    }
    if (openCartButton) {
        openCartButton.addEventListener('click', openCart);
    }
    if (closeCartButton) {
        closeCartButton.addEventListener('click', closeCart);
    }
    
    const lazyImages = document.querySelectorAll('img.lazy-load');
    if (lazyImages.length > 0) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    image.src = image.dataset.src;
                    image.addEventListener('load', () => {
                        image.classList.add('visible');
                    });
                    observer.unobserve(image);
                }
            });
        });
        lazyImages.forEach(image => {
            imageObserver.observe(image);
        });
    }

    renderCart();
    updateButtonStates();
});