// Hamburger Menu
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close menu when a link is clicked (for mobile)
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            // Delay closing slightly to allow link click to register
            setTimeout(() => {
                 navLinks.classList.remove('active');
            }, 150);
        });
    });
}

// Theme Toggle
const themeToggleBtn = document.getElementById('theme-toggle');
const body = document.body;
const themeKey = 'hotelDiamanteTheme';

// Function to set the theme
function setTheme(theme) {
    if (theme === 'dark') {
        body.classList.add('dark-mode');
        themeToggleBtn.textContent = '☀️'; // Show sun icon (switch to light)
        localStorage.setItem(themeKey, 'dark');
    } else {
        body.classList.remove('dark-mode');
        themeToggleBtn.textContent = '🌙'; // Show moon icon (switch to dark)
        localStorage.setItem(themeKey, 'light');
    }
}

// Check for saved theme preference on page load
const savedTheme = localStorage.getItem(themeKey);
if (savedTheme) {
    setTheme(savedTheme);
} else {
    // Default to light mode if no preference is saved
    setTheme('light');
}

// Add event listener to button
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = body.classList.contains('dark-mode') ? 'dark' : 'light';
        setTheme(currentTheme === 'light' ? 'dark' : 'light');
    });
}

// Carousel (only runs on index.html)
const carouselSlide = document.querySelector('.carousel-slide');
const carouselImages = document.querySelectorAll('.carousel-slide img');
const prevBtn = document.querySelector('.carousel-prev');
const nextBtn = document.querySelector('.carousel-next');
const dotsContainer = document.querySelector('.carousel-dots');

// Get references to the text elements to be updated
const carouselTitle = document.getElementById('carousel-title');
const carouselSubtitle = document.getElementById('carousel-subtitle');

// Define texts for each slide (make sure this matches the number of images)
const carouselTexts = [
    { title: 'Bienvenido al Hotel Diamante', subtitle: 'Lujo y comodidad en el corazón de la ciudad.' }, // Corresponds to hotel-exterior.png
    { title: 'Tu Mejor Opción', subtitle: 'Habitaciones de ensueño para una estancia inolvidable.' }, // Corresponds to hotel-room.png
    { title: 'Relájate y Disfruta', subtitle: 'Sumérgete en nuestra espectacular piscina.' }, // Corresponds to hotel-pool.png
];

let counter = 0;
const size = carouselImages[0] ? carouselImages[0].clientWidth : 0; // Check if images exist
let autoSlideInterval;

if (carouselSlide && carouselImages.length > 0) {
    // Create dots
    dotsContainer.innerHTML = ''; // Clear any existing dots
    carouselImages.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        dotsContainer.appendChild(dot);
        dot.addEventListener('click', () => {
            counter = index;
            slideCarousel();
            stopAutoSlide(); // Stop auto slide on manual navigation
            startAutoSlide(); // Restart auto slide after manual navigation
        });
    });

    const dots = dotsContainer.querySelectorAll('.dot');

    // Function to update dot active state
    function updateDots() {
        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[counter]) {
             dots[counter].classList.add('active');
        }
    }

    // Initial position and dot
    carouselSlide.style.transform = 'translateX(' + (-size * counter) + 'px)';
    updateDots();

    // Button Listeners
    nextBtn.addEventListener('click', () => {
        counter++;
        slideCarousel();
        stopAutoSlide(); // Stop auto slide on manual navigation
        startAutoSlide(); // Restart auto slide after manual navigation
    });

    prevBtn.addEventListener('click', () => {
        counter--;
        slideCarousel();
        stopAutoSlide(); // Stop auto slide on manual navigation
        startAutoSlide(); // Restart auto slide after manual navigation
    });

    function slideCarousel() {
        // Disable buttons during transition
        nextBtn.disabled = true;
        prevBtn.disabled = true;

        // Handle looping
        if (counter < 0) {
             counter = carouselImages.length - 1;
        } else if (counter >= carouselImages.length) {
            counter = 0;
        }

        carouselSlide.style.transform = 'translateX(' + (-size * counter) + 'px)';

        // Update active dot
        updateDots();

        // Update text
        updateCarouselText(counter);

         // Re-enable buttons after transition
         carouselSlide.addEventListener('transitionend', () => {
             nextBtn.disabled = false;
             prevBtn.disabled = false;
         }, { once: true });
    }

    function updateCarouselText(index) {
        if (carouselTexts[index]) {
            carouselTitle.textContent = carouselTexts[index].title;
            carouselSubtitle.textContent = carouselTexts[index].subtitle;
        }
    }

    // Auto slide functionality
    function startAutoSlide() {
        // Clear existing interval before starting a new one
        stopAutoSlide(); 
        autoSlideInterval = setInterval(() => {
            counter++;
            slideCarousel();
        }, 5000); // Change image every 5 seconds
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // Start auto slide on load
    startAutoSlide();

    const carouselContainer = document.querySelector('.carousel-container');
    // Pause auto slide on hover
    carouselContainer.addEventListener('mouseenter', stopAutoSlide);
    carouselContainer.addEventListener('mouseleave', startAutoSlide);

    // Initial text update
    updateCarouselText(counter);

} else {
    // If carousel elements not found (e.g., on service pages), ensure no errors
    // console.warn("Carousel elements not found on this page."); 
    // Hide carousel controls and text if not on index page
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        // This is a simple check, might need refinement
        // Check if it's NOT the index page by looking for sections other than hero
        const otherSections = document.querySelectorAll('section:not(.hero-section)');
        if (otherSections.length > 0) {
            // It's likely a service page or similar, hide carousel parts
            // Add a class or directly manipulate if needed, but this script
            // primarily handles index.html features.
            // A better approach is to only load carousel logic on index.html
            // This "else" block acts as a safeguard.
        }
    }
}