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

// ===== COMPORTAMIENTO CORREGIDO DEL SCROLL =====
function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollDirection = scrollTop > lastScrollY ? 'down' : 'up';

    console.log('Scroll:', { scrollTop, scrollDirection, lastScrollY });

    // HEADER TOP: Ocultar al bajar, mostrar al subir
    if (scrollDirection === 'down' && scrollTop > 50) {
        console.log('Ocultando header top - Scroll hacia abajo');
        headerTop.style.transform = 'translateY(-100%)';
        headerTop.style.transition = 'transform 0.3s ease';
    } else if (scrollDirection === 'up') {
        console.log('Mostrando header top - Scroll hacia arriba');
        headerTop.style.transform = 'translateY(0)';
        headerTop.style.transition = 'transform 0.3s ease';
    }

    // NAVBAR: Fijo cuando hay scroll
    if (scrollTop > 100) {
        mainNav.classList.add('scrolled');
    } else {
        mainNav.classList.remove('scrolled');
    }

    // BOTÓN ARRIBA: Aparece después de cierto scroll
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

// ===== SMOOTH SCROLL ORIGINAL MEJORADO - ACTUALIZADO PARA NAVEGACIÓN ENTRE PÁGINAS =====
document.querySelectorAll('a[href^="#"], a[href$=".html"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        const targetId = href.startsWith('#') ? href : null;
        const isExternalLink = href.startsWith('http') || this.getAttribute('target') === '_blank';
        const isInternalAnchor = targetId !== null;
        
        if (isExternalLink) {
            return;
        }

        if (isInternalAnchor) {
            // Maneja el smooth scroll SÓLO si es un enlace interno de la página actual
            e.preventDefault();
            
            // Si ya estamos en la página de anclaje, simplemente desplázate
            if (href === window.location.hash) {
                return;
            }

            const target = document.querySelector(targetId);
            
            if (target) {
                const isMobile = window.innerWidth < 768;
                // Ajusta el offset de scroll para la navegación fija
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
        }
        // Si no es un anchor (#) ni un enlace externo (http), se asume que es una navegación entre páginas (.html) y se permite la acción por defecto.
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

// ===== CONTADOR REGRESIVO MEJORADO =====
function updateCountdown() {
    const eventStartDate = new Date('Nov 5, 2025 09:00:00').getTime();
    const eventEndDate = new Date('Nov 7, 2025 20:00:00').getTime();
    const now = new Date().getTime();
    const distanceToStart = eventStartDate - now;
    const distanceToEnd = eventEndDate - now;

    // Si el evento ya comenzó pero aún no termina
    if (distanceToStart < 0 && distanceToEnd > 0) {
        showEventInProgress(distanceToEnd);
        return;
    }
    
    // Si el evento ya terminó
    if (distanceToEnd < 0) {
        showEventEnded();
        return;
    }

    // Si el evento aún no comienza
    const days = Math.floor(distanceToStart / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distanceToStart % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distanceToStart % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distanceToStart % (1000 * 60)) / 1000);

    updateCountdownElement('days', days);
    updateCountdownElement('hours', hours);
    updateCountdownElement('minutes', minutes);
    updateCountdownElement('seconds', seconds);
}

function showEventInProgress(distanceToEnd) {
    const countdownEl = document.getElementById('countdown');
    if (countdownEl) {
        const days = Math.floor(distanceToEnd / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distanceToEnd % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distanceToEnd % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distanceToEnd % (1000 * 60)) / 1000);
        
        countdownEl.innerHTML = `
            <div class="countdown-text"><p>¡El evento está en curso! Termina en:</p></div>
            <div class="countdown-grid">
                <div class="countdown-unit">
                    <div class="countdown-value" id="days-end">${days.toString().padStart(2, '0')}</div>
                    <div class="countdown-label">Días</div>
                </div>
                <div class="countdown-unit">
                    <div class="countdown-value" id="hours-end">${hours.toString().padStart(2, '0')}</div>
                    <div class="countdown-label">Horas</div>
                </div>
                <div class="countdown-unit">
                    <div class="countdown-value" id="minutes-end">${minutes.toString().padStart(2, '0')}</div>
                    <div class="countdown-label">Minutos</div>
                </div>
                <div class="countdown-unit">
                    <div class="countdown-value" id="seconds-end">${seconds.toString().padStart(2, '0')}</div>
                    <div class="countdown-label">Segundos</div>
                </div>
            </div>
        `;
    }
}

function showEventEnded() {
    const countdownEl = document.getElementById('countdown');
    if (countdownEl) {
        countdownEl.innerHTML = `
            <div class="event-ended-message" style="text-align: center; padding: 20px;">
                <h3 style="color: var(--pure-white); margin-bottom: 10px;">¡El XIX CEI 2025 ha concluido!</h3>
                <p style="color: var(--pure-white); opacity: 0.9;">Gracias por ser parte de este evento</p>
            </div>
        `;
    }
    clearInterval(countdownInterval);
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

// ===== SISTEMA DE MODAL PARA PONENTES =====
function initSpeakerModalSystem() {
    const speakerModal = document.getElementById('speaker-modal');
    
    if (!speakerModal) {
        console.error('No se encontró el modal de ponentes');
        return;
    }

    const speakerModalClose = document.getElementById('speaker-modal-close');
    const openSpeakerButtons = document.querySelectorAll('.open-speaker-btn');
    const modalSpeakerName = document.getElementById('modal-speaker-name');
    const modalSpeakerTitle = document.getElementById('modal-speaker-title');
    const modalSpeakerPhoto = document.getElementById('modal-speaker-photo');
    const modalSpeakerFallback = document.getElementById('modal-speaker-fallback');
    const modalSpeakerBio = document.getElementById('modal-speaker-bio');
    const modalSpeakerTopics = document.getElementById('modal-speaker-topics');

    const openSpeakerModal = (e) => {
        e.preventDefault();
        
        const button = e.currentTarget;
        const name = button.dataset.name;
        const title = button.dataset.title;
        const photoUrl = button.dataset.photoUrl;
        const bio = button.dataset.bio;
        const topics = button.dataset.topics;
        const contactWeb = button.dataset.contactWeb || '';
        const contactEmail = button.dataset.contactEmail || '';

        // Llenar la información del modal
        modalSpeakerName.textContent = name;
        modalSpeakerTitle.textContent = title;
        modalSpeakerBio.textContent = bio;

        // Manejar la foto del ponente
        if (photoUrl) {
            modalSpeakerPhoto.src = photoUrl;
            modalSpeakerPhoto.style.display = 'block';
            modalSpeakerFallback.style.display = 'none';
            
            // Manejar error de carga de imagen
            modalSpeakerPhoto.onerror = function() {
                modalSpeakerPhoto.style.display = 'none';
                modalSpeakerFallback.style.display = 'flex';
            };
        } else {
            modalSpeakerPhoto.style.display = 'none';
            modalSpeakerFallback.style.display = 'flex';
        }

        // Llenar los temas
        modalSpeakerTopics.innerHTML = '';
        if (topics) {
            const topicsArray = topics.split('|');
            topicsArray.forEach(topic => {
                if (topic.trim()) {
                    const topicTag = document.createElement('span');
                    topicTag.className = 'topic-tag';
                    topicTag.textContent = topic.trim();
                    modalSpeakerTopics.appendChild(topicTag);
                }
            });
        }

        // Mostrar el modal
        speakerModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
    };

    const closeSpeakerModal = () => {
        speakerModal.classList.remove('active');
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
    };

    // Agregar event listeners a los botones de ponentes
    openSpeakerButtons.forEach(button => {
        button.addEventListener('click', openSpeakerModal);
    });

    if (speakerModalClose) {
        speakerModalClose.addEventListener('click', closeSpeakerModal);
    }

    speakerModal.addEventListener('click', (e) => {
        if (e.target === speakerModal) {
            closeSpeakerModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && speakerModal.classList.contains('active')) {
            closeSpeakerModal();
        }
    });

    const speakerModalContent = speakerModal.querySelector('.speaker-modal-content');
    if (speakerModalContent) {
        speakerModalContent.addEventListener('click', (e) => {
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

// ===== CONFIGURACIÓN AOS CORREGIDA =====
function initAOS() {
    if (typeof AOS !== 'undefined') {
        const isMobile = window.innerWidth < 768;
        
        AOS.init({
            duration: isMobile ? 400 : 600,
            easing: 'ease-out-cubic',
            once: true,
            mirror: false,
            offset: isMobile ? 20 : 50,
            disable: function() {
                // Solo deshabilitar en pantallas muy pequeñas
                return window.innerWidth < 320;
            },
            startEvent: 'DOMContentLoaded',
            animatedClassName: 'aos-animate'
        });
        
        console.log('AOS configurado - Móvil:', isMobile);
    }
}

// ===== OPTIMIZACIONES MEJORADAS PARA MÓVILES =====
function optimizeMobileAnimations() {
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
        // Reducir delays en animaciones para móviles
        document.querySelectorAll('[data-aos-delay]').forEach(element => {
            const currentDelay = element.getAttribute('data-aos-delay');
            if (currentDelay && parseInt(currentDelay) > 300) {
                const newDelay = Math.min(parseInt(currentDelay), 300);
                element.setAttribute('data-aos-delay', newDelay.toString());
            }
        });

        // Optimizar performance sin bloquear animaciones
        const animatedElements = document.querySelectorAll('.speaker-profile, .taller-card, .feature-card');
        animatedElements.forEach(element => {
            element.style.willChange = 'transform, opacity';
        });
    }
}

// ===== MEJORAS ESPECÍFICAS PARA ANIMACIONES TÁCTILES =====
function enhanceTouchAnimations() {
    // Suavizar animaciones al tocar botones
    const allButtons = document.querySelectorAll('.btn, .filtro-btn, .open-modal-btn');
    
    allButtons.forEach(button => {
        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
            this.style.transition = 'transform 0.1s ease';
        });
        
        button.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
            this.style.transition = 'transform 0.2s ease';
        });
    });

    // Mejorar animación del menú móvil
    const navMenu = document.getElementById('navMenu');
    if (navMenu) {
        navMenu.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    }

    // Optimizar animaciones de modales para touch
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(modal => {
        modal.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
}

// ===== PREVENIR ANIMACIONES DURANTE SCROLL EN MÓVILES =====
function preventAnimationsDuringScroll() {
    let scrollTimer;
    const elements = document.querySelectorAll('[data-aos]');
    
    window.addEventListener('scroll', function() {
        // Añadir clase durante el scroll
        document.body.classList.add('scrolling');
        
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(function() {
            document.body.classList.remove('scrolling');
        }, 100);
    }, { passive: true });
}

// ===== FIX DE EMERGENCIA PARA AOS EN MÓVILES =====
function applyAOSMobileFix() {
    if (window.innerWidth < 768) {
        setTimeout(() => {
            const aosElements = document.querySelectorAll('[data-aos]');
            console.log('Elementos AOS encontrados:', aosElements.length);
            
            // Forzar refresh de AOS
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
                console.log('AOS refresh ejecutado en fix de emergencia');
            }
        }, 1500);
    }
}

// ===== INICIALIZACIÓN AL CARGAR EL DOM - CORREGIDA =====
document.addEventListener('DOMContentLoaded', function() {
    // 1. Inicializar AOS PRIMERO
    initAOS();
    
    // 2. Inicializar todos los sistemas
    initTabs();
    initCountdown();
    initTalleresFilters();
    initModalSystem();
    initSpeakerModalSystem();
    initVideoBackground();
    initPonentesSystem();
    addRippleAnimation();
    initUnifiedButtonHover();
    enhanceModalButtons();
    
    // 3. Optimizaciones (después de AOS)
    optimizeMobileAnimations();
    enhanceTouchAnimations();
    preventAnimationsDuringScroll();
    
    // 4. Scroll event optimizado
    let ticking = false;
    function optimizedMobileScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    if (window.innerWidth < 768) {
        window.removeEventListener('scroll', debounce(handleScroll, 10));
        window.addEventListener('scroll', optimizedMobileScroll, { passive: true });
    } else {
        window.addEventListener('scroll', debounce(handleScroll, 10));
    }
    
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
        
        // Re-aplicar optimizaciones para móviles
        optimizeMobileAnimations();
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
        
        // Re-aplicar optimizaciones
        optimizeMobileAnimations();
    }, 300);
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

// ===== APLICAR FIX DE AOS DESPUÉS DE CARGA COMPLETA =====
window.addEventListener('load', function() {
    /* ========= CÓDIGO DEL PRELOADER AÑADIDO ========= */
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('preloader-hidden');
    }
    /* ================================================= */

    if (window.innerWidth < 768) {
        applyAOSMobileFix();
    }
});

// ===== DEBUG AOS (OPCIONAL) =====
function debugAOS() {
    const animatedElements = document.querySelectorAll('[data-aos]');
    console.log('=== DEBUG AOS ===');
    console.log('Total elementos:', animatedElements.length);
    console.log('Elementos animados:', document.querySelectorAll('.aos-animate').length);
    
    animatedElements.forEach((el, index) => {
        console.log(`Elemento ${index}:`, {
            tieneAosAnimate: el.classList.contains('aos-animate'),
            estiloOpacity: window.getComputedStyle(el).opacity,
            visible: el.getBoundingClientRect().top < window.innerHeight
        });
    });
}

// Ejecutar debug después de 3 segundos (opcional)
setTimeout(debugAOS, 3000);

/* === CÓDIGO ACTUALIZADO PARA EL MODAL DE PROYECTOS (en main.js) === */
/* === CON DISEÑO RESPONSIVE DE 2 COLUMNAS === */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Referencias al Modal de Proyectos ---
    const projectModal = document.getElementById('project-modal');
    if (!projectModal) {
        console.log("Modal de proyecto no encontrado. Saltando lógica del modal.");
        return; 
    }

    const modalTitle = document.getElementById('modal-project-title');
    const modalBody = document.getElementById('modal-project-body');
    const modalCloseBtn = document.getElementById('modal-close');

    const projectBtns = document.querySelectorAll('.open-modal-btn');

    projectBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); 
            const title = btn.dataset.title || 'Detalles del Proyecto';
            const projectsJson = btn.dataset.projectsJson;
            const integrantes = btn.dataset.integrantes;

            modalTitle.textContent = title;
            modalBody.innerHTML = ''; // Limpiar contenido anterior

            if (projectsJson) {
                // --- CASO 1: Construir LISTA DE 2 COLUMNAS (para Shark Tank) ---
                try {
                    const projects = JSON.parse(projectsJson);
                    
                    // 1. Contenedor principal
                    const listContainer = document.createElement('div');
                    listContainer.className = 'project-list-container';

                    // 2. Encabezado (opcional, pero le da un look pro)
                    const header = document.createElement('div');
                    header.className = 'project-list-header';
                    header.innerHTML = `
                        <div class="project-time-header">Hora</div>
                        <div class="project-details-header">Proyecto y Participantes</div>
                    `;
                    listContainer.appendChild(header);

                    // 3. Crear cada item
                    projects.forEach(project => {
                        const item = document.createElement('div');
                        item.className = 'project-item';
                        
                        // Usamos innerHTML para que las etiquetas <br> del JSON funcionen
                        item.innerHTML = `
                            <div class="project-time">
                                <span class="time-badge">${project.hora}</span>
                            </div>
                            <div class="project-details">
                                <span class="project-title">${project.titulo}</span>
                                <span class="project-participants">${project.equipo}</span>
                            </div>
                        `;
                        listContainer.appendChild(item);
                    });
                    
                    modalBody.appendChild(listContainer);

                } catch (error) {
                    console.error("Error al parsear JSON de proyectos:", error);
                    modalBody.textContent = "Error al cargar los datos de los equipos.";
                }

            } else if (integrantes) {
                // --- CASO 2: Párrafo simple (Proyectos Terminales) ---
                // Para que se vea bien, le añadimos un padding que quitamos del modal-body
                modalBody.style.padding = '20px 30px'; 

                const listTitle = document.createElement('h5');
                listTitle.textContent = 'Integrantes del Proyecto';
                modalBody.appendChild(listTitle);
                const p = document.createElement('p');
                p.textContent = integrantes;
                modalBody.appendChild(p);
            } else {
                modalBody.style.padding = '20px 30px';
                modalBody.textContent = 'No hay detalles disponibles.';
            }
            
            // Limpiar el padding por si se usó en el CASO 2
            if (projectsJson) {
                 modalBody.style.padding = '0';
            }

            projectModal.classList.add('active'); 
            projectModal.setAttribute('aria-hidden', 'false');
        });
    });

    // --- Lógica para cerrar el modal ---
    const closeModal = () => {
        projectModal.classList.remove('active');
        projectModal.setAttribute('aria-hidden', 'true');
    };

    modalCloseBtn.addEventListener('click', closeModal);
    projectModal.addEventListener('click', (e) => {
        if (e.target === projectModal) closeModal();
    });
});
