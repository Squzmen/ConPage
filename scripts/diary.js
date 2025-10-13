// Diary functionality
document.addEventListener('DOMContentLoaded', function() {
    const diaryForm = document.getElementById('diaryForm');
    
    if (diaryForm) {
        diaryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const date = document.getElementById('entryDate').value;
            const title = document.getElementById('entryTitle').value;
            const description = document.getElementById('entryDescription').value;
            
            if (date && title && description) {
                addNewEntry(date, title, description);
                diaryForm.reset();
                
                // Показать уведомление
                showNotification('Запись успешно добавлена!', 'success');
            } else {
                showNotification('Пожалуйста, заполните все поля', 'error');
            }
        });
    }
    
    // Устанавливаем сегодняшнюю дату по умолчанию
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('entryDate');
    if (dateInput) {
        dateInput.value = today;
    }
});

function addNewEntry(date, title, description) {
    const timeline = document.querySelector('.timeline');
    
    // Форматируем дату
    const formattedDate = new Date(date).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    
    const newEntry = document.createElement('div');
    newEntry.className = 'timeline-item';
    newEntry.innerHTML = `
        <div class="timeline-date">${formattedDate}</div>
        <div class="timeline-content">
            <h5>${title}</h5>
            <p>${description}</p>
            <div class="status-badge in-progress">
                <i class="bi bi-arrow-repeat"></i> В процессе
            </div>
        </div>
    `;
    
    // Вставляем новую запись в начало
    timeline.insertBefore(newEntry, timeline.firstChild);
    
    // Добавляем анимацию появления
    newEntry.style.opacity = '0';
    newEntry.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        newEntry.style.transition = 'all 0.5s ease';
        newEntry.style.opacity = '1';
        newEntry.style.transform = 'translateY(0)';
    }, 100);
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '9999';
    notification.style.minWidth = '300px';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Автоматически скрываем через 3 секунды
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}