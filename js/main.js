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
    document.querySelectorAll('.nav-link').forEach(link => {
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

// ===== SCROLL EFFECTS SIMPLE =====
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 80) {
        navbar.classList.add('scrolled');
        if (scrollTop > 200 && window.innerWidth >= 768) {
            document.querySelector('.top-bar').style.opacity = '0';
            document.querySelector('.top-bar').style.visibility = 'hidden';
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
    if (backToTop) {
        if (scrollTop > 400) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    }

    // Active nav link (solo en desktop)
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
});

// ===== SMOOTH SCROLL =====
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

// ===== CONTADOR REGRESIVO =====
function updateCountdown() {
    const eventDate = new Date('Nov 5, 2025 09:00:00').getTime();
    const now = new Date().getTime();
    const distance = eventDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Actualizar números
    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');

    if (distance < 0) {
        clearInterval(countdownInterval);
        showEventStarted();
    }
}

function showEventStarted() {
    const countdownEl = document.getElementById('countdown');
    if (countdownEl) {
        countdownEl.innerHTML = `
            <div class="event-started-message">
                <h3>¡El evento está en curso!</h3>
                <p>Únete a nosotros en el Auditorio de Ingenierías</p>
            </div>
        `;
    }
}

// Iniciar contador
const countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown();

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

// ===== FORM HANDLING SIMPLE =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Efecto de carga
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
        
        // Simular envío
        setTimeout(() => {
            alert('¡Mensaje enviado! Te contactaremos en breve.');
            
            // Resetear formulario
            this.reset();
            
            // Restaurar botón
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// ===== BACK TO TOP =====
const backToTop = document.getElementById('backToTop');
if (backToTop) {
    backToTop.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
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
    
    console.log('XIX CEI 2025 - Mobile First Corregido');
});

// ===== PREVENIR COMPORTAMIENTOS NO DESEADOS EN MÓVIL =====
document.addEventListener('touchstart', function() {}, { passive: true });
document.addEventListener('touchmove', function() {}, { passive: true });