// projects.js
document.addEventListener('DOMContentLoaded', function() {
    const projectsGrid = document.getElementById('projects-grid');
    const filterButtons = document.querySelectorAll('.filter-buttons .btn');

    const projects = [
        // Проекты из index.html
        {
            id: 1,
            title: "Commerce Platform",
            description: "Полнофункциональная платформа для продаж всего, что нельзя продать",
            image: "../images/Babuska.jpg",
            category: "web",
            technologies: ["Стул", "Картонка", "Наивность"],
            status: "Заброшен",
            absurdity: "90%"
        },
        {
            id: 2,
            title: "Тактический менеджер",
            description: "Умный менеджер задач, который сам создает задачи, чтобы потом их решать",
            image: "../images/Taktika.jpg",
            category: "ai",
            technologies: ["3 бутылки пива", "Скотч", "Иллюзия контроля"],
            status: "В разработке",
            absurdity: "95%"
        },
        {
            id: 3,
            title: "War Analytics",
            description: "Инструмент для визуализации данных о том, кто кого победит в соседнем подъезде",
            image: "../images/i.webp",
            category: "data",
            technologies: ["Бредли", "Абрамс", "Воображение"],
            status: "Завершен",
            absurdity: "85%"
        },
        {
            id: 4,
            title: "Анализатор рынка",
            description: "Мобильное приложение, которое точно знает, что акции падают потому что сегодня вторник",
            image: "../images/Menty.jpg",
            category: "mobile",
            technologies: ["Валера", "Прогноз погоды", "Монетка"],
            status: "В продакшене",
            absurdity: "88%"
        },
        
        // Новые абсурдные проекты
        {
            id: 5,
            title: "AI для поиска пульта",
            description: "Нейросеть, которая определяет где лежит пульт с точностью ±3 метра",
            image: "../images/Pult.jpg",
            category: "ai",
            technologies: ["TensorFlow", "Домыслы", "Метод тыка"],
            status: "В разработке",
            absurdity: "98%"
        },
        {
            id: 6,
            title: "Blockchain для котов",
            description: "Децентрализованная система учета количества съеденного корма",
            image: "../images/kot.webp",
            category: "web",
            technologies: ["Solidity", "Мяу-токен", "Когтеточка"],
            status: "Концепт",
            absurdity: "99%"
        },
        {
            id: 7,
            title: "Умный будильник",
            description: "Будильник, который понимает, что вы не выспались и сам откладывает звонок",
            image: "../images/bydilnik.webp",
            category: "mobile",
            technologies: ["React Native", "Сонливость", "Кнопка 'Еще 5 минут'"],
            status: "В продакшене",
            absurdity: "92%"
        },
        {
            id: 8,
            title: "VR для растений",
            description: "Виртуальная реальность кактусам, чтобы им не было скучно на подоконнике",
            image: "../images/orig.webp",
            category: "game",
            technologies: ["Unity", "Фотосинтез", "Полив"],
            status: "Альфа",
            absurdity: "100%"
        },
        {
            id: 9,
            title: "Крипто-тамагочи",
            description: "Цифровой питомец, который майнит криптовалюту вместо того, чтобы есть",
            image: "../images/homak.webp",
            category: "mobile",
            technologies: ["Dart", "Flutter", "Холодный кошелек"],
            status: "Бета",
            absurdity: "96%"
        },
    ];

    // Функция для отрисовки проектов
    function renderProjects(filter = 'all') {
        projectsGrid.innerHTML = '';
        
        const filteredProjects = filter === 'all' 
            ? projects 
            : projects.filter(project => project.category === filter);

        filteredProjects.forEach(project => {
            const projectCol = document.createElement('div');
            projectCol.className = 'col-md-6 col-lg-4 mb-4';
            projectCol.setAttribute('data-category', project.category);

            const technologiesHTML = project.technologies.map(tech => 
                `<span class="badge bg-primary me-1 mb-1">${tech}</span>`
            ).join('');

            projectCol.innerHTML = `
                <div class="project-card">
                    <div class="project-image image-container ratio-4-3">
                        <picture>
                            <source media="(min-width: 1200px)" srcset="${project.image}">
                            <source media="(min-width: 768px)" srcset="${project.image}">
                            <img src="${project.image}" 
                                 alt="${project.title}"
                                 class="responsive-img object-fit-cover"
                                 loading="lazy"
                                 width="400"
                                 height="300">
                        </picture>
                        <div class="project-overlay">
                            <div class="project-tech">
                                ${technologiesHTML}
                            </div>
                        </div>
                    </div>
                    <div class="project-content">
                        <h5>${project.title}</h5>
                        <p class="adaptive-text">${project.description}</p>
                        <div class="project-meta mt-3">
                            <span class="badge bg-purple me-2">Абсурдность: ${project.absurdity}</span>
                            <span class="badge ${getStatusBadgeClass(project.status)}">${project.status}</span>
                        </div>
                    </div>
                </div>
            `;

            projectsGrid.appendChild(projectCol);
        });

        // Инициализируем оптимизацию загрузки
        optimizeImageLoading();
    }

    // Функция для получения класса бейджа статуса
    function getStatusBadgeClass(status) {
        const statusClasses = {
            'Завершен': 'bg-success',
            'В разработке': 'bg-warning',
            'В продакшене': 'bg-info',
            'Заброшен': 'bg-danger',
            'Концепт': 'bg-secondary',
            'Альфа': 'bg-primary',
            'Бета': 'bg-primary'
        };
        return statusClasses[status] || 'bg-secondary';
    }

    // Инициализация фильтров
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Убираем активный класс у всех кнопок
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');
            // Получаем фильтр
            const filter = this.getAttribute('data-filter');
            // Отрисовываем проекты
            renderProjects(filter);
        });
    });

    // Оптимизация загрузки изображений
    function optimizeImageLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        // Intersection Observer для lazy loading
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.classList.remove('lazy-img');
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => {
                img.classList.add('lazy-img');
                imageObserver.observe(img);
            });
        }
    }

    // Адаптивная инициализация проектов
    function initProjects() {
        // Перерисовываем проекты при изменении размера окна
        window.addEventListener('resize', function() {
            renderProjects(getCurrentFilter());
        });
    }

    function getCurrentFilter() {
        const activeButton = document.querySelector('.filter-buttons .btn.active');
        return activeButton ? activeButton.getAttribute('data-filter') : 'all';
    }

    // Инициализация адаптивных фильтров
    function initAdaptiveFilters() {
        const filterContainer = document.querySelector('.filter-buttons');
        if (filterContainer) {
            // Контейнерные запросы для фильтров
            if (CSS.supports('container-type: inline-size')) {
                filterContainer.style.containerType = 'inline-size';
            }
        }
    }

    // Fallback для контейнерных запросов
    function initContainerQueriesFallback() {
        if (!CSS.supports('container-type: inline-size')) {
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

    // Первоначальная отрисовка и инициализация
    renderProjects();
    initProjects();
    initAdaptiveFilters();
    initContainerQueriesFallback();
    
    // Добавляем обработчик для touch устройств
    if ('ontouchstart' in window) {
        document.addEventListener('touchstart', function() {}, {passive: true});
    }
});