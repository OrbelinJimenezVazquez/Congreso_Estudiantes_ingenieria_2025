// ===== NAVEGACIÓN MÓVIL ORIGINAL =====
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }
    });

    document.querySelectorAll('.nav-item').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-menu') && !e.target.closest('.nav-toggle') && 
            navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768 && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }
    });
}

// ===== SCROLL EFFECTS ORIGINAL =====
let lastScrollY = window.scrollY;
const headerTop = document.querySelector('.header-top');
const mainNav = document.querySelector('.main-nav');

// ===== MEJORAS PARA EL BOTÓN VER DETALLES EN MÓVILES =====
function enhanceModalButtons() {
    const openModalButtons = document.querySelectorAll('.open-modal-btn');
    
    openModalButtons.forEach(button => {
        // Pausar animación de flotar cuando el botón está en hover
        button.addEventListener('mouseenter', function() {
            this.style.animationPlayState = 'paused';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.animationPlayState = 'running';
        });
        
        // Para dispositivos táctiles, mantener la animación siempre activa
        button.addEventListener('touchstart', function() {
            this.style.animationPlayState = 'paused';
        });
        
        button.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.animationPlayState = 'running';
            }, 1000);
        });
    });
}

// ===== CORRECCIÓN DE POSICIÓN DEL BOTÓN IR ARRIBA =====
function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollDirection = scrollTop > lastScrollY ? 'down' : 'up';

    // Comportamiento de la navegación principal
    if (scrollTop > 80) {
        mainNav.classList.add('scrolled');
    } else {
        mainNav.classList.remove('scrolled');
    }

    // Comportamiento de la barra superior
    if (scrollTop > 100) {
        if (scrollDirection === 'down') {
            headerTop.classList.add('hidden');
        } else {
            headerTop.classList.remove('hidden');
        }
    } else {
        headerTop.classList.remove('hidden');
    }

    // CORRECCIÓN: Botón ir arriba - verificar que esté por encima del footer
    const scrollToTop = document.getElementById('scrollToTop');
    if (scrollToTop) {
        const footer = document.querySelector('.site-footer');
        const footerTop = footer ? footer.offsetTop : Infinity;
        
        // Mostrar botón solo cuando no esté en el área del footer
        if (scrollTop > 400 && scrollTop < (footerTop - 300)) {
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

window.addEventListener('scroll', debounce(handleScroll, 10));

// ===== SMOOTH SCROLL ORIGINAL MEJORADO =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        if (this.getAttribute('target') === '_blank' || this.getAttribute('href').includes('http')) {
            return;
        }
        
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        if (targetId === window.location.hash) {
            return;
        }
        
        const target = document.querySelector(targetId);
        
        if (target) {
            const isMobile = window.innerWidth < 768;
            const navHeight = isMobile ? 80 : 120;
            const offsetTop = target.offsetTop - navHeight;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });

            history.pushState(null, null, targetId);
            
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
                document.documentElement.style.overflow = '';
            }
        }
    });
});

// ===== SISTEMA DE PESTAÑAS MEJORADO =====
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    console.log('Inicializando pestañas:', {
        botones: tabButtons.length,
        contenidos: tabContents.length
    });
    
    if (tabButtons.length === 0 || tabContents.length === 0) {
        console.error('No se encontraron elementos de pestañas');
        return;
    }
    
    function switchTab(tabId, button) {
        console.log('Cambiando a pestaña:', tabId);
        
        tabButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
        });
        
        tabContents.forEach(content => {
            content.classList.remove('active');
            content.setAttribute('aria-hidden', 'true');
            content.style.display = 'none';
        });
        
        button.classList.add('active');
        button.setAttribute('aria-selected', 'true');
        
        const targetContent = document.getElementById(tabId);
        
        if (targetContent) {
            targetContent.classList.add('active');
            targetContent.setAttribute('aria-hidden', 'false');
            targetContent.style.display = 'block';
            
            console.log('Contenido activado:', tabId);
            
            if (typeof AOS !== 'undefined') {
                setTimeout(() => {
                    AOS.refresh();
                }, 100);
            }
        } else {
            console.error('No se encontró el contenido para:', tabId);
        }
    }
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId, this);
        });
    });
    
    const activeTab = document.querySelector('.tab-button.active');
    const activeContent = document.querySelector('.tab-content.active');
    
    if (!activeTab && tabButtons.length > 0) {
        console.log('Activando primera pestaña por defecto');
        tabButtons[0].click();
    } else if (activeTab && activeContent) {
        console.log('Pestaña activa encontrada:', activeTab.getAttribute('data-tab'));
        tabContents.forEach(content => {
            if (content !== activeContent) {
                content.style.display = 'none';
            } else {
                content.style.display = 'block';
            }
        });
    }
}

// ===== CONTADOR REGRESIVO =====
function updateCountdown() {
    const eventDate = new Date('Nov 5, 2025 09:00:00').getTime();
    const now = new Date().getTime();
    const distance = eventDate - now;

    if (distance < 0) {
        showEventStarted();
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    updateCountdownElement('days', days);
    updateCountdownElement('hours', hours);
    updateCountdownElement('minutes', minutes);
    updateCountdownElement('seconds', seconds);
}

function updateCountdownElement(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
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

let countdownInterval;
function initCountdown() {
    countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown();
}

// ===== FILTRADO DE TALLERES =====
function initTalleresFilters() {
    const filterBtns = document.querySelectorAll('.filtro-btn');
    const tallerCards = document.querySelectorAll('.taller-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const horario = this.getAttribute('data-horario');
            
            tallerCards.forEach(card => {
                if (horario === 'todos') {
                    card.style.display = 'block';
                } else {
                    if (card.getAttribute('data-horario') === horario) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
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

// ===== SISTEMA DE MODAL MEJORADO =====
function initModalSystem() {
    const modalOverlay = document.getElementById('project-modal');
    
    if (!modalOverlay) {
        console.error('No se encontró el modal');
        return;
    }

    const modalCloseBtn = document.getElementById('modal-close');
    const modalTitle = document.getElementById('modal-project-title');
    const modalBody = document.getElementById('modal-project-body');
    const openModalButtons = document.querySelectorAll('.open-modal-btn');

    const openModal = (e) => {
        e.preventDefault();
        
        const button = e.currentTarget;
        const title = button.dataset.title;
        const integrantes = button.dataset.integrantes;
        
        modalTitle.textContent = title;
        modalBody.innerHTML = `<h5>Integrantes:</h5><p>${integrantes}</p>`;
        
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
    };

    openModalButtons.forEach(button => {
        button.addEventListener('click', openModal);
    });

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });

    const modalContent = modalOverlay.querySelector('.modal-content');
    if (modalContent) {
        modalContent.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
}

// ===== MANEJO DEL VIDEO DE FONDO =====
function initVideoBackground() {
    const heroVideo = document.querySelector('.hero-banner video');
    
    if (heroVideo) {
        heroVideo.setAttribute('playsinline', '');
        heroVideo.setAttribute('webkit-playsinline', '');
        heroVideo.setAttribute('muted', '');
        heroVideo.setAttribute('loop', '');
        
        const playVideo = () => {
            heroVideo.play().catch(function(error) {
                console.log('La reproducción automática del video fue prevenida:', error);
                setTimeout(() => {
                    heroVideo.play().catch(e => console.log('Segundo intento fallido:', e));
                }, 1000);
            });
        };
        
        if (heroVideo.readyState >= 3) {
            playVideo();
        } else {
            heroVideo.addEventListener('loadeddata', playVideo);
        }
        
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                heroVideo.pause();
            } else {
                playVideo();
            }
        });
    }
}

// ===== SISTEMA DE PONENTES CON "VER MÁS" =====
function initPonentesSystem() {
    const verMasBtn = document.getElementById('ver-mas-ponentes');
    const ponentesHidden = document.querySelectorAll('.speaker-profile.hidden');
    
    console.log('Inicializando sistema de ponentes:', {
        boton: verMasBtn ? 'encontrado' : 'no encontrado',
        ponentesOcultos: ponentesHidden.length
    });
    
    if (!verMasBtn || ponentesHidden.length === 0) {
        console.log('No se encontraron ponentes ocultos o el botón');
        return;
    }
    
    verMasBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Mostrando ponentes ocultos...');
        
        ponentesHidden.forEach((ponente, index) => {
            setTimeout(() => {
                ponente.style.display = 'block';
                ponente.classList.remove('hidden');
                ponente.offsetHeight;
                ponente.style.opacity = '1';
                ponente.style.transform = 'translateY(0)';
            }, index * 200);
        });
        
        setTimeout(() => {
            this.style.opacity = '0';
            setTimeout(() => {
                this.style.display = 'none';
            }, 300);
        }, ponentesHidden.length * 200 + 200);
        
        if (typeof AOS !== 'undefined') {
            setTimeout(() => {
                AOS.refresh();
                console.log('AOS refresh ejecutado');
            }, 500);
        }
    });
}

// ===== EFECTO HOVER UNIFICADO PARA TODOS LOS BOTONES =====
function initUnifiedButtonHover() {
    const allButtons = document.querySelectorAll('.btn, .filtro-btn, .scroll-to-top');
    
    allButtons.forEach(button => {
        // Agregar efecto de ripple al hacer click
        button.addEventListener('click', function(e) {
            if (this.classList.contains('open-modal-btn')) return;
            
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple-animation 0.6s linear;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Agregar el CSS para la animación ripple dinámicamente
function addRippleAnimation() {
    if (!document.querySelector('#ripple-animation')) {
        const style = document.createElement('style');
        style.id = 'ripple-animation';
        style.textContent = `
            @keyframes ripple-animation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ===== INICIALIZACIÓN AL CARGAR EL DOM =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('XIX CEI 2025 - Inicializando sitio web...');
    
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false,
            offset: 100,
            disable: function() {
                return window.innerWidth < 768;
            }
        });
    }
    
    initTabs();
    initCountdown();
    initTalleresFilters();
    initModalSystem();
    initVideoBackground();
    initPonentesSystem();
    addRippleAnimation();
    initUnifiedButtonHover();
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    document.addEventListener('touchstart', function() {}, { passive: true });
    document.addEventListener('touchmove', function() {}, { passive: true });
    
    console.log('XIX CEI 2025 - Sitio optimizado para móviles inicializado correctamente');
});

// ===== MANEJO DE REDIMENSIONAMIENTO =====
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
        
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        updateActiveNavLink(scrollTop);
    }, 250);
});

// ===== MEJORA DE ACCESIBILIDAD =====
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        navToggle.focus();
    }
});

// ===== FIX PARA VIEWPORT EN IOS =====
window.addEventListener('orientationchange', function() {
    setTimeout(function() {
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.content = viewport.content;
        }
        
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }, 100);
});

// ===== FIX DE EMERGENCIA PARA PESTAÑAS EN MÓVILES =====
setTimeout(function() {
    const tabContents = document.querySelectorAll('.tab-content');
    const activeTab = document.querySelector('.tab-button.active');
    
    if (tabContents.length > 0 && !document.querySelector('.tab-content.active')) {
        console.log('Aplicando fix de emergencia para pestañas móviles...');
        
        tabContents.forEach(content => {
            content.style.display = 'none';
        });
        
        if (activeTab) {
            const tabId = activeTab.getAttribute('data-tab');
            const activeContent = document.getElementById(tabId);
            if (activeContent) {
                activeContent.style.display = 'block';
                activeContent.classList.add('active');
            }
        } else {
            tabContents[0].style.display = 'block';
            tabContents[0].classList.add('active');
            document.querySelector('.tab-button')?.classList.add('active');
        }
    }
}, 500);