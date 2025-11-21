// Глобальные переменные
let scrollY = 0;
let maxScroll = 0;
let isScrolling = false;
let particles = [];
let canvas, ctx;

// DOM элементы
const scene = document.getElementById('scene');
const character = document.getElementById('character');
const fog = document.getElementById('fog');
const glowingText = document.getElementById('glowing-text');
const thoughts = document.getElementById('thoughts');
const fork = document.getElementById('fork');
const dustCanvas = document.getElementById('dust-canvas');

// Инициализация
document.addEventListener('DOMContentLoaded', init);

function init() {
    setupCanvas();
    createParticles();
    animateParticles();
    setupScroll();
    setupCorridorInteractions();
    
    // Показываем первую мысль через 3 секунды
    setTimeout(showRandomThought, 3000);
}

// Настройка canvas для частиц
function setupCanvas() {
    canvas = dustCanvas;
    ctx = canvas.getContext('2d');
    
    // Устанавливаем размеры canvas
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Создание частиц пыли
function createParticles() {
    particles = [];
    const particleCount = 100;
    
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            opacity: Math.random() * 0.5 + 0.1
        });
    }
}

// Анимация частиц
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        // Обновляем позицию
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Проверяем границы
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
        
        // Рисуем частицу
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 200, 220, ${particle.opacity})`;
        ctx.fill();
    });
    
    requestAnimationFrame(animateParticles);
}

// Настройка скролла
function setupScroll() {
    // Отключаем стандартный скролл
    document.body.style.overflow = 'hidden';
    
    // Вычисляем максимальный скролл
    maxScroll = document.body.scrollHeight - window.innerHeight;
    
    // Отслеживаем скролл
    window.addEventListener('scroll', handleScroll);
    
    // Инициализируем первый кадр
    handleScroll();
}

function handleScroll() {
    scrollY = window.scrollY;
    const scrollPercent = Math.min(scrollY / maxScroll, 1);
    
    // Обновляем элементы в зависимости от скролла
    updateScene(scrollPercent);
}

function updateScene(scrollPercent) {
    // Уменьшаем непрозрачность тумана
    const fogOpacity = 0.9 - (scrollPercent * 0.6);
    fog.style.opacity = fogOpacity;
    
    // Увеличиваем яркость света
    const brightness = 0.7 + (scrollPercent * 0.3);
    glowingText.style.opacity = brightness;
    glowingText.style.fontSize = `${1.2 + (scrollPercent * 0.3)}rem`;
    
    // Двигаем персонажа вверх при скролле
    character.style.top = `${50 - (scrollPercent * 20)}%`;
    
    // Анимация персонажа становится более выраженной
    character.style.animation = `breathe ${3 - (scrollPercent * 1.5)}s ease-in-out infinite`;
    
    // Показываем философские мысли на разных этапах скролла
    if (scrollPercent > 0.2 && scrollPercent < 0.8) {
        thoughts.style.opacity = Math.min((scrollPercent - 0.2) * 2.5, 1);
    } else if (scrollPercent >= 0.8) {
        thoughts.style.opacity = 1;
    } else {
        thoughts.style.opacity = 0;
    }
    
    // На 100% скролла показываем развилку
    if (scrollPercent >= 0.99) {
        scene.classList.add('scene-awakened');
        fork.classList.remove('hidden');
        scene.classList.add('scene-activated');
    } else {
        scene.classList.remove('scene-activated');
    }
}

// Показываем случайную мысль
function showRandomThought() {
    const thoughtElements = document.querySelectorAll('.thought');
    const randomIndex = Math.floor(Math.random() * thoughtElements.length);
    const randomThought = thoughtElements[randomIndex];
    
    // Показываем мысль
    randomThought.style.opacity = '1';
    randomThought.style.transition = 'opacity 1s ease';
    
    // Скрываем через 5 секунд
    setTimeout(() => {
        randomThought.style.opacity = '0';
    }, 5000);
    
    // Через 6 секунд показываем новую мысль
    setTimeout(showRandomThought, 6000);
}

// Настройка взаимодействия с коридорами
function setupCorridorInteractions() {
    const corridors = document.querySelectorAll('.corridor');
    
    corridors.forEach(corridor => {
        corridor.addEventListener('click', function() {
            const corridorId = this.id;
            
            // Добавляем класс перехода
            scene.classList.add('transitioning');
            
            // Анимация перехода в коридор
            animateTransitionToCorridor(corridorId);
        });
    });
}

// Анимация перехода в коридор
function animateTransitionToCorridor(corridorId) {
    // Используем GSAP для плавной анимации
    if (typeof gsap !== 'undefined') {
        // Анимация персонажа
        gsap.to(character, {
            x: corridorId === 'fear-corridor' ? '-300%' : 
               corridorId === 'freedom-corridor' ? '0%' : '300%',
            scale: 0.1,
            duration: 2,
            ease: 'power2.in',
            onComplete: function() {
                // После анимации показываем сообщение и готовимся к следующей сцене
                showTransitionMessage(corridorId);
            }
        });
        
        // Анимация затемнения
        gsap.to('body', {
            backgroundColor: '#000',
            duration: 2,
            ease: 'power2.in'
        });
        
        // Анимация развилки
        gsap.to(fork, {
            opacity: 0.1,
            duration: 2,
            ease: 'power2.in'
        });
    } else {
        // Резервная анимация если GSAP не загрузился
        setTimeout(() => {
            showTransitionMessage(corridorId);
        }, 2000);
    }
}

// Показываем сообщение при переходе
function showTransitionMessage(corridorId) {
    let message = '';
    
    switch(corridorId) {
        case 'fear-corridor':
            message = 'Страх... Ты потерялся во мраке.';
            break;
        case 'freedom-corridor':
            message = 'Свобода... Но куда идти без цели?';
            break;
        case 'meaning-corridor':
            message = 'Смысл... Ты чувствуешь, что это правильный путь.';
            break;
    }
    
    // Создаем элемент сообщения
    const messageEl = document.createElement('div');
    messageEl.textContent = message;
    messageEl.style.position = 'fixed';
    messageEl.style.top = '50%';
    messageEl.style.left = '50%';
    messageEl.style.transform = 'translate(-50%, -50%)';
    messageEl.style.color = 'white';
    messageEl.style.fontSize = '1.5rem';
    messageEl.style.textAlign = 'center';
    messageEl.style.zIndex = '100';
    messageEl.style.textShadow = '0 0 10px rgba(100, 150, 255, 0.8)';
    messageEl.style.opacity = '0';
    
    document.body.appendChild(messageEl);
    
    // Анимация появления
    if (typeof gsap !== 'undefined') {
        gsap.to(messageEl, {
            opacity: 1,
            duration: 1,
            onComplete: function() {
                // Через 3 секунды удаляем сообщение и готовимся к следующей сцене
                setTimeout(() => {
                    document.body.removeChild(messageEl);
                    
                    // Если выбран коридор смысла, начинаем подготовку к следующей главе
                    if (corridorId === 'meaning-corridor') {
                        prepareForNextChapter();
                    }
                }, 3000);
            }
        });
    } else {
        messageEl.style.opacity = '1';
    }
}

// Подготовка к следующей главе
function prepareForNextChapter() {
    // Здесь будет логика подготовки к следующей главе
    console.log('Подготовка к следующей главе...');
    
    // Можно добавить загрузку следующей сцены или показать сообщение
    setTimeout(() => {
        alert('Глава I завершена. Подготовка ко второй главе...');
    }, 1000);
}

// Предотвращаем стандартное поведение скролла
window.addEventListener('keydown', function(e) {
    // Позволяем только определенные клавиши
    if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
});

// Отключаем стандартный скролл колесом
window.addEventListener('wheel', function(e) {
    e.preventDefault();
}, { passive: false });

// Отключаем тач-движения на мобильных
window.addEventListener('touchmove', function(e) {
    e.preventDefault();
}, { passive: false });