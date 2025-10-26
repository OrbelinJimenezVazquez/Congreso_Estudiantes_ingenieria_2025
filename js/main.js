// ===== NAVEGACIÓN MÓVIL =====
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

// Función para cerrar menú móvil
function closeMobileMenu() {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
    document.body.style.overflow = '';
}

// Toggle menú móvil
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
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        closeMobileMenu();
    });
});

// Cerrar menú al hacer click fuera de él
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-menu') && !e.target.closest('.nav-toggle') && 
        navMenu.classList.contains('active')) {
        closeMobileMenu();
    }
});

// Cerrar menú al redimensionar a desktop
window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && navMenu.classList.contains('active')) {
        closeMobileMenu();
    }
});

// ===== SCROLL EFFECTS OPTIMIZADOS =====
let scrollTimeout;
window.addEventListener('scroll', () => {
    // Debounce para mejor performance en móvil
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        const navbar = document.querySelector('.navbar');
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Navbar scroll effect
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
            // Mostrar/ocultar top-bar solo en desktop
            if (window.innerWidth >= 768) {
                if (scrollTop > 200) {
                    document.querySelector('.top-bar').style.opacity = '0';
                    document.querySelector('.top-bar').style.visibility = 'hidden';
                } else {
                    document.querySelector('.top-bar').style.opacity = '1';
                    document.querySelector('.top-bar').style.visibility = 'visible';
                }
            }
        } else {
            navbar.classList.remove('scrolled');
            if (window.innerWidth >= 768) {
                document.querySelector('.top-bar').style.opacity = '1';
                document.querySelector('.top-bar').style.visibility = 'visible';
            }
        }

        // Back to top button
        const backToTop = document.getElementById('backToTop');
        if (scrollTop > 400) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }

        // Active nav link (solo en desktop para mejor performance)
        if (window.innerWidth >= 768) {
            const sections = document.querySelectorAll('section');
            const navLinks = document.querySelectorAll('.nav-link');

            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 120;
                const sectionHeight = section.clientHeight;
                if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }
    }, 10);
});

// ===== SMOOTH SCROLL OPTIMIZADO =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - (window.innerWidth >= 768 ? 120 : 80);
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== CONTADOR REGRESIVO OPTIMIZADO =====
function updateCountdown() {
    const eventDate = new Date('Nov 5, 2025 09:00:00').getTime();
    const now = new Date().getTime();
    const distance = eventDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Solo animar si hay cambio (mejor performance)
    flipNumber('days', days);
    flipNumber('hours', hours);
    flipNumber('minutes', minutes);
    flipNumber('seconds', seconds);

    if (distance < 0) {
        clearInterval(countdownInterval);
        showEventStarted();
    }
}

function flipNumber(elementId, newValue) {
    const element = document.getElementById(elementId);
    const currentValue = parseInt(element.textContent);

    if (currentValue !== newValue) {
        element.style.transform = 'rotateX(90deg)';
        setTimeout(() => {
            element.textContent = newValue.toString().padStart(2, '0');
            element.style.transform = 'rotateX(0deg)';
        }, 150);
    }
}

function showEventStarted() {
    const countdownEl = document.getElementById('countdown');
    countdownEl.innerHTML = `
        <div class="event-started-message">
            <h3>¡El evento está en curso!</h3>
            <p>Únete a nosotros en el Auditorio de Ingenierías</p>
        </div>
    `;
}

// Iniciar contador solo si está en viewport (mejor performance)
let countdownInterval;
function initCountdown() {
    const countdownEl = document.getElementById('countdown');
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            countdownInterval = setInterval(updateCountdown, 1000);
            updateCountdown();
        } else {
            clearInterval(countdownInterval);
        }
    });

    observer.observe(countdownEl);
}

// ===== TABS SYSTEM =====
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
        const tabId = button.getAttribute('data-tab');
        
        // Remover active de todos los botones y paneles
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
        
        // Activar el botón y panel actual
        button.classList.add('active');
        document.getElementById(tabId).classList.add('active');
    });
});

// ===== FORM HANDLING =====
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Efecto de carga
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;
    
    // Simular envío
    setTimeout(() => {
        // Mostrar notificación de éxito
        showNotification('¡Mensaje enviado! Te contactaremos en breve.', 'success');
        
        // Resetear formulario
        this.reset();
        
        // Restaurar botón
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
});

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animación de entrada
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== BACK TO TOP =====
document.getElementById('backToTop').addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===== AOS INITIALIZATION OPTIMIZADA =====
function initAOS() {
    // Solo inicializar AOS si no es un dispositivo táctil lento
    if (!('ontouchstart' in window) || window.innerWidth > 768) {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false,
            offset: 100,
            disable: window.innerWidth < 768 // Deshabilitar en móvil para mejor performance
        });
    }
}

// ===== TOUCH OPTIMIZATIONS =====
function initTouchOptimizations() {
    // Prevenir zoom en inputs en iOS
    document.addEventListener('touchstart', function() {}, {passive: true});
    
    // Mejorar rendimiento en scroll táctil
    document.addEventListener('touchmove', function() {}, {passive: true});
}

// ===== LAZY LOADING PARA IMÁGENES =====
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ===== INICIALIZACIÓN MOBILE FIRST =====
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar componentes según el viewport
    if (window.innerWidth >= 768) {
        initAOS();
    }
    
    initTouchOptimizations();
    initLazyLoading();
    initCountdown();
    
    // Agregar clase loaded para transiciones suaves
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
    
    console.log('🎓 XIX CEI 2025 - Mobile First Optimizado');
});

// ===== PERFORMANCE OPTIMIZATIONS =====
window.addEventListener('load', function() {
    // Remover listeners de carga
    document.body.classList.add('loaded');
    
    // Inicializar componentes pesados después de la carga
    if (window.innerWidth >= 1024) {
        // Inicializar efectos hover solo en desktop
        document.querySelectorAll('.speaker-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-15px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
});