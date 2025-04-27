const slides = document.querySelectorAll('.slide');
const prevButton = document.querySelector('.back');
const nextButton = document.querySelector('.forward');
const pauseButton = document.querySelector('.pause');
const indicatorsContainer = document.querySelector('.indicators');

let currentSlide = 0;
let slideInterval;
let isPaused = false;
let isDragging = false;
let startX = 0;
let currentX = 0;
let diffX = 0;

// Функция для показа слайда
function showSlide(index) {
    if (index < 0) {
        currentSlide = slides.length - 1;
    } else if (index >= slides.length) {
        currentSlide = 0;
    } else {
        currentSlide = index;
    }

    document.querySelector('.slider').style.transform = `translateX(-${currentSlide * 100}%)`;
    updateIndicators();
}

// Функция для создания индикаторов
function createIndicators() {
    slides.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.addEventListener('click', () => showSlide(index));
        indicatorsContainer.appendChild(indicator);
    });
    updateIndicators();
}

// Функция для обновления индикаторов
function updateIndicators() {
    const indicators = indicatorsContainer.querySelectorAll('div');
    indicators.forEach((indicator, index) => {
        if (index === currentSlide) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

// Функция для автоперелистывания слайдов
function startAutoSlide() {
    slideInterval = setInterval(() => {
        showSlide(currentSlide + 1);
    }, 2000);
}

// Функция для остановки автоперелистывания
function stopAutoSlide() {
    clearInterval(slideInterval);
}

// Обработчики кнопок
prevButton.addEventListener('click', () => {
    showSlide(currentSlide - 1);
});

nextButton.addEventListener('click', () => {
    showSlide(currentSlide + 1);
});

pauseButton.addEventListener('click', () => {
    if (isPaused) {
        startAutoSlide();
        pauseButton.textContent = 'pause';
    } else {
        stopAutoSlide();
        pauseButton.textContent = 'start';
    }
    isPaused = !isPaused;
});

// Инициализация автоперелистывания и индикаторов
startAutoSlide();
createIndicators();

// Обработчик клавиш
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        showSlide(currentSlide - 1);
    } else if (e.key === 'ArrowRight') {
        showSlide(currentSlide + 1);
    }
});

// Обработчики для сенсорных устройств (мобильные устройства)
let startXTouch;
document.querySelector('.slider-container').addEventListener('touchstart', (e) => {
    startXTouch = e.touches[0].clientX;
    isDragging = true;
});

document.querySelector('.slider-container').addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const endX = e.touches[0].clientX;
    diffX = startXTouch - endX;
    document.querySelector('.slider').style.transform = `translateX(-${currentSlide * 100}% - ${diffX}px)`; // Подвижная анимация
});

document.querySelector('.slider-container').addEventListener('touchend', () => {
    if (Math.abs(diffX) > 50) {
        if (diffX > 0) {
            showSlide(currentSlide + 1); // Свайп влево
        } else {
            showSlide(currentSlide - 1); // Свайп вправо
        }
    }
    isDragging = false;
    diffX = 0;
});

// Обработчики для мыши (для десктопа)
let startXMouse;
document.querySelector('.slider-container').addEventListener('mousedown', (e) => {
    isDragging = true;
    startXMouse = e.clientX;
});

document.querySelector('.slider-container').addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    currentX = e.clientX;
    diffX = startXMouse - currentX;
    document.querySelector('.slider').style.transform = `translateX(-${currentSlide * 100}% - ${diffX}px)`; // Подвижная анимация
});

document.querySelector('.slider-container').addEventListener('mouseup', () => {
    if (!isDragging) return;
    if (Math.abs(diffX) > 50) {
        if (diffX > 0) {
            showSlide(currentSlide + 1); // Перетаскивание влево
        } else {
            showSlide(currentSlide - 1); // Перетаскивание вправо
        }
    }
    isDragging = false;
    diffX = 0;
});

document.querySelector('.slider-container').addEventListener('mouseleave', () => {
    if (isDragging) {
        if (Math.abs(diffX) > 50) {
            if (diffX > 0) {
                showSlide(currentSlide + 1); // Перетаскивание влево
            } else {
                showSlide(currentSlide - 1); // Перетаскивание вправо
            }
        }
    }
    isDragging = false;
    diffX = 0;
});