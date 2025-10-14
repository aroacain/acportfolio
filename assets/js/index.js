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
