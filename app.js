// Espera a que todo el contenido HTML se cargue antes de ejecutar el script
document.addEventListener('DOMContentLoaded', () => {

    // --- VARIABLES Y SELECTORES ---
    let cart = []; // Este array guardará los productos del carrito
    const cartSidebar = document.querySelector('.carrito-sidebar');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalSpan = document.getElementById('cart-total');
    const clearCartButton = document.getElementById('clear-cart-btn');
    const openCartButton = document.getElementById('open-cart-btn'); // AÑADIR ESTA LÍNEA
    const closeCartButton = document.getElementById('close-cart-btn'); // AÑADIR ESTA LÍNEA

    // --- FUNCIONES ---

    // Función para renderizar (dibujar) los productos en el carrito
    function renderCart() {
        // Limpiar el contenedor del carrito
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<li class="cart-empty-msg">Tu carrito está vacío</li>';
            cartSidebar.classList.remove('open'); // Oculta el carrito si está vacío
            return;
        }

        let total = 0;
        cart.forEach(item => {
            // Crear el elemento li para cada producto
            const cartItemLi = document.createElement('li');
            cartItemLi.innerHTML = `
                <span>${item.name} (x${item.quantity})</span>
                <span>$${(item.price * item.quantity).toLocaleString('es-CO')}</span>
            `;
            cartItemsContainer.appendChild(cartItemLi);

            // Sumar al total
            total += item.price * item.quantity;
        });

        // Actualizar el texto del total
        cartTotalSpan.textContent = `$${total.toLocaleString('es-CO')}`;
    }

    // Función para añadir un producto al carrito
    function addToCart(e) {
        // Mostrar el carrito
        openCart();

        // Obtener datos del producto desde el botón
        const productData = e.target.dataset;
        const productName = productData.product;
        const productPrice = parseFloat(productData.price);

        // Buscar si el producto ya está en el carrito
        const existingItem = cart.find(item => item.name === productName);

        if (existingItem) {
            // Si ya existe, aumentar la cantidad
            existingItem.quantity++;
        } else {
            // Si no existe, añadirlo como nuevo
            cart.push({
                name: productName,
                price: productPrice,
                quantity: 1
            });
        }

        // Volver a renderizar el carrito con los nuevos datos
        renderCart();
    }
    
    // Función para vaciar el carrito
    function clearCart() {
        cart = []; // Vacía el array
        renderCart(); // Vuelve a renderizar para mostrarlo vacío
    }

    function openCart() {
        cartSidebar.classList.add('open');
    }

    function closeCart() {
        cartSidebar.classList.remove('open');
    }

    // --- EVENT LISTENERS ---

    // Añadir un listener a cada botón de "Añadir al Carrito"
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });
    
    // Listener para el botón de vaciar carrito
    clearCartButton.addEventListener('click', clearCart);

    openCartButton.addEventListener('click', openCart);
    closeCartButton.addEventListener('click', closeCart);
    
    // Renderizar el carrito al cargar la página (por si acaso guardamos datos en el futuro)
    renderCart();
});