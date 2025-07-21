document.addEventListener('DOMContentLoaded', function() {
    // ==================== Бургер-меню ====================
    const hamburger = document.querySelector('.hamburger');
    const menu = document.querySelector('.menu');

    if (hamburger && menu) {
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.classList.toggle('active');
            menu.classList.toggle('active');
        });

        // Закрытие при клике на ссылку
        document.querySelectorAll('.menu a').forEach(link => {
            link.addEventListener('click', function(e) {
                hamburger.classList.remove('active');
                menu.classList.remove('active');
            });
        });

        // Закрытие при клике вне меню
        document.addEventListener('click', function(e) {
            if (!menu.contains(e.target)) {
                hamburger.classList.remove('active');
                menu.classList.remove('active');
            }
        });
    }

    // ==================== Модальные окна ====================
    const serviceItems = document.querySelectorAll('.service-item');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close');

    // Функция открытия модального окна
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            // Анимация
            const modalContent = modal.querySelector('.modal-content');
            setTimeout(() => {
                modalContent.classList.add('active');
            }, 10);
            
            // Инициализация слайдера
            const slider = modal.querySelector('.slider');
            if (slider) initSlider(slider);
        }
    }

    // Функция закрытия
    function closeModal(modal) {
        const modalContent = modal.querySelector('.modal-content');
        modalContent.classList.remove('active');
        
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }

    // Обработчики для карточек услуг
    serviceItems.forEach(item => {
        // Для touch-устройств
        item.addEventListener('touchstart', function(e) {
            e.preventDefault();
            this.classList.add('touched');
        });
        
        item.addEventListener('touchend', function(e) {
            e.preventDefault();
            if (this.classList.contains('touched')) {
                const modalId = this.getAttribute('data-modal');
                openModal(modalId);
                this.classList.remove('touched');
            }
        });
        
        // Для десктопов
        item.addEventListener('click', function() {
            if (!('ontouchstart' in window)) {
                const modalId = this.getAttribute('data-modal');
                openModal(modalId);
            }
        });
    });

    // Закрытие модальных окон
    closeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });

    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this);
            }
        });
    });

    // ==================== Слайдер ====================
    function initSlider(slider) {
        const track = slider.querySelector('.slider-track');
        const slides = slider.querySelectorAll('.slide');
        const prevBtn = slider.querySelector('.prev');
        const nextBtn = slider.querySelector('.next');
        
        if (!track || !slides.length || !prevBtn || !nextBtn) return;
        
        let currentIndex = 0;
        let slideWidth = slider.offsetWidth;
        let startPos = 0;
        let currentPos = 0;
        let isDragging = false;
        
        // Установка ширины слайдов
        slides.forEach(slide => {
            slide.style.width = `${slideWidth}px`;
        });
        
        // Ресайз
        window.addEventListener('resize', () => {
            slideWidth = slider.offsetWidth;
            slides.forEach(slide => {
                slide.style.width = `${slideWidth}px`;
            });
            updateSliderPosition();
        });
        
        // Навигация
        function goNext() {
            if (currentIndex < slides.length - 1) {
                currentIndex++;
            } else {
                currentIndex = 0;
            }
            updateSliderPosition();
        }
        
        function goPrev() {
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = slides.length - 1;
            }
            updateSliderPosition();
        }
        
        function updateSliderPosition() {
            track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        }
        
        // Touch события
        slider.addEventListener('touchstart', touchStart, {passive: false});
        slider.addEventListener('touchmove', touchMove, {passive: false});
        slider.addEventListener('touchend', touchEnd);
        
        // Click события для кнопок
        nextBtn.addEventListener('click', goNext);
        prevBtn.addEventListener('click', goPrev);
        
        function touchStart(e) {
            e.preventDefault();
            startPos = e.touches[0].clientX;
            currentPos = startPos;
            isDragging = true;
            track.style.transition = 'none';
        }
        
        function touchMove(e) {
            if (!isDragging) return;
            e.preventDefault();
            const current = e.touches[0].clientX;
            const diff = current - currentPos;
            currentPos = current;
            track.style.transform = `translateX(calc(-${currentIndex * slideWidth}px + ${diff}px))`;
        }
        
        function touchEnd() {
            if (!isDragging) return;
            isDragging = false;
            track.style.transition = 'transform 0.3s ease';
            
            const diff = currentPos - startPos;
            if (diff < -50) {
                goNext();
            } else if (diff > 50) {
                goPrev();
            } else {
                updateSliderPosition();
            }
        }
        
        updateSliderPosition();
    }
    
    // Инициализация слайдеров
    const sliders = document.querySelectorAll('.slider');
    sliders.forEach(slider => {
        initSlider(slider);
    });

});
// Остальной код (календарь, форма бронирования) остается без изменений

document.addEventListener('DOMContentLoaded', function() {
    // Конфигурация (замените на свои данные)
    const config = {
        BOT_TOKEN: '7583652121:AAHPKhDWuHq9NNcqN5FFO4zvnzo8AYFAFPk',
        CHAT_ID: '752504401',
        get API_URL() { return `https://api.telegram.org/bot${this.BOT_TOKEN}/sendMessage`;}
    };

    // Инициализация календаря
    initDatePickers();

    // Обработка формы
    const bookingForm = document.getElementById('bookingForm');

    if (bookingForm) {
        // Обработка touch для инпутов
        const inputs = bookingForm.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('touchstart', function(e) {
                this.focus();
                e.stopPropagation();
            }, {passive: true});
        })
    
        if (bookingForm) {
        bookingForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = getFormData();
            
            if (!validateForm(formData)) return;
            
            setLoadingState(true);
            
            try {
                await sendFormData(formData);
                showAlert('success', '✅ Заявка отправлена! Мы свяжемся с вами в ближайшее время.');
                bookingForm.reset();
            } catch (error) {
                console.error('Ошибка отправки:', error);
                handleSendError(error);
            } finally {
                setLoadingState(false);
            }
        });
    }

    };

    // Функции
    function initDatePickers() {
        flatpickr("#checkin", {
            locale: "ru",
            minDate: "today",
            dateFormat: "d.m.Y",
            onChange: function(selectedDates) {
                const minCheckout = new Date(selectedDates[0].getTime() + 86400000);
                flatpickr("#checkout").set("minDate", minCheckout);
            }
        });

        flatpickr("#checkout", {
            locale: "ru",
            minDate: new Date().fp_incr(1),
            dateFormat: "d.m.Y"
        });
    }

    function getFormData() {
        return {
            name: document.getElementById('name').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            checkin: document.getElementById('checkin').value,
            checkout: document.getElementById('checkout').value,
            house: document.getElementById('house').value,
            date: new Date().toLocaleString('ru-RU')
        };
    }

    function validateForm(data) {
        const errors = [];
        
        if (!data.name || data.name.length < 2) {
            errors.push('Укажите корректное имя');
        }
        
        if (!data.phone || !/^[\d\+\(\)\s-]{7,}$/.test(data.phone)) {
            errors.push('Укажите корректный телефон');
        }
        
        if (!data.checkin || !data.checkout) {
            errors.push('Выберите даты заезда и выезда');
        }
        
        if (!data.house) {
            errors.push('Выберите тип домика');
        }
        
        if (errors.length > 0) {
            showAlert('error', errors.join('<br>'));
            return false;
        }
        
        return true;
    }

    async function sendFormData(data) {
        const text = formatMessage(data);
        const response = await fetch(config.API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: config.CHAT_ID,
                text: text,
                parse_mode: 'HTML'
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.description || 'Ошибка сервера');
        }
    }

    function formatMessage(data) {
        return `📌 <b>Новая заявка!</b>\n\n` +
               `🏠 <b>Домик:</b> ${getHouseName(data.house)}\n` +
               `👤 <b>Имя:</b> ${data.name}\n` +
               `📱 <b>Телефон:</b> <code>${data.phone}</code>\n` +
               `📅 <b>Даты:</b> ${data.checkin} → ${data.checkout}\n\n` +
               `⏰ ${data.date}`;
    }

    function getHouseName(value) {
        const houses = {
            'house1': '🏡 Стандарт (2 чел)',
            'house2': '🏠 Комфорт (4 чел)',
            'house3': '🌟 VIP домик'
        };
        return houses[value] || value;
    }

    function setLoadingState(isLoading) {
        const btn = document.querySelector('#bookingForm button[type="submit"]');
        if (isLoading) {
            btn.disabled = true;
            btn.querySelector('.btn-text').style.display = 'none';
            btn.querySelector('.btn-spinner').style.display = 'inline-block';
        } else {
            btn.disabled = false;
            btn.querySelector('.btn-text').style.display = 'inline-block';
            btn.querySelector('.btn-spinner').style.display = 'none';
        }
    }

    function showAlert(type, message) {
        const alertsContainer = document.getElementById('formAlerts');
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = message;
        alertsContainer.appendChild(alert);
        
        setTimeout(() => {
            alert.remove();
        }, 5000);
    }

    function handleSendError(error) {
        let errorMessage = '❌ Ошибка при отправке. Пожалуйста, позвоните нам.';
        
        if (error.message.includes('chat not found')) {
            errorMessage = 'Ошибка конфигурации бота';
        } else if (error.message.includes('bot was blocked')) {
            errorMessage = 'Бот недоступен';
        }
        
        showAlert('error', errorMessage);
    }
});

// Плавный скролл к якорям с дополнительным отступом
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Закрываем меню, если оно открыто (для мобильной версии)
        const menu = document.querySelector('.menu');
        if (menu && menu.classList.contains('active')) {
            menu.classList.remove('active');
            document.querySelector('.hamburger').classList.remove('active');
        }
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Высота хедера + дополнительный отступ (в пикселях)
            const headerHeight = document.querySelector('.header') ? 
                               document.querySelector('.header').offsetHeight : 0;
            const extraOffset = -100; // Дополнительный отступ (можно регулировать)
            const totalOffset = headerHeight + extraOffset;
            
            const targetPosition = targetElement.getBoundingClientRect().top + 
                                 window.pageYOffset - 
                                 totalOffset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Обновляем URL без перезагрузки страницы
            history.pushState(null, null, targetId);
        }
    });
});

