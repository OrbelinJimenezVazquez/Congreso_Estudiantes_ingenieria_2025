// ===== NAVEGACIÓN MÓVIL SIMPLE =====
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevenir que el click se propague
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        
        // Prevenir scroll cuando el menú está abierto
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }
    });

    // Cerrar menú al hacer click en un link
    document.querySelectorAll('.nav-item').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        });
    });

    // Cerrar menú al hacer click fuera de él
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-menu') && !e.target.closest('.nav-toggle') && 
            navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }
    });

    // Cerrar menú al redimensionar (si se abre en móvil y se cambia a desktop)
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768 && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }
    });
}

// ===== SCROLL EFFECTS MEJORADO =====
let lastScrollY = window.scrollY;
const headerTop = document.querySelector('.header-top');
const mainNav = document.querySelector('.main-nav');
let scrollTimeout;

// Función para manejar el scroll optimizada para móviles
function handleScroll() {
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
        updateActiveNavLink(scrollTop);
    }

    lastScrollY = scrollTop;
}

// Debounce para mejorar rendimiento en móviles
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Actualizar enlace activo en navegación
function updateActiveNavLink(scrollTop) {
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

// Aplicar debounce al scroll para mejor rendimiento en móviles
window.addEventListener('scroll', debounce(handleScroll, 10));

// ===== SMOOTH SCROLL MEJORADO =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        // No aplicar smooth scroll a enlaces externos o con target _blank
        if (this.getAttribute('target') === '_blank' || this.getAttribute('href').includes('http')) {
            return;
        }
        
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        // Si es el mismo enlace actual, no hacer nada
        if (targetId === window.location.hash) {
            return;
        }
        
        const target = document.querySelector(targetId);
        
        if (target) {
            // Calcular offset basado en el dispositivo
            const isMobile = window.innerWidth < 768;
            const navHeight = isMobile ? 80 : 120;
            const offsetTop = target.offsetTop - navHeight;
            
            // Smooth scroll con comportamiento suave
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });

            // Actualizar URL sin recargar la página
            history.pushState(null, null, targetId);
            
            // Cerrar menú móvil si está abierto
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
                document.documentElement.style.overflow = '';
            }
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
let countdownInterval;
function initCountdown() {
    countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown(); // Ejecutar inmediatamente
}

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
                
                // AOS refresh para animaciones en contenido de pestañas
                if (typeof AOS !== 'undefined') {
                    setTimeout(() => {
                        AOS.refresh();
                    }, 300);
                }
            }
        });
    });

    // Activar primera pestaña por defecto
    if (tabButtons.length > 0) {
        tabButtons[0].click();
    }
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

// ===== INICIALIZACIÓN AL CARGAR EL DOM =====
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar AOS si existe
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false,
            offset: 100,
            disable: function() {
                return window.innerWidth < 768; // Deshabilitar AOS en móviles si es necesario
            }
        });
    }
    
    // Inicializar componentes
    initTabs();
    initCountdown();
    
    // Forzar un reflow para evitar problemas de visualización en móviles
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // Prevenir zoom en inputs en iOS
    document.addEventListener('touchstart', function() {}, { passive: true });
    document.addEventListener('touchmove', function() {}, { passive: true });
    
    console.log('XIX CEI 2025 - Sitio optimizado para móviles');
});

// ===== MANEJO DE REDIMENSIONAMIENTO =====
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        // Refresh AOS en redimensionamiento
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
        
        // Actualizar navegación activa
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        updateActiveNavLink(scrollTop);
    }, 250);
});

// ===== MEJORA DE ACCESIBILIDAD =====
document.addEventListener('keydown', function(e) {
    // Cerrar menú con ESC
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        navToggle.focus();
    }
});

// ===== FIX PARA VIEWPORT EN IOS =====
// Prevenir problemas de viewport en Safari iOS
window.addEventListener('orientationchange', function() {
    setTimeout(function() {
        // Forzar recálculo del viewport
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.content = viewport.content;
        }
    }, 100);
});

// ===== PREVENIR COMPORTAMIENTOS NO DESEADOS =====
// Prevenir pull-to-refresh en móviles
document.addEventListener('touchmove', function(e) {
    if (navMenu && navMenu.classList.contains('active')) {
        e.preventDefault();
    }
}, { passive: false });

// Prevenir zoom en inputs en iOS
document.addEventListener('touchstart', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        document.documentElement.style.zoom = '1';
    }
});

// ===== FILTRADO DE TALLERES =====
function initTalleresFilters() {
    const filterBtns = document.querySelectorAll('.filtro-btn');
    const tallerCards = document.querySelectorAll('.taller-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remover active de todos los botones
            filterBtns.forEach(b => b.classList.remove('active'));
            // Agregar active al botón clickeado
            btn.classList.add('active');
            
            const horario = btn.getAttribute('data-horario');
            
            // Filtrar talleres
            tallerCards.forEach(card => {
                if (horario === 'todos') {
                    card.classList.remove('hidden');
                } else {
                    if (card.getAttribute('data-horario') === horario) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                }
            });
        });
    });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initTalleresFilters();
});