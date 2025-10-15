// REVIEWS CAROUSEL

const track = document.querySelector('.carousel-track');
const slides = Array.from(track.children);
const nextButton = document.querySelector('.next');
const prevButton = document.querySelector('.prev');
let currentIndex = 0;
let slideInterval;

// Get width of one slide
const getSlideWidth = () => slides[0].getBoundingClientRect().width;

// Arrange slides in a row
const setSlidePositions = () => {
  slides.forEach((slide, index) => {
    slide.style.left = `${getSlideWidth() * index}px`;
  });
};

// Move to a specific slide
const moveToSlide = (index) => {
  currentIndex = (index + slides.length) % slides.length; // wrap around
  track.style.transform = `translateX(-${getSlideWidth() * currentIndex}px)`;
};

// Next/Prev Buttons
nextButton.addEventListener('click', () => {
  moveToSlide(currentIndex + 1);
  restartAutoPlay();
});
prevButton.addEventListener('click', () => {
  moveToSlide(currentIndex - 1);
  restartAutoPlay();
});

// Autoplay every 3s
const startAutoPlay = () => {
  slideInterval = setInterval(() => {
    moveToSlide(currentIndex + 1);
  }, 10000);
};

const restartAutoPlay = () => {
  clearInterval(slideInterval);
  startAutoPlay();
};

// Initialize
setSlidePositions();
startAutoPlay();
window.addEventListener('resize', () => {
  setSlidePositions();
  moveToSlide(currentIndex);
});





// ====== Smart GIF upgrade for the Global Experience map ======
(function () {
  const img = document.getElementById('global-map');
  if (!img) return;

  // Conditions under which we *do not* load the big GIF
  const isSmallScreen = window.matchMedia('(max-width: 640px)').matches; // tailwind "sm" breakpoint-ish
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Network hints (browser support varies)
  const conn = navigator.connection || navigator.webkitConnection || navigator.mozConnection;
  const saveData = !!(conn && conn.saveData);
  const slowLink = !!(conn && /^(slow-2g|2g)$/.test(conn.effectiveType || ''));

  // If any of these are true, stick to PNG
  const shouldAvoidGif = isSmallScreen || prefersReducedMotion || saveData || slowLink;

  // If we shouldn't load GIF, bail out early
  if (shouldAvoidGif) return;

  // Use IntersectionObserver to lazy-upgrade only when in/near view
  const upgrade = () => {
    const gif = img.getAttribute('data-gif');
    if (!gif) return;

    // Preload GIF off-DOM, then swap when ready to avoid flicker
    const loader = new Image();
    loader.onload = () => {
      img.src = gif;               // swap in
      img.removeAttribute('decoding'); // optional; GIF is already decoded
    };
    loader.onerror = () => {
      // If GIF fails, we silently keep PNG
      // console.warn('Map GIF failed to load, keeping PNG.');
    };
    loader.src = gif;
  };

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          upgrade();
          obs.disconnect();
          break;
        }
      }
    }, { rootMargin: '200px 0px' }); // start preloading just before it scrolls in
    io.observe(img);
  } else {
    // Fallback: time-based upgrade after load (PNG already visible)
    window.addEventListener('load', () => setTimeout(upgrade, 800), { once: true });
  }
})();