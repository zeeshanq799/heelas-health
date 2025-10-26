/**
 * Heelas Health Care Services - Main JavaScript
 * Handles navigation, animations, and interactive elements
 */

(function() {
  'use strict';

  // ==========================================
  // NAVBAR SCROLL EFFECT
  // ==========================================
  window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
      navbar.classList.remove('navbar-transparent');
    } else {
      // Only add transparent class on home page
      if (document.querySelector('.hero-section')) {
        navbar.classList.add('navbar-transparent');
      }
      navbar.classList.remove('scrolled');
    }
  });

  // Set initial navbar state on page load
  window.addEventListener('load', function() {
    const navbar = document.querySelector('.navbar');
    if (document.querySelector('.hero-slider') || document.querySelector('.hero-section')) {
      // Home page - start transparent
      navbar.classList.add('navbar-transparent');
    } else {
      // Other pages - start with background
      navbar.classList.remove('navbar-transparent');
    }
  });

  // ==========================================
  // HERO SLIDER
  // ==========================================
  const heroSlider = document.querySelector('.hero-slider');

  if (heroSlider) {
    const slides = heroSlider.querySelectorAll('.hero-slide');
    const dots = heroSlider.querySelectorAll('.hero-dot');
    const prevArrow = heroSlider.querySelector('.hero-arrow-prev');
    const nextArrow = heroSlider.querySelector('.hero-arrow-next');
    let currentSlide = 0;
    let slideInterval;

    // Function to show specific slide
    function showSlide(index) {
      // Remove active class from all slides and dots
      slides.forEach(slide => slide.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));

      // Ensure index is within bounds
      if (index >= slides.length) {
        currentSlide = 0;
      } else if (index < 0) {
        currentSlide = slides.length - 1;
      } else {
        currentSlide = index;
      }

      // Add active class to current slide and dot
      slides[currentSlide].classList.add('active');
      dots[currentSlide].classList.add('active');
    }

    // Function to go to next slide
    function nextSlide() {
      showSlide(currentSlide + 1);
    }

    // Function to go to previous slide
    function prevSlide() {
      showSlide(currentSlide - 1);
    }

    // Auto advance slides
    function startSlideShow() {
      slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }

    // Stop auto advance
    function stopSlideShow() {
      clearInterval(slideInterval);
    }

    // Event listeners for arrows
    if (prevArrow) {
      prevArrow.addEventListener('click', function() {
        prevSlide();
        stopSlideShow();
        startSlideShow(); // Restart auto-advance after manual navigation
      });
    }

    if (nextArrow) {
      nextArrow.addEventListener('click', function() {
        nextSlide();
        stopSlideShow();
        startSlideShow();
      });
    }

    // Event listeners for dots
    dots.forEach((dot, index) => {
      dot.addEventListener('click', function() {
        showSlide(index);
        stopSlideShow();
        startSlideShow();
      });
    });

    // Pause on hover
    heroSlider.addEventListener('mouseenter', stopSlideShow);
    heroSlider.addEventListener('mouseleave', startSlideShow);

    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    heroSlider.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
      stopSlideShow();
    });

    heroSlider.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
      startSlideShow();
    });

    function handleSwipe() {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          // Swipe left - next slide
          nextSlide();
        } else {
          // Swipe right - previous slide
          prevSlide();
        }
      }
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
      if (heroSlider) {
        if (e.key === 'ArrowLeft') {
          prevSlide();
          stopSlideShow();
          startSlideShow();
        } else if (e.key === 'ArrowRight') {
          nextSlide();
          stopSlideShow();
          startSlideShow();
        }
      }
    });

    // Start the slideshow
    startSlideShow();
  }

  // ==========================================
  // SMOOTH SCROLLING FOR ANCHOR LINKS
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href !== '') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const offsetTop = target.offsetTop - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // ==========================================
  // MOBILE MENU AUTO CLOSE
  // ==========================================
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  const menuToggle = document.getElementById('navbarNav');
  const bsCollapse = menuToggle ? new bootstrap.Collapse(menuToggle, {toggle: false}) : null;

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 992 && bsCollapse) {
        bsCollapse.hide();
      }
    });
  });

  // ==========================================
  // ACTIVE NAVIGATION HIGHLIGHT
  // ==========================================
  function setActiveNav() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      
      if (href === currentPath || 
          (currentPath === '/' && href === 'index.html') ||
          (currentPath.includes(href) && href !== '#')) {
        link.classList.add('active');
      }
    });
  }

  // Call on page load
  setActiveNav();

  // ==========================================
  // FORM VALIDATION
  // ==========================================
  const forms = document.querySelectorAll('.needs-validation');

  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });

  // ==========================================
  // PHONE NUMBER FORMATTING
  // ==========================================
  const phoneInputs = document.querySelectorAll('input[type="tel"]');
  
  phoneInputs.forEach(input => {
    input.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 0) {
        if (value.length <= 3) {
          value = value;
        } else if (value.length <= 6) {
          value = value.slice(0, 3) + '-' + value.slice(3);
        } else {
          value = value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6, 10);
        }
      }
      e.target.value = value;
    });
  });

  // ==========================================
  // LAZY LOADING IMAGES
  // ==========================================
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

    const lazyImages = document.querySelectorAll('img.lazy');
    lazyImages.forEach(img => imageObserver.observe(img));
  }

  // ==========================================
  // BACK TO TOP BUTTON
  // ==========================================
  const backToTopButton = document.querySelector('.back-to-top');
  
  if (backToTopButton) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 300) {
        backToTopButton.classList.add('show');
      } else {
        backToTopButton.classList.remove('show');
      }
    });

    backToTopButton.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ==========================================
  // APPOINTMENT FORM HANDLING
  // ==========================================
  const appointmentForm = document.getElementById('appointmentForm');
  
  if (appointmentForm) {
    appointmentForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      if (appointmentForm.checkValidity()) {
        // Get form data
        const formData = new FormData(appointmentForm);
        const data = Object.fromEntries(formData);
        
        // Here you would normally send to server
        console.log('Appointment Data:', data);
        
        // Show success message
        alert('Thank you! Your appointment request has been submitted. We will contact you shortly to confirm.');
        
        // Reset form
        appointmentForm.reset();
        appointmentForm.classList.remove('was-validated');
      } else {
        appointmentForm.classList.add('was-validated');
      }
    });
  }

  // ==========================================
  // CONTACT FORM HANDLING
  // ==========================================
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      if (contactForm.checkValidity()) {
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        console.log('Contact Data:', data);
        
        alert('Thank you for contacting us! We will respond to your inquiry shortly.');
        
        contactForm.reset();
        contactForm.classList.remove('was-validated');
      } else {
        contactForm.classList.add('was-validated');
      }
    });
  }

  // ==========================================
  // CAREERS FORM HANDLING
  // ==========================================
  const careerForm = document.getElementById('careerForm');
  
  if (careerForm) {
    careerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      if (careerForm.checkValidity()) {
        const formData = new FormData(careerForm);
        const data = Object.fromEntries(formData);
        
        console.log('Career Application:', data);
        
        alert('Thank you for your application! We will review your information and contact you if there is a match.');
        
        careerForm.reset();
        careerForm.classList.remove('was-validated');
      } else {
        careerForm.classList.add('was-validated');
      }
    });
  }

  // ==========================================
  // INITIALIZE AOS (Animate On Scroll)
  // ==========================================
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 100
    });
  }

  // ==========================================
  // COUNTER ANIMATION
  // ==========================================
  const counters = document.querySelectorAll('.counter');
  
  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.getAttribute('data-target'));
          const duration = 2000;
          const increment = target / (duration / 16);
          let current = 0;

          const updateCounter = () => {
            current += increment;
            if (current < target) {
              counter.textContent = Math.floor(current);
              requestAnimationFrame(updateCounter);
            } else {
              counter.textContent = target;
            }
          };

          updateCounter();
          counterObserver.unobserve(counter);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
  }

  // ==========================================
  // ACCORDION FUNCTIONALITY (For FAQs)
  // ==========================================
  const accordionButtons = document.querySelectorAll('.accordion-button');
  
  accordionButtons.forEach(button => {
    button.addEventListener('click', function() {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      
      // Close all other accordions
      accordionButtons.forEach(btn => {
        if (btn !== this) {
          btn.setAttribute('aria-expanded', 'false');
          btn.classList.add('collapsed');
        }
      });
    });
  });

  // ==========================================
  // TESTIMONIAL SLIDER (If using Swiper)
  // ==========================================
  if (typeof Swiper !== 'undefined') {
    const testimonialSwiper = document.querySelector('.testimonial-swiper');
    
    if (testimonialSwiper) {
      new Swiper(testimonialSwiper, {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        breakpoints: {
          768: {
            slidesPerView: 2,
          },
          992: {
            slidesPerView: 3,
          }
        }
      });
    }
  }

  // ==========================================
  // PRELOADER (Optional)
  // ==========================================
  window.addEventListener('load', function() {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 500);
    }
  });

  // ==========================================
  // PARALLAX EFFECT FOR HERO SECTIONS
  // ==========================================
  window.addEventListener('scroll', function() {
    const parallaxElements = document.querySelectorAll('.parallax-bg');
    
    parallaxElements.forEach(element => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * 0.5;
      element.style.transform = 'translate3d(0, ' + rate + 'px, 0)';
    });
  });

  // ==========================================
  // EMERGENCY NUMBER CLICK TRACKING
  // ==========================================
  const emergencyNumbers = document.querySelectorAll('a[href^="tel:911"]');
  
  emergencyNumbers.forEach(link => {
    link.addEventListener('click', function() {
      console.log('Emergency number called');
      // You can add analytics tracking here
    });
  });

  // ==========================================
  // SERVICE AREA CHECK (Optional Feature)
  // ==========================================
  function checkServiceArea(zipCode) {
    // Example service area zipcodes
    const serviceAreas = ['94577', '94578', '94579', '94580', '94601', '94602'];
    return serviceAreas.includes(zipCode);
  }

  const zipCheckInput = document.getElementById('zipCodeCheck');
  if (zipCheckInput) {
    zipCheckInput.addEventListener('blur', function() {
      const zip = this.value.trim();
      if (zip.length === 5) {
        const inArea = checkServiceArea(zip);
        const message = inArea ? 
          'Great! We serve your area.' : 
          'Please call us to verify service availability in your area.';
        
        const messageEl = document.getElementById('zipMessage');
        if (messageEl) {
          messageEl.textContent = message;
          messageEl.className = inArea ? 'text-success' : 'text-warning';
        }
      }
    });
  }

  // ==========================================
  // CONSOLE LOG FOR DEBUGGING
  // ==========================================
  console.log('Heelas Healthcare - JavaScript Loaded Successfully');

})();
