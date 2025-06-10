// Mostrar/ocultar campos según método seleccionado
const recoverByEmail = document.getElementById('recoverByEmail');
const recoverByPhone = document.getElementById('recoverByPhone');
const emailField = document.getElementById('emailField');
const phoneField = document.getElementById('phoneField');
const forgotForm = document.getElementById('forgotForm');

recoverByEmail.addEventListener('change', () => {
    if (recoverByEmail.checked) {
        emailField.style.display = '';
        phoneField.style.display = 'none';
    }
});
recoverByPhone.addEventListener('change', () => {
    if (recoverByPhone.checked) {
        emailField.style.display = 'none';
        phoneField.style.display = '';
    }
});

// Validación simple antes de enviar
forgotForm.addEventListener('submit', function (e) {
    if (recoverByEmail.checked) {
        if (!forgotForm.email.value.trim()) {
            e.preventDefault();
            forgotForm.email.classList.add('ring-2', 'ring-red-500');
            alert('Por favor ingresa tu correo electrónico.');
        } else {
            forgotForm.email.classList.remove('ring-2', 'ring-red-500');
        }
    } else if (recoverByPhone.checked) {
        if (!forgotForm.phone.value.trim()) {
            e.preventDefault();
            forgotForm.phone.classList.add('ring-2', 'ring-red-500');
            alert('Por favor ingresa tu número de teléfono.');
        } else {
            forgotForm.phone.classList.remove('ring-2', 'ring-red-500');
        }
    }
});