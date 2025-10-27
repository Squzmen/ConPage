class MatrixGrid {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.cells = [];
        
        // Адаптивный размер шрифта
        this.fontSize = window.innerWidth < 768 ? 28 : 56;
        
        this.columns = 0;
        this.rows = 0;
        
        this.baseOpacity = 0.03;
        this.glowOpacity = 0.8;
        
        // Оптимальная частота появления единиц
        this.animationChance = 0.0008;
        
        this.init();
        this.animate();
        this.setupEventListeners();
    }

    init() {
        this.resize();
        this.createGrid();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Адаптивный размер шрифта при ресайзе
        this.fontSize = window.innerWidth < 768 ? 28 : 56;
        
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        this.rows = Math.floor(this.canvas.height / this.fontSize);
    }

    createGrid() {
        this.cells = [];
        
        for (let x = 0; x < this.columns; x++) {
            for (let y = 0; y < this.rows; y++) {
                this.cells.push({
                    x: x * this.fontSize,
                    y: y * this.fontSize,
                    value: '0',
                    opacity: this.baseOpacity,
                    state: 'idle',
                    progress: 0,
                    delay: 0,
                    speed: 0.5 + Math.random() * 0.5
                });
            }
        }
        
        // Сразу запускаем несколько анимаций при создании
        this.startInitialAnimations();
    }

    // Запускаем начальные анимации
    startInitialAnimations() {
        const initialAnimations = Math.min(20, this.cells.length * 0.1);
        for (let i = 0; i < initialAnimations; i++) {
            const randomCell = this.cells[Math.floor(Math.random() * this.cells.length)];
            if (randomCell.state === 'idle') {
                randomCell.state = 'lighting';
                randomCell.progress = 0;
            }
        }
    }

    draw() {
        // Очищаем canvas с легким затемнением для плавности
        this.ctx.fillStyle = 'rgba(5, 5, 5, 0.02)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.font = `bold ${this.fontSize}px "Courier New", monospace`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        this.cells.forEach(cell => {
            // Пропускаем отрисовку если прозрачность очень низкая
            if (cell.opacity < 0.01) return;

            // Устанавливаем цвет - БЕЗ СВЕЧЕНИЯ для единиц
            if (cell.state === 'one') {
                // Ярко-зеленый для единицы без подсветки
                this.ctx.fillStyle = `rgba(102, 255, 0, ${cell.opacity})`;
            } else {
                // Очень прозрачный для нулей
                this.ctx.fillStyle = `rgba(100, 255, 100, ${cell.opacity})`;
            }

            this.ctx.fillText(cell.value, cell.x + this.fontSize/2, cell.y + this.fontSize/2);
        });
    }

    update() {
        let activeAnimations = 0;
        
        this.cells.forEach(cell => {
            // Считаем активные анимации
            if (cell.state !== 'idle') {
                activeAnimations++;
            }

            // Увеличиваем шанс анимации если мало активных
            let currentChance = this.animationChance;
            if (activeAnimations < this.cells.length * 0.02) {
                currentChance *= 2;
            }

            if (cell.state === 'idle' && Math.random() < currentChance) {
                cell.state = 'lighting';
                cell.progress = 0;
            }

            // Обработка разных состояний анимации
            switch (cell.state) {
                case 'lighting':
                    cell.progress += (1/60) * cell.speed;
                    cell.opacity = this.baseOpacity + (this.glowOpacity - this.baseOpacity) * cell.progress;
                    
                    if (cell.progress >= 1) {
                        cell.state = 'one';
                        cell.value = '1';
                        cell.progress = 0;
                        // Задержка от 2 до 6 секунд
                        cell.delay = 120 + Math.random() * 240;
                    }
                    break;

                case 'one':
                    cell.delay--;
                    if (cell.delay <= 0) {
                        cell.state = 'dimming';
                        cell.progress = 0;
                    }
                    break;

                case 'dimming':
                    cell.progress += (1/60) * cell.speed;
                    cell.opacity = this.glowOpacity - (this.glowOpacity - this.baseOpacity) * cell.progress;
                    
                    if (cell.progress >= 1) {
                        cell.state = 'idle';
                        cell.value = '0';
                        cell.opacity = this.baseOpacity;
                        cell.progress = 0;
                    }
                    break;
            }
        });
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createGrid();
        });
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('matrix');
    if (canvas) {
        new MatrixGrid(canvas);
    }
});