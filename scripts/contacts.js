// Contacts form functionality
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            if (name && email && subject && message) {
                // Здесь будет отправка формы на сервер
                simulateFormSubmission(name, email, subject, message);
                contactForm.reset();
                
                showNotification('Сообщение отправлено! Я свяжусь с вами в ближайшее время.', 'success');
            } else {
                showNotification('Пожалуйста, заполните все поля', 'error');
            }
        });
    }
});

function simulateFormSubmission(name, email, subject, message) {
    // В реальном проекте здесь будет AJAX запрос к серверу
    console.log('Форма отправлена:', { name, email, subject, message });
    
    // Добавляем анимацию успешной отправки
    const submitBtn = document.querySelector('#contactForm button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="bi bi-check-circle"></i> Отправлено!';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 3000);
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '9999';
    notification.style.minWidth = '300px';
    notification.style.background = type === 'success' ? 'rgba(0, 255, 65, 0.1)' : 'rgba(220, 53, 69, 0.1)';
    notification.style.border = type === 'success' ? '1px solid rgba(0, 255, 65, 0.3)' : '1px solid rgba(220, 53, 69, 0.3)';
    notification.style.color = 'white';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Автоматически скрываем через 5 секунд
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}