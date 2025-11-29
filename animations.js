// ========================================
// ANIMACIONES LIGERAS - Agroequipos Izabal
// Sin GSAP - Solo CSS + Vanilla JS
// ========================================

// ========================================
// 1. INICIALIZAR AOS (Animate On Scroll)
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    // Agregar AOS a elementos que no lo tienen
    addAOSToElements();
    
    // Inicializar AOS
    AOS.init({
        duration: 1000,
        easing: 'ease-out-cubic',
        once: false,
        offset: 100,
        delay: 0,
        anchorPlacement: 'top-bottom',
        disable: false
    });
});

// Agregar AOS dinámicamente a elementos
function addAOSToElements() {
    // Section headers
    document.querySelectorAll('.section-header:not([data-aos])').forEach(header => {
        header.setAttribute('data-aos', 'fade-up');
    });
    
    // Section titles
    document.querySelectorAll('.section-title:not([data-aos])').forEach(title => {
        title.setAttribute('data-aos', 'fade-down');
        title.setAttribute('data-aos-duration', '800');
    });
    
    // Section subtitles
    document.querySelectorAll('.section-subtitle:not([data-aos])').forEach(subtitle => {
        subtitle.setAttribute('data-aos', 'fade-up');
        subtitle.setAttribute('data-aos-delay', '200');
    });
    
    // Servicio cards
    document.querySelectorAll('.servicio-card:not([data-aos])').forEach((card, index) => {
        card.setAttribute('data-aos', 'flip-up');
        card.setAttribute('data-aos-delay', (index * 150).toString());
    });
    
    // Gallery items
    document.querySelectorAll('.gallery-item:not([data-aos])').forEach((item, index) => {
        item.setAttribute('data-aos', 'zoom-in-up');
        item.setAttribute('data-aos-delay', (index * 100).toString());
    });
    
    // Trust badges
    document.querySelectorAll('.trust-badge:not([data-aos])').forEach((badge, index) => {
        badge.setAttribute('data-aos', 'fade-up');
        badge.setAttribute('data-aos-delay', (index * 100).toString());
    });
    
    // Marca cards
    document.querySelectorAll('.marca-card:not([data-aos])').forEach((card, index) => {
        const animation = index % 2 === 0 ? 'fade-right' : 'fade-left';
        card.setAttribute('data-aos', animation);
        card.setAttribute('data-aos-delay', (index * 200).toString());
    });
    
    // Info items
    document.querySelectorAll('.info-item:not([data-aos])').forEach((item, index) => {
        item.setAttribute('data-aos', 'fade-left');
        item.setAttribute('data-aos-delay', (index * 150).toString());
    });
    
    // Form
    const form = document.querySelector('.contacto-form:not([data-aos])');
    if (form) {
        form.setAttribute('data-aos', 'fade-right');
    }
    
    // Contact info
    const contactInfo = document.querySelector('.contacto-info:not([data-aos])');
    if (contactInfo) {
        contactInfo.setAttribute('data-aos', 'fade-left');
    }
}

// ========================================
// 2. PARTICLES.JS - Fondo Animado
// ========================================
if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: '#c89f5d'
            },
            shape: {
                type: 'circle',
                stroke: {
                    width: 0,
                    color: '#000000'
                }
            },
            opacity: {
                value: 0.3,
                random: true,
                anim: {
                    enable: true,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: true,
                    speed: 2,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#c89f5d',
                opacity: 0.2,
                width: 1
            },
            move: {
                enable: true,
                speed: 1,
                direction: 'none',
                random: false,
                straight: false,
                out_mode: 'out',
                bounce: false,
                attract: {
                    enable: false,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'grab'
                },
                onclick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 140,
                    line_linked: {
                        opacity: 0.5
                    }
                },
                push: {
                    particles_nb: 4
                }
            }
        },
        retina_detect: true
    });
}

// ========================================
// 3. TILT EFFECT EN TARJETAS (Vanilla JS)
// ========================================
function initTiltEffect() {
    const cards = document.querySelectorAll('.producto-card, .servicio-card, .trust-badge');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', handleTilt);
        card.addEventListener('mouseleave', resetTilt);
    });
    
    function handleTilt(e) {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        card.style.transition = 'transform 0.1s ease';
    }
    
    function resetTilt(e) {
        const card = e.currentTarget;
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        card.style.transition = 'transform 0.5s ease';
    }
}

// ========================================
// 4. CONTADOR ANIMADO (CountUp Effect)
// ========================================
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + '+';
        }
    }, 16);
}

// Inicializar contadores cuando sean visibles
function initCounters() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                const target = parseInt(entry.target.getAttribute('data-count'));
                animateCounter(entry.target, target);
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('[data-count]').forEach(counter => {
        observer.observe(counter);
    });
}

// ========================================
// 5. CURSOR PERSONALIZADO - DESACTIVADO
// ========================================
// Función eliminada por solicitud del usuario

// ========================================
// 5. MAGNETIC BUTTONS
// ========================================
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn, .whatsapp-button');
    
    buttons.forEach(button => {
        button.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            this.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(0, 0)';
        });
    });
}

// ========================================
// 6. PARALLAX SCROLL
// ========================================
function initParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        // Hero parallax
        const heroVisual = document.querySelector('.hero-visual');
        if (heroVisual) {
            heroVisual.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
        
        // Títulos parallax
        const titles = document.querySelectorAll('.section-title');
        titles.forEach(title => {
            const rect = title.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const offset = (window.innerHeight - rect.top) * 0.1;
                title.style.transform = `translateY(-${offset}px)`;
            }
        });
    });
}

// ========================================
// 7. IMAGE REVEAL EFFECT
// ========================================
function initImageReveal() {
    const images = document.querySelectorAll('.gallery-image, .producto-image');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.2 });
    
    images.forEach(img => observer.observe(img));
}

// ========================================
// 8. SMOOTH SCROLL
// ========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// 9. TYPING EFFECT
// ========================================
function initTypingEffect() {
    const element = document.querySelector('[data-typing]');
    if (!element) return;
    
    const text = element.getAttribute('data-typing');
    const speed = 100;
    let i = 0;
    
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    // Iniciar cuando sea visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                type();
                observer.disconnect();
            }
        });
    });
    
    observer.observe(element);
}

// ========================================
// 10. FORM ANIMATIONS
// ========================================
function initFormAnimations() {
    const inputs = document.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        // Label flotante
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Validación animada
        input.addEventListener('invalid', function(e) {
            e.preventDefault();
            this.classList.add('shake');
            setTimeout(() => this.classList.remove('shake'), 500);
        });
    });
}

// ========================================
// 11. SCROLL PROGRESS BAR
// ========================================
function initScrollProgress() {
    const progressBar = document.getElementById('scrollProgress');
    if (!progressBar) return;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        
        progressBar.style.width = scrollPercent + '%';
    });
}

// ========================================
// 12. INICIALIZACIÓN GLOBAL
// ========================================
window.addEventListener('load', () => {
    // Esperar a que el preloader termine
    setTimeout(() => {
        initTiltEffect();
        initCounters();
        initMagneticButtons();
        initParallax();
        initImageReveal();
        initSmoothScroll();
        initTypingEffect();
        initFormAnimations();
        initScrollProgress();
    }, 600);
});

// Reiniciar AOS al resize
window.addEventListener('resize', () => {
    AOS.refresh();
});
