// DOM Elements
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const form = document.querySelector('.form');
const header = document.querySelector('.header');
const preloader = document.getElementById('preloader');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const scrollProgress = document.getElementById('scrollProgress');

// Typewriter Animation
function typeWriter() {
    const typewriterElement = document.querySelector('.typewriter');
    if (!typewriterElement) return;
    
    const text = typewriterElement.getAttribute('data-text');
    typewriterElement.textContent = '';
    typewriterElement.classList.add('typing');
    
    let i = 0;
    const speed = 100; // velocidad de escritura en milisegundos
    
    function type() {
        if (i < text.length) {
            typewriterElement.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            // Mantener el cursor parpadeando por un tiempo después de terminar
            setTimeout(() => {
                typewriterElement.style.borderRight = 'none';
            }, 3000);
        }
    }
    
    // Iniciar la animación después de un pequeño delay
    setTimeout(type, 1000);
}

// Preloader Functions
function updateProgress(percent) {
    if (progressFill && progressText) {
        progressFill.style.width = percent + '%';
        progressText.textContent = Math.round(percent) + '%';
    }
}

function simulateLoading() {
    if (!preloader || document.readyState === 'complete') return;
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress > 85) {
            clearInterval(interval);
            progress = 85;
        }
        updateProgress(progress);
    }, 150);
}

function hidePreloader() {
    if (preloader) {
        preloader.classList.add('fade-out');
        preloader.setAttribute('aria-hidden', 'true');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
}

// Scroll Progress Bar
function updateScrollProgress() {
    if (!scrollProgress) return;
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / scrollHeight) * 100;
    
    scrollProgress.style.width = Math.min(scrollPercent, 100) + '%';
}

// Initialize Preloader
function initPreloader() {
    if (!preloader) return;

    simulateLoading();

    window.addEventListener('load', () => {
        updateProgress(100);
        setTimeout(hidePreloader, 300);
    });

    if (document.readyState === 'complete') {
        updateProgress(100);
        requestAnimationFrame(hidePreloader);
    }
}


// Mobile Navigation Toggle
if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        const expanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', String(!expanded));
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navToggle) {
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
        if (navMenu) {
            navMenu.classList.remove('active');
        }
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (navMenu && navToggle) {
        const isClickInsideMenu = navMenu.contains(e.target);
        const isClickOnToggle = navToggle.contains(e.target);
        
        if (!isClickInsideMenu && !isClickOnToggle && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('active');
        }
    }
});

// Optimizar scroll con throttle para mejor rendimiento
let scrollTimeout;
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            // Header background - usar clases para consistencia
            if (header) {
                if (window.scrollY > 100) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }
            
            // Update scroll progress
            updateScrollProgress();
            
            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = header ? header.offsetHeight : 0;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Form submission
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Basic validation
        if (!data.nombre || !data.email || !data.mensaje || !data.producto) {
            showNotification('Por favor, completa todos los campos obligatorios.', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showNotification('Por favor, ingresa un email válido.', 'error');
            return;
        }
        
        // Prepare WhatsApp message
        const whatsappNumber = '50230200965'; // Número de WhatsApp (sin + y sin espacios)
        const message = `¡Hola! Me interesa obtener información sobre sus productos.

*Datos de contacto:*
• Nombre: ${data.nombre}
• Email: ${data.email}
• Teléfono: ${data.telefono || 'No proporcionado'}

*Producto de interés:* ${data.producto}

*Mensaje:*
${data.mensaje}

Enviado desde: www.agroequiposizabal.com`;
        
        // Encode message for URL
        const encodedMessage = encodeURIComponent(message);
        
        // Create WhatsApp URL
        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        
        // Open WhatsApp
        window.open(whatsappURL, '_blank');
        
        // Show success notification
        showNotification('¡Redirigiendo a WhatsApp! Tu mensaje se ha preparado automáticamente.', 'success');
        
        // Reset form after a short delay
        setTimeout(() => {
            form.reset();
        }, 1000);
    });
}
// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
        word-wrap: break-word;
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.75rem;
    `;
    
    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
        opacity: 0.8;
        transition: opacity 0.2s ease;
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        closeNotification(notification);
    });
    
    // Auto close after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            closeNotification(notification);
        }
    }, 5000);
}

function closeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.remove();
        }
    }, 300);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.classList.contains('section-header')) {
                entry.target.classList.add('animate');
            } else {
                entry.target.classList.add('fade-in-up');
            }
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.producto-card, .marca-card, .info-item, .servicio-card, .gallery-item, .section-header');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    // Animate service icons on hover
    const servicioCards = document.querySelectorAll('.servicio-card');
    servicioCards.forEach(card => {
        const icon = card.querySelector('.animated-icon');
        
        card.addEventListener('mouseenter', () => {
            icon.style.animation = 'bounce 0.6s ease-in-out';
        });
        
        card.addEventListener('mouseleave', () => {
            setTimeout(() => {
                icon.style.animation = '';
            }, 600);
        });
    });
});

// Active navigation link highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
});

// Add active class styles
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: var(--primary-color) !important;
    }
    
    .nav-link.active::after {
        width: 100% !important;
    }
`;
document.head.appendChild(style);

// Product card click interactions
document.addEventListener('DOMContentLoaded', () => {
    const productCards = document.querySelectorAll('.producto-card');
    
    productCards.forEach(card => {
        card.addEventListener('click', () => {
            const productName = card.querySelector('h3').textContent;
            const productSelect = document.querySelector('#producto');
            
            // Scroll to contact form
            const contactSection = document.querySelector('#contacto');
            if (!contactSection || !productSelect) {
                return;
            }

            const headerHeight = header ? header.offsetHeight : 0;
            const targetPosition = contactSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Pre-select the product in the form
            setTimeout(() => {
                if (!productSelect) {
                    return;
                }

                const optionValue = productName.toLowerCase().replace(' de agua', '').replace('s', '');
                const option = productSelect.querySelector(`option[value="${optionValue}"]`);
                if (option) {
                    productSelect.value = optionValue;
                    productSelect.focus();
                }
            }, 1000);
        });
    });
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize preloader
    initPreloader();
});

// Loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    // Iniciar la animación de escritura cuando la página carga
    setTimeout(() => {
        typeWriter();
    }, 2000); // Delay to allow preloader to finish
});

// Add loading styles
const loadingStyle = document.createElement('style');
loadingStyle.textContent = `
    body {
        opacity: 0;
        transition: opacity 0.5s ease;
    }
    
    body.loaded {
        opacity: 1;
    }
    
    .producto-card, .marca-card {
        cursor: pointer;
        user-select: none;
    }
    
    .producto-card:active, .marca-card:active {
        transform: translateY(-2px) scale(0.98);
    }
`;
document.head.appendChild(loadingStyle);

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu
        if (navToggle) {
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
        if (navMenu) {
            navMenu.classList.remove('active');
        }
        
        // Close notifications
        const notifications = document.querySelectorAll('.notification');
        notifications.forEach(notification => {
            closeNotification(notification);
        });
    }
});

// Performance optimization: Debounce scroll events
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

// Apply debounce to scroll events
const debouncedScrollHandler = debounce(() => {
    // Active navigation highlighting
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Parallax suave para el hero
function initHeroParallax() {
    const heroVisual = document.querySelector('.hero-visual');
    const heroContent = document.querySelector('.hero-content');
    
    if (!heroVisual || !heroContent) return;
    
    const parallaxScroll = () => {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.hero');
        
        if (!heroSection) return;
        
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        
        // Solo aplicar parallax cuando el hero está visible
        if (scrolled < heroBottom) {
            // Movimiento sutil de la imagen (más lento que el scroll)
            const imageOffset = scrolled * 0.3;
            if (heroVisual) {
                heroVisual.style.transform = `translateY(${imageOffset}px)`;
            }
            
            // Movimiento muy sutil del contenido (efecto de profundidad)
            const contentOffset = scrolled * 0.15;
            if (heroContent) {
                heroContent.style.transform = `translateY(${contentOffset}px)`;
            }
        }
    };
    
    // Usar requestAnimationFrame para mejor performance
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                parallaxScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Inicializar parallax después de que cargue la página
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroParallax);
} else {
    initHeroParallax();
}

// Intersection Observer para animaciones de entrada
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Agregar delay escalonado para efecto cascada
                setTimeout(() => {
                    entry.target.classList.add('reveal');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observar tarjetas de productos
    const productoCards = document.querySelectorAll('.producto-card');
    productoCards.forEach(card => observer.observe(card));

    // Observar tarjetas de servicios
    const servicioCards = document.querySelectorAll('.servicio-card');
    servicioCards.forEach(card => observer.observe(card));

    // Observar items de galería
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => observer.observe(item));

    // Observar headers de sección
    const sectionHeaders = document.querySelectorAll('.section-header');
    sectionHeaders.forEach(header => observer.observe(header));
    
    // Observar badges de confianza
    const trustBadges = document.querySelectorAll('.trust-badge');
    trustBadges.forEach(badge => observer.observe(badge));
}

// Lightbox minimalista para galería
function initLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (galleryItems.length === 0) return;

    // Crear estructura del lightbox
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-overlay"></div>
        <div class="lightbox-content">
            <button class="lightbox-close" aria-label="Cerrar">&times;</button>
            <img src="" alt="" class="lightbox-image">
            <p class="lightbox-caption"></p>
        </div>
    `;
    document.body.appendChild(lightbox);

    const lightboxOverlay = lightbox.querySelector('.lightbox-overlay');
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const lightboxClose = lightbox.querySelector('.lightbox-close');

    // Abrir lightbox
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('.gallery-image img');
            const caption = item.querySelector('.gallery-caption');
            
            lightboxImage.src = img.src;
            lightboxImage.alt = img.alt;
            lightboxCaption.textContent = caption ? caption.textContent : '';
            
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Cerrar lightbox
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxOverlay.addEventListener('click', closeLightbox);
    
    // Cerrar con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

// Sistema de Partículas en Hero
function initParticles() {
    const canvas = document.getElementById('particlesCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    
    // Configurar tamaño del canvas
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Clase Partícula
    class Particle {
        constructor() {
            this.reset();
            this.y = Math.random() * canvas.height;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.twinkle = Math.random() > 0.7; // 30% de partículas parpadean
            this.twinkleSpeed = Math.random() * 0.02 + 0.01;
            this.twinklePhase = Math.random() * Math.PI * 2;
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = -10;
            this.size = Math.random() * 5 + 2;
            this.speedY = Math.random() * 0.8 + 0.3;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.7 + 0.3;
            this.baseOpacity = this.opacity;
        }
        
        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            
            // Efecto de parpadeo
            if (this.twinkle) {
                this.twinklePhase += this.twinkleSpeed;
                this.opacity = this.baseOpacity + Math.sin(this.twinklePhase) * 0.3;
            }
            
            // Resetear si sale de la pantalla
            if (this.y > canvas.height) {
                this.reset();
            }
            
            if (this.x < 0 || this.x > canvas.width) {
                this.x = Math.random() * canvas.width;
            }
        }
        
        draw() {
            // Glow effect más intenso
            ctx.shadowBlur = 20;
            ctx.shadowColor = `rgba(200, 159, 93, ${this.opacity})`;
            
            // Partícula principal
            ctx.fillStyle = `rgba(200, 159, 93, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Halo adicional
            ctx.shadowBlur = 30;
            ctx.fillStyle = `rgba(230, 197, 122, ${this.opacity * 0.6})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2);
            ctx.fill();
            
            // Reset shadow
            ctx.shadowBlur = 0;
        }
    }
    
    // Crear partículas
    function createParticles() {
        const particleCount = window.innerWidth < 768 ? 50 : 80;
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    createParticles();
    
    // Animar partículas
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Conectar partículas cercanas
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    const opacity = 0.3 * (1 - distance / 150);
                    ctx.strokeStyle = `rgba(200, 159, 93, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.shadowBlur = 5;
                    ctx.shadowColor = `rgba(200, 159, 93, ${opacity * 0.5})`;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                    ctx.shadowBlur = 0;
                }
            }
        }
        
        animationId = requestAnimationFrame(animate);
    }
    
    animate();
    
    // Limpiar al salir
    window.addEventListener('beforeunload', () => {
        cancelAnimationFrame(animationId);
    });
}

// Parallax Effect
function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    if (parallaxElements.length === 0) return;
    
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                parallaxElements.forEach(el => {
                    const speed = el.dataset.parallax || 0.5;
                    const yPos = -(window.pageYOffset * speed);
                    el.style.transform = `translateY(${yPos}px)`;
                });
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

// Inicializar todas las funciones
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initScrollAnimations();
        initLightbox();
        initParticles();
        initParallax();
    });
} else {
    initScrollAnimations();
    initLightbox();
    initParticles();
    initParallax();
}
