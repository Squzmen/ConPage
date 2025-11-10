// Enhanced contacts form functionality with improved validation
document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('form-status');
    const charCount = document.getElementById('charCount');
    const messageInput = document.getElementById('message');

    // Character counter for message
    if (messageInput && charCount) {
        messageInput.addEventListener('input', function () {
            const remaining = 1000 - this.value.length;
            charCount.textContent = remaining;
            
            // Update ARIA attributes for accessibility
            if (remaining < 100) {
                this.setAttribute('aria-describedby', 'messageHelp messageWarning');
                
                // Create warning element if it doesn't exist
                if (!document.getElementById('messageWarning')) {
                    const warning = document.createElement('div');
                    warning.id = 'messageWarning';
                    warning.className = 'form-text text-warning';
                    warning.textContent = `Осталось мало символов: ${remaining}`;
                    messageInput.parentNode.appendChild(warning);
                } else {
                    document.getElementById('messageWarning').textContent = 
                        `Осталось мало символов: ${remaining}`;
                }
            } else {
                // Remove warning if it exists
                const warning = document.getElementById('messageWarning');
                if (warning) {
                    warning.remove();
                }
            }
        });
    }

    if (contactForm) {
        // Real-time validation - only validate on blur and submit
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            // Remove any existing invalid states on page load
            input.classList.remove('is-invalid');
            
            input.addEventListener('blur', function () {
                validateField(this);
            });
            
            // Validate on input only if field was previously invalid
            input.addEventListener('input', function () {
                if (this.classList.contains('is-invalid')) {
                    validateField(this);
                }
            });
        });

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Validate all fields
            let isValid = true;
            let firstInvalidField = null;
            
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                    if (!firstInvalidField) {
                        firstInvalidField = input;
                    }
                }
            });

            if (isValid) {
                const formData = {
                    name: document.getElementById('name').value.trim(),
                    email: document.getElementById('email').value.trim(),
                    subject: document.getElementById('subject').value.trim(),
                    message: document.getElementById('message').value.trim()
                };

                submitForm(formData);
            } else {
                // Focus first invalid field
                if (firstInvalidField) {
                    firstInvalidField.focus();
                }
                
                showNotification('Пожалуйста, исправьте ошибки в форме', 'error');
            }
        });
    }
});

function validateField(field) {
    const errorElement = document.getElementById(field.id + 'Error');
    const value = field.value.trim();
    
    // Clear previous validation states
    field.classList.remove('is-invalid', 'is-valid');
    
    // Clear error message
    if (errorElement) {
        errorElement.textContent = '';
    }
    
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        const fieldName = field.labels[0]?.textContent?.replace('*', '').trim() || 'Это поле';
        errorMessage = `${fieldName} обязательно для заполнения`;
    }
    
    // Email validation
    else if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Пожалуйста, введите корректный email адрес';
        }
    }
    
    // Name validation
    else if (field.id === 'name' && value) {
        if (value.length < 2) {
            isValid = false;
            errorMessage = 'Имя должно содержать минимум 2 символа';
        } else if (!/^[a-zA-Zа-яА-ЯёЁ\s\-]+$/.test(value)) {
            isValid = false;
            errorMessage = 'Имя может содержать только буквы, пробелы и дефисы';
        }
    }
    
    // Subject validation
    else if (field.id === 'subject' && value) {
        if (value.length < 5) {
            isValid = false;
            errorMessage = 'Тема должна содержать минимум 5 символов';
        }
    }
    
    // Message validation
    else if (field.id === 'message' && value) {
        if (value.length < 10) {
            isValid = false;
            errorMessage = 'Сообщение должно содержать минимум 10 символов';
        }
    }
    
    // Apply validation state
    if (!isValid) {
        field.classList.add('is-invalid');
        if (errorElement) {
            errorElement.textContent = errorMessage;
        }
    } else if (value) {
        field.classList.add('is-valid');
    }
    
    return isValid;
}

function submitForm(formData) {
    const submitBtn = document.querySelector('#contactForm button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    // Update button state
    submitBtn.innerHTML = '<i class="bi bi-arrow-repeat spinner" aria-hidden="true"></i> Отправка...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        console.log('Форма отправлена:', formData);
        
        // Reset form
        contactForm.reset();
        
        // Reset character counter
        const charCount = document.getElementById('charCount');
        if (charCount) {
            charCount.textContent = '1000';
        }
        
        // Reset validation states
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.classList.remove('is-invalid', 'is-valid');
        });
        
        // Remove warning messages
        const warning = document.getElementById('messageWarning');
        if (warning) {
            warning.remove();
        }
        
        // Restore button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        showNotification('Сообщение отправлено! Я свяжусь с вами в ближайшее время.', 'success');
        
    }, 2000);
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`;
    notification.setAttribute('role', type === 'success' ? 'status' : 'alert');
    notification.setAttribute('aria-live', 'assertive');
    notification.setAttribute('aria-atomic', 'true');
    
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '9999';
    notification.style.minWidth = '300px';
    notification.style.background = type === 'success' ? 'rgba(0, 255, 65, 0.1)' : 'rgba(220, 53, 69, 0.1)';
    notification.style.border = type === 'success' ? '1px solid rgba(0, 255, 65, 0.3)' : '1px solid rgba(220, 53, 69, 0.3)';
    notification.style.color = 'white';
    
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="bi ${type === 'success' ? 'bi-check-circle' : 'bi-exclamation-triangle'} me-2" aria-hidden="true"></i>
            <span>${message}</span>
        </div>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert" aria-label="Закрыть уведомление"></button>
    `;

    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            const bsAlert = new bootstrap.Alert(notification);
            bsAlert.close();
        }
    }, 5000);
}

// Mobile adaptation
function adaptContactForm() {
    const contactForm = document.getElementById('contactForm');
    const isMobile = window.innerWidth < 768;

    if (contactForm && isMobile) {
        contactForm.style.fontSize = '16px';
        
        const inputs = contactForm.querySelectorAll('input, textarea, button');
        inputs.forEach(input => {
            input.style.minHeight = '44px';
        });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    adaptContactForm();
    window.addEventListener('resize', adaptContactForm);
});