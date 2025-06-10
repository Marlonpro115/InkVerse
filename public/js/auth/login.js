(() => {
    const form = document.getElementById('loginForm');
    const userInput = form.userIdentifier;
    const passwordInput = form.password;
    const userError = document.getElementById('userIdentifierError');
    const passError = document.getElementById('passwordError');

    // Validación simple en submit
    form.addEventListener('submit', (e) => {
        let valid = true;

        if (!userInput.value.trim()) {
            userError.classList.remove('hidden');
            valid = false;
        } else {
            userError.classList.add('hidden');
        }

        if (!passwordInput.value.trim()) {
            passError.classList.remove('hidden');
            valid = false;
        } else {
            passError.classList.add('hidden');
        }

        if (!valid) {
            e.preventDefault();
        }
    });

    // Validación en tiempo real mientras el usuario escribe
    userInput.addEventListener('input', () => {
        if (userInput.value.trim()) {
            userError.classList.add('hidden');
        }
    });

    passwordInput.addEventListener('input', () => {
        if (passwordInput.value.trim()) {
            passError.classList.add('hidden');
        }
    });

    // Toggle mostrar/ocultar contraseña usando Bootstrap Icons
    const togglePasswordBtn = document.getElementById('togglePassword');
    const icon = togglePasswordBtn.querySelector('i');

    togglePasswordBtn.addEventListener('click', () => {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.remove('bi-eye-slash');
            icon.classList.add('bi-eye');
        } else {
            passwordInput.type = 'password';
            icon.classList.remove('bi-eye');
            icon.classList.add('bi-eye-slash');
        }
    });
})();