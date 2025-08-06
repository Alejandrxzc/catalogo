document.addEventListener('DOMContentLoaded', () => {
    
    // Seleccionamos los contenedores en la página de checkout
    const summaryItemsContainer = document.getElementById('summary-items');
    const summaryTotalSpan = document.querySelector('.summary-total span:last-child');

    // Leemos el carrito desde localStorage
    const cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

    // Limpiamos el contenido del resumen
    summaryItemsContainer.innerHTML = '';
    let total = 0;

    if (cart.length > 0) {
        cart.forEach(item => {
            // Creamos un div para cada producto en el resumen
            const summaryItemDiv = document.createElement('div');
            summaryItemDiv.classList.add('summary-item');
            summaryItemDiv.innerHTML = `
                <span>${item.name} (x${item.quantity})</span>
                <span>$${(item.price * item.quantity).toLocaleString('es-CO')}</span>
            `;
            summaryItemsContainer.appendChild(summaryItemDiv);

            // Calculamos el total
            total += item.price * item.quantity;
        });
    } else {
        summaryItemsContainer.innerHTML = '<p>No hay productos en tu pedido.</p>';
    }

    // Mostramos el total final
    summaryTotalSpan.textContent = `$${total.toLocaleString('es-CO')}`;
});