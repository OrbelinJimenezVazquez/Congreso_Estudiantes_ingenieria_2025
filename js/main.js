// ===== NAVEGACIÓN MÓVIL SIMPLE =====
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        
        // Prevenir scroll cuando el menú está abierto
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Cerrar menú al hacer click en un link
    document.querySelectorAll('.nav-item').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Cerrar menú al hacer click fuera de él
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-menu') && !e.target.closest('.nav-toggle') && 
            navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ===== SCROLL EFFECTS MEJORADO =====
let lastScrollY = window.scrollY;
const headerTop = document.querySelector('.header-top');
const mainNav = document.querySelector('.main-nav');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollDirection = scrollTop > lastScrollY ? 'down' : 'up';

    // Comportamiento de la navegación principal
    if (scrollTop > 80) {
        mainNav.classList.add('scrolled');
    } else {
        mainNav.classList.remove('scrolled');
    }

    // Comportamiento de la barra superior (ocultar/mostrar)
    if (scrollTop > 100) {
        if (scrollDirection === 'down') {
            // Scrolling down - ocultar barra superior
            headerTop.classList.add('hidden');
        } else {
            // Scrolling up - mostrar barra superior
            headerTop.classList.remove('hidden');
        }
    } else {
        // En la parte superior - siempre mostrar
        headerTop.classList.remove('hidden');
    }

    // Back to top button
    const scrollToTop = document.getElementById('scrollToTop');
    if (scrollToTop) {
        if (scrollTop > 400) {
            scrollToTop.classList.add('visible');
        } else {
            scrollToTop.classList.remove('visible');
        }
    }

    // Active nav link (solo en desktop)
    if (window.innerWidth >= 768) {
        const sections = document.querySelectorAll('.content-section, .hero-banner');
        const navItems = document.querySelectorAll('.nav-item');

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    }

    lastScrollY = scrollTop;
});

// ===== SMOOTH SCROLL MEJORADO =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        // No aplicar smooth scroll a enlaces externos o con target _blank
        if (this.getAttribute('target') === '_blank' || this.getAttribute('href').includes('http')) {
            return;
        }
        
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            // Calcular offset basado en el dispositivo
            const isMobile = window.innerWidth < 768;
            const navHeight = isMobile ? 80 : 120;
            const offsetTop = target.offsetTop - navHeight;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });

            // Actualizar URL sin recargar la página
            history.pushState(null, null, targetId);
        }
    });
});

// ===== CONTADOR REGRESIVO =====
function updateCountdown() {
    const eventDate = new Date('Nov 5, 2025 09:00:00').getTime();
    const now = new Date().getTime();
    const distance = eventDate - now;

    // Si la fecha ya pasó, mostrar mensaje
    if (distance < 0) {
        showEventStarted();
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Actualizar números con animación
    updateCountdownElement('days', days);
    updateCountdownElement('hours', hours);
    updateCountdownElement('minutes', minutes);
    updateCountdownElement('seconds', seconds);
}

function updateCountdownElement(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        // Animación simple al cambiar números
        if (element.textContent !== value.toString().padStart(2, '0')) {
            element.style.transform = 'scale(1.1)';
            setTimeout(() => {
                element.textContent = value.toString().padStart(2, '0');
                element.style.transform = 'scale(1)';
            }, 150);
        } else {
            element.textContent = value.toString().padStart(2, '0');
        }
    }
}

function showEventStarted() {
    const countdownEl = document.getElementById('countdown');
    if (countdownEl) {
        countdownEl.innerHTML = `
            <div class="event-started-message" style="text-align: center; padding: 20px;">
                <h3 style="color: var(--pure-white); margin-bottom: 10px;">¡El evento está en curso!</h3>
                <p style="color: var(--pure-white); opacity: 0.9;">Únete a nosotros en el Auditorio de Ingenierías</p>
            </div>
        `;
    }
    clearInterval(countdownInterval);
}

// Iniciar contador
const countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown(); // Ejecutar inmediatamente

// ===== SISTEMA DE PESTAÑAS =====
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // Remover active de todos los botones y contenidos
            document.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
                content.setAttribute('aria-hidden', 'true');
            });
            
            // Activar el botón y contenido actual
            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');
            
            const targetContent = document.getElementById(tabId);
            if (targetContent) {
                targetContent.classList.add('active');
                targetContent.setAttribute('aria-hidden', 'false');
            }
        });
    });

    // Activar primera pestaña por defecto
    if (tabButtons.length > 0) {
        tabButtons[0].click();
    }
}

// ===== MANEJO DE FORMULARIOS =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Efecto de carga
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
        
        // Simular envío (reemplazar con tu lógica real)
        setTimeout(() => {
            // Aquí iría tu lógica de envío real
            showNotification('¡Mensaje enviado! Te contactaremos en breve.', 'success');
            
            // Resetear formulario
            this.reset();
            
            // Restaurar botón
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// ===== BOTÓN VOLVER ARRIBA =====
const scrollToTop = document.getElementById('scrollToTop');
if (scrollToTop) {
    scrollToTop.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== NOTIFICACIONES =====
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Estilos básicos para la notificación
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-medium);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 15px;
        max-width: 300px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    // Botón cerrar
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    });
    
    document.body.appendChild(notification);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ===== INICIALIZACIÓN AOS =====
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar AOS si existe
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false,
            offset: 100
        });
    }
    
    // Inicializar pestañas
    initTabs();
    
    // Prevenir comportamientos no deseados en móvil
    document.addEventListener('touchstart', function() {}, { passive: true });
    document.addEventListener('touchmove', function() {}, { passive: true });
    
    console.log('XIX CEI 2025 - Sitio completamente optimizado');
});

// ===== MANEJO DE REDIMENSIONAMIENTO =====
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        // Cerrar menú móvil al redimensionar a desktop
        if (window.innerWidth >= 768 && navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    }, 250);
});

// ===== MEJORA DE ACCESIBILIDAD =====
// Agregar soporte para teclado en la navegación
document.addEventListener('keydown', function(e) {
    // Cerrar menú con ESC
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
        navToggle.focus();
    }
    
    // Navegación con teclado en menú móvil
    if (e.key === 'Tab' && navMenu && navMenu.classList.contains('active')) {
        const focusableElements = navMenu.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }
});