// scripts/main.js - новый файл
document.addEventListener('DOMContentLoaded', function() {
    // Адаптивная навигация
    const navbar = document.querySelector('.custom-navbar');
    const navbarToggler = document.querySelector('.navbar-toggler');
    
    if (navbarToggler) {
        navbarToggler.addEventListener('click', function() {
            navbar.classList.toggle('navbar-expanded');
        });
    }
    
    // Закрытие меню при клике на ссылку (на мобильных)
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth < 768) {
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }
            }
        });
    });
    
    // Плавная прокрутка для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Добавление класса для анимации загрузки
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });
    
    // Адаптивное поведение для матричного фона
    function adaptMatrixForMobile() {
        const canvas = document.getElementById('matrix');
        if (canvas && window.innerWidth < 768) {
            canvas.style.opacity = '0.2';
        } else if (canvas) {
            canvas.style.opacity = '0.3';
        }
    }
    
    // Инициализация адаптации матрицы
    adaptMatrixForMobile();
    window.addEventListener('resize', adaptMatrixForMobile);
    
    // Улучшение доступности для клавиатуры
    document.addEventListener('keydown', function(e) {
        // Закрытие меню по ESC
        if (e.key === 'Escape') {
            const openMenu = document.querySelector('.navbar-collapse.show');
            if (openMenu) {
                navbarToggler.click();
            }
        }
    });
    
    // Оптимизация для touch устройств
    if ('ontouchstart' in window) {
        document.documentElement.classList.add('touch-device');
        
        // Улучшение отзывчивости для touch
        const buttons = document.querySelectorAll('.btn, .nav-link, .project-card');
        buttons.forEach(button => {
            button.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            });
            
            button.addEventListener('touchend', function() {
                this.classList.remove('touch-active');
            });
        });
    }
    
    // Предотвращение скачков контента при загрузке изображений
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', function() {
                this.classList.add('loaded');
            });
        }
    });
    
    // Адаптация временной шкалы для мобильных
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
    
    // Инициализация адаптации временной шкалы
    if (document.querySelector('.timeline')) {
        adaptTimelineForMobile();
        window.addEventListener('resize', adaptTimelineForMobile);
    }
    
    // Улучшение форм для мобильных
    function adaptFormsForMobile() {
        const forms = document.querySelectorAll('form');
        const isMobile = window.innerWidth < 768;
        
        forms.forEach(form => {
            form.classList.add('adaptive-form');
            if (isMobile) {
                form.style.fontSize = '16px'; // Предотвращает зум в iOS
            } else {
                form.style.fontSize = '';
            }
        });
    }
    
    // Инициализация адаптации форм
    adaptFormsForMobile();
    window.addEventListener('resize', adaptFormsForMobile);

    // Адаптивные изображения
    function initResponsiveImages() {
        // Добавляем обработчики для адаптивных изображений
        const images = document.querySelectorAll('img.responsive-img');
        
        images.forEach(img => {
            // Добавляем обработку ошибок загрузки
            img.addEventListener('error', function() {
                console.warn('Изображение не загружено:', this.src);
                this.alt = 'Изображение не загружено';
            });
            
            // Добавляем lazy loading для старых браузеров
            if ('loading' in HTMLImageElement.prototype) {
                img.loading = 'lazy';
            }
        });
    }

    // Контейнерные запросы fallback
    function initContainerQueries() {
        // Проверяем поддержку контейнерных запросов
        if (!CSS.supports('container-type: inline-size')) {
            // Fallback для браузеров без поддержки контейнерных запросов
            document.querySelectorAll('.project-card').forEach(card => {
                const width = card.offsetWidth;
                if (width < 400) {
                    card.classList.add('mobile-layout');
                }
            });
            
            window.addEventListener('resize', function() {
                document.querySelectorAll('.project-card').forEach(card => {
                    const width = card.offsetWidth;
                    if (width < 400) {
                        card.classList.add('mobile-layout');
                    } else {
                        card.classList.remove('mobile-layout');
                    }
                });
            });
        }
    }

    // Скачивание резюме
    function initResumeDownload() {
        const resumeBtn = document.querySelector('.resume-download .btn');
        if (resumeBtn) {
            resumeBtn.addEventListener('click', function(e) {
                // Можно добавить analytics или подтверждение
                console.log('Скачивание резюме инициировано');
                
                // Временная анимация загрузки
                const originalHTML = this.innerHTML;
                this.innerHTML = '<i class="bi bi-cloud-download"></i> Скачивание...';
                this.disabled = true;
                
                setTimeout(() => {
                    this.innerHTML = originalHTML;
                    this.disabled = false;
                }, 2000);
            });
            
            // Добавляем класс для анимации после загрузки
            setTimeout(() => {
                resumeBtn.classList.add('loaded');
            }, 1000);
        }
    }

    // Инициализируем все адаптивные функции
    initResponsiveImages();
    initContainerQueries();
    initResumeDownload();
    
    console.log('DevPort адаптивный скрипт загружен успешно!');
});