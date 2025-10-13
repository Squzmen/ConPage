class MatrixGrid {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.cells = [];
        this.fontSize = 56; // Увеличили в 4 раза (было 14)
        this.columns = 0;
        this.rows = 0;
        
        this.baseOpacity = 0.03; // Сделали нули более прозрачными
        this.glowOpacity = 0.8;  // Максимальная прозрачность при анимации
        
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
        
        // Пересчитываем колонки и строки при изменении размера
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
                    state: 'idle', // 'idle', 'lighting', 'one', 'dimming'
                    progress: 0,
                    delay: 0
                });
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

            // Устанавливаем цвет в зависимости от состояния
            if (cell.state === 'one') {
                // Ярко-зеленый для единицы без подсветки
                this.ctx.fillStyle = `rgba(102, 255, 0, ${cell.opacity})`;
            } else {
                // Очень прозрачный для нулей
                this.ctx.fillStyle = `rgba(100, 255, 100, ${cell.opacity})`;
            }

            // Убираем все тени и свечения
            this.ctx.shadowBlur = 0;
            this.ctx.shadowColor = 'transparent';

            this.ctx.fillText(cell.value, cell.x + this.fontSize/2, cell.y + this.fontSize/2);
        });
    }

    update() {
        this.cells.forEach(cell => {
            // Уменьшили шанс начать анимацию в 5 раз (было 0.0005, стало 0.0001)
            if (cell.state === 'idle' && Math.random() < 0.0002) {
                cell.state = 'lighting';
                cell.progress = 0;
            }

            // Обработка разных состояний анимации
            switch (cell.state) {
                case 'lighting':
                    // Увеличиваем прозрачность до максимума за 1 секунду (60 кадров)
                    cell.progress += 1/60;
                    cell.opacity = this.baseOpacity + (this.glowOpacity - this.baseOpacity) * cell.progress;
                    
                    if (cell.progress >= 1) {
                        cell.state = 'one';
                        cell.value = '1';
                        cell.progress = 0;
                        // Устанавливаем задержку в 5 секунд (300 кадров при 60fps)
                        cell.delay = 300;
                    }
                    break;

                case 'one':
                    // Ждем 5 секунд
                    cell.delay--;
                    if (cell.delay <= 0) {
                        cell.state = 'dimming';
                        cell.progress = 0;
                    }
                    break;

                case 'dimming':
                    // Уменьшаем прозрачность обратно до базовой за 1 секунду
                    cell.progress += 1/60;
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
    new MatrixGrid(canvas);
});