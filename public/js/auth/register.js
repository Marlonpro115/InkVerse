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
        if (!el.value.trim()) {
            el.classList.add('ring-2', 'ring-red-500');
            valid = false;
        } else {
            el.classList.remove('ring-2', 'ring-red-500');
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
            if (!el.value.trim()) {
                el.classList.add('ring-2', 'ring-red-500');
                valid = false;
            } else {
                el.classList.remove('ring-2', 'ring-red-500');
            }
        });

        // Validar que las contraseñas coincidan
        const pass = document.getElementById('password');
        const conf = document.getElementById('confirm_password');
        if (pass.value !== conf.value) {
            conf.classList.add('ring-2', 'ring-red-500');
            valid = false;
            alert('Las contraseñas no coinciden.');
        }

        // Validar seguridad de la contraseña: mínimo 8 caracteres y al menos 1 número
        const passwordValue = pass.value;
        const passwordRegex = /^(?=.*\d).{8,}$/;
        if (!passwordRegex.test(passwordValue)) {
            pass.classList.add('ring-2', 'ring-red-500');
            valid = false;
            alert('La contraseña debe tener al menos 8 caracteres y al menos 1 número.');
        } else {
            pass.classList.remove('ring-2', 'ring-red-500');
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