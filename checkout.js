// =================================================================
// ARCHIVO checkout.js COMPLETO Y CORREGIDO
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
    
    // Selectores
    const summaryItemsContainer = document.getElementById('summary-items');
    const summaryTotalSpan = document.querySelector('.summary-total span:last-child');
    const checkoutForm = document.getElementById('checkout-form');
    const paymentInstructions = document.getElementById('payment-instructions');
    const paymentTotal = document.getElementById('payment-total');
    const whatsappBtn = document.querySelector('.whatsapp-btn');
    const phoneInput = document.getElementById('phone'); // Selector para el campo de teléfono

    // --- LÓGICA PARA VALIDAR EL CAMPO DE TELÉFONO ---
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            // Reemplaza cualquier caracter que NO sea un número por una cadena vacía
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        });
    }

    // Leemos el carrito desde localStorage
    const cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
    let total = 0;

    // Función para renderizar el resumen del pedido
    function renderSummary() {
        if (!summaryItemsContainer) return; 
        
        summaryItemsContainer.innerHTML = '';
        total = 0;

        if (cart.length > 0) {
            cart.forEach(item => {
                const summaryItemDiv = document.createElement('div');
                summaryItemDiv.classList.add('summary-item');
                summaryItemDiv.innerHTML = `
                    <span>${item.name} (x${item.quantity})</span>
                    <span>$${(item.price * item.quantity).toLocaleString('es-CO')}</span>
                `;
                summaryItemsContainer.appendChild(summaryItemDiv);
                total += item.price * item.quantity;
            });
        } else {
            summaryItemsContainer.innerHTML = '<p>No hay productos en tu pedido.</p>';
        }

        if (summaryTotalSpan) {
            summaryTotalSpan.textContent = `$${total.toLocaleString('es-CO')}`;
        }
    }

    // Listener para el formulario
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const address = document.getElementById('address').value;
            const city = document.getElementById('city').value;
            const phone = document.getElementById('phone').value;
            
            const message = `¡Hola! Quiero confirmar mi pedido:\n\n*Nombre:* ${name}\n*Correo:* ${email}\n*Dirección:* ${address}\n*Ciudad:* ${city}\n*Teléfono:* ${phone}\n\n*Total a Pagar:* $${total.toLocaleString('es-CO')}\n\nAdjunto mi comprobante de pago. ¡Gracias!`;
            const encodedMessage = encodeURIComponent(message);
            
            const whatsappNumber = '573105708491'; // <-- ¡RECUERDA CAMBIAR ESTE NÚMERO POR TU WHATSAPP!
            const newWhatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
            whatsappBtn.href = newWhatsappUrl;

            paymentTotal.textContent = `$${total.toLocaleString('es-CO')}`;
            paymentInstructions.classList.remove('hidden');
            e.target.querySelector('.submit-order-btn').style.display = 'none';
        });
    }

    // Renderizar el resumen al cargar la página
    renderSummary();
});