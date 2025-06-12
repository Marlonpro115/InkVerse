document.addEventListener('DOMContentLoaded', function () {
    // Stepper JS
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const nextBtn = document.getElementById('nextStep');
    const prevBtn = document.getElementById('prevStep');
    const step1Circle = document.getElementById('step1-circle');
    const step2Circle = document.getElementById('step2-circle');

    nextBtn.addEventListener('click', () => {
        // Validación de campos obligatorios del paso 1
        const requiredFields = [
            'first_name',
            'last_name',
            'document_type',
            'document_number',
            'birth_date'
        ];
        let valid = true;
        requiredFields.forEach(id => {
            const el = document.getElementById(id);
            // Elimina mensaje de error anterior si existe
            let errorMsg = el.parentNode.querySelector('.error-message');
            if (errorMsg) errorMsg.remove();
            if (!el.value.trim()) {
                el.classList.add('ring-2', 'ring-red-500', 'focus:ring-red-500', 'focus:border-red-500');
                // Crea mensaje de error
                errorMsg = document.createElement('span');
                errorMsg.className = 'text-red-500 text-sm mt-1 error-message';
                errorMsg.innerText = 'Este campo es obligatorio';
                // Si el input está dentro de un div, lo agrega después del input
                if (el.parentNode.classList.contains('relative')) {
                    el.parentNode.appendChild(errorMsg);
                } else {
                    el.parentNode.insertBefore(errorMsg, el.nextSibling);
                }
                valid = false;
            } else {
                el.classList.remove('ring-2', 'ring-red-500', 'focus:ring-red-500', 'focus:border-red-500');
            }
        });
        if (!valid) {
            alert('Por favor completa todos los campos obligatorios antes de continuar.');
            return;
        }
        step1.classList.add('hidden-step');
        step2.classList.remove('hidden-step');
        step1Circle.classList.remove('active');
        step2Circle.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    prevBtn.addEventListener('click', () => {
        step2.classList.add('hidden-step');
        step1.classList.remove('hidden-step');
        step2Circle.classList.remove('active');
        step1Circle.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Validación de campos obligatorios del paso 2 antes de enviar el formulario
    const registerForm = document.getElementById('registerStepperForm');
    registerForm.addEventListener('submit', function (e) {
        // Solo validar si el paso 2 está visible
        if (!step2.classList.contains('hidden-step')) {
            const requiredStep2 = [
                'email',
                'password',
                'confirm_password'
            ];
            let valid = true;
            requiredStep2.forEach(id => {
                const el = document.getElementById(id);
                let errorMsg = el.parentNode.querySelector('.error-message');
                if (errorMsg) errorMsg.remove();
                if (!el.value.trim()) {
                    el.classList.add('ring-2', 'ring-red-500', 'focus:ring-red-500', 'focus:border-red-500');
                    errorMsg = document.createElement('span');
                    errorMsg.className = 'text-red-500 text-sm mt-1 error-message';
                    errorMsg.innerText = 'Este campo es obligatorio';
                    if (el.parentNode.classList.contains('relative')) {
                        el.parentNode.appendChild(errorMsg);
                    } else {
                        el.parentNode.insertBefore(errorMsg, el.nextSibling);
                    }
                    valid = false;
                } else {
                    el.classList.remove('ring-2', 'ring-red-500', 'focus:ring-red-500', 'focus:border-red-500');
                }
            });

            // Mostrar mensaje general si faltan correo o contraseñas
            const email = document.getElementById('email');
            const password = document.getElementById('password');
            const confirmPassword = document.getElementById('confirm_password');
            if (!email.value.trim() || !password.value.trim() || !confirmPassword.value.trim()) {
                if (!document.getElementById('step2-general-error')) {
                    const step2Div = document.getElementById('step2');
                    const generalError = document.createElement('div');
                    generalError.id = 'step2-general-error';
                    generalError.className = 'text-red-500 text-base font-semibold mb-2 error-message';
                    generalError.innerText = 'Por favor completa el correo y ambas contraseñas.';
                    step2Div.insertBefore(generalError, step2Div.firstChild);
                }
            } else {
                const generalError = document.getElementById('step2-general-error');
                if (generalError) generalError.remove();
            }

            // Validar que las contraseñas coincidan
            const pass = document.getElementById('password');
            const conf = document.getElementById('confirm_password');
            if (pass.value !== conf.value) {
                let errorMsg = conf.parentNode.querySelector('.error-message');
                if (errorMsg) errorMsg.remove();
                conf.classList.add('ring-2', 'ring-red-500', 'focus:ring-red-500', 'focus:border-red-500');
                errorMsg = document.createElement('span');
                errorMsg.className = 'text-red-500 text-sm mt-1 error-message';
                errorMsg.innerText = 'Las contraseñas no coinciden';
                if (conf.parentNode.classList.contains('relative')) {
                    conf.parentNode.appendChild(errorMsg);
                } else {
                    conf.parentNode.insertBefore(errorMsg, conf.nextSibling);
                }
                valid = false;
                alert('Las contraseñas no coinciden.');
            } else {
                let errorMsg = conf.parentNode.querySelector('.error-message');
                if (errorMsg && errorMsg.innerText === 'Las contraseñas no coinciden') errorMsg.remove();
            }

            // Validar seguridad de la contraseña: mínimo 8 caracteres y al menos 1 número
            const passwordValue = pass.value;
            const passwordRegex = /^(?=.*\d).{8,}$/;
            if (!passwordRegex.test(passwordValue)) {
                let errorMsg = pass.parentNode.querySelector('.error-message');
                if (errorMsg) errorMsg.remove();
                pass.classList.add('ring-2', 'ring-red-500', 'focus:ring-red-500', 'focus:border-red-500');
                errorMsg = document.createElement('span');
                errorMsg.className = 'text-red-500 text-sm mt-1 error-message';
                errorMsg.innerText = 'La contraseña debe tener al menos 8 caracteres y al menos 1 número';
                if (pass.parentNode.classList.contains('relative')) {
                    pass.parentNode.appendChild(errorMsg);
                } else {
                    pass.parentNode.insertBefore(errorMsg, pass.nextSibling);
                }
                valid = false;
                alert('La contraseña debe tener al menos 8 caracteres y al menos 1 número.');
            } else {
                let errorMsg = pass.parentNode.querySelector('.error-message');
                if (errorMsg && errorMsg.innerText === 'La contraseña debe tener al menos 8 caracteres y al menos 1 número') errorMsg.remove();
                pass.classList.remove('ring-2', 'ring-red-500', 'focus:ring-red-500', 'focus:border-red-500');
            }

            if (!valid) {
                e.preventDefault();
                alert('Por favor completa todos los campos obligatorios antes de registrarte.');
            }
        }
    });

    // Mostrar/ocultar contraseña y confirmar contraseña
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm_password');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const toggleConfirmPasswordBtn = document.getElementById('toggleConfirmPassword');
    const passwordIcon = togglePasswordBtn.querySelector('i');
    const confirmPasswordIcon = toggleConfirmPasswordBtn.querySelector('i');

    togglePasswordBtn.addEventListener('click', () => {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            passwordIcon.classList.remove('bi-eye-slash');
            passwordIcon.classList.add('bi-eye');
        } else {
            passwordInput.type = 'password';
            passwordIcon.classList.remove('bi-eye');
            passwordIcon.classList.add('bi-eye-slash');
        }
    });

    toggleConfirmPasswordBtn.addEventListener('click', () => {
        if (confirmPasswordInput.type === 'password') {
            confirmPasswordInput.type = 'text';
            confirmPasswordIcon.classList.remove('bi-eye-slash');
            confirmPasswordIcon.classList.add('bi-eye');
        } else {
            confirmPasswordInput.type = 'password';
            confirmPasswordIcon.classList.remove('bi-eye');
            confirmPasswordIcon.classList.add('bi-eye-slash');
        }
    });
});