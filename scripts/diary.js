// Enhanced diary functionality with improved validation
document.addEventListener('DOMContentLoaded', function() {
    const diaryForm = document.getElementById('diaryForm');
    const diaryStatus = document.getElementById('diary-status');
    
    if (diaryForm) {
        // Clear any existing invalid states on page load
        const inputs = diaryForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.classList.remove('is-invalid');
        });

        // Real-time validation - only validate on blur and submit
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateDiaryField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('is-invalid')) {
                    validateDiaryField(this);
                }
            });
        });

        diaryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const date = document.getElementById('entryDate').value;
            const title = document.getElementById('entryTitle').value.trim();
            const description = document.getElementById('entryDescription').value.trim();
            
            // Validate all fields
            let isValid = true;
            const inputs = diaryForm.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                if (!validateDiaryField(input)) {
                    isValid = false;
                }
            });
            
            if (isValid) {
                addNewEntry(date, title, description);
                diaryForm.reset();
                
                // Reset today's date
                const today = new Date().toISOString().split('T')[0];
                const dateInput = document.getElementById('entryDate');
                if (dateInput) {
                    dateInput.value = today;
                }
                
                showNotification('Запись успешно добавлена!', 'success');
            } else {
                // Focus first invalid field
                const firstInvalid = diaryForm.querySelector('.is-invalid');
                if (firstInvalid) {
                    firstInvalid.focus();
                }
                
                showNotification('Пожалуйста, заполните все поля корректно', 'error');
            }
        });
    }
    
    // Устанавливаем сегодняшнюю дату по умолчанию
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('entryDate');
    if (dateInput) {
        dateInput.value = today;
        dateInput.max = today;
    }
});

function validateDiaryField(field) {
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
    
    // Date validation
    else if (field.type === 'date' && value) {
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate > today) {
            isValid = false;
            errorMessage = 'Дата не может быть в будущем';
        }
    }
    
    // Title validation
    else if (field.id === 'entryTitle' && value) {
        if (value.length < 3) {
            isValid = false;
            errorMessage = 'Тема должна содержать минимум 3 символа';
        } else if (value.length > 100) {
            isValid = false;
            errorMessage = 'Тема не должна превышать 100 символов';
        }
    }
    
    // Description validation
    else if (field.id === 'entryDescription' && value) {
        if (value.length < 10) {
            isValid = false;
            errorMessage = 'Описание должно содержать минимум 10 символов';
        } else if (value.length > 1000) {
            isValid = false;
            errorMessage = 'Описание не должно превышать 1000 символов';
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
    newEntry.setAttribute('role', 'listitem');
    newEntry.innerHTML = `
        <div class="timeline-date">${formattedDate}</div>
        <div class="timeline-content">
            <h3>${title}</h3>
            <p>${description}</p>
            <div class="status-badge in-progress">
                <i class="bi bi-arrow-repeat" aria-hidden="true"></i> 
                <span>В процессе</span>
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
    notification.setAttribute('role', type === 'success' ? 'status' : 'alert');
    notification.setAttribute('aria-live', 'polite');
    notification.setAttribute('aria-atomic', 'true');
    
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '9999';
    notification.style.minWidth = '300px';
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="bi ${type === 'success' ? 'bi-check-circle' : 'bi-exclamation-triangle'} me-2" aria-hidden="true"></i>
            <span>${message}</span>
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Закрыть уведомление"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Автоматически скрываем через 5 секунд
    setTimeout(() => {
        if (notification.parentNode) {
            const bsAlert = new bootstrap.Alert(notification);
            bsAlert.close();
        }
    }, 5000);
}

// Адаптивные функции для дневника
function adaptTimelineForMobile() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const isMobile = window.innerWidth < 768;
    
    timelineItems.forEach(item => {
        if (isMobile) {
            item.style.paddingLeft = '2rem';
        } else {
            item.style.paddingLeft = '';
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    adaptTimelineForMobile();
    window.addEventListener('resize', adaptTimelineForMobile);
});