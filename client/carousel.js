document.addEventListener('DOMContentLoaded', function () {
  const carousels = document.querySelectorAll('.carousel');

  carousels.forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextBtn = carousel.querySelector('.carousel-btn.next');
    const prevBtn = carousel.querySelector('.carousel-btn.prev');

    let currentIndex = 0;

    const updateCarousel = () => {
      track.style.transform = `translateX(${currentIndex * 100}%)`;
    };

    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateCarousel();
    });
  });
});


document.addEventListener("DOMContentLoaded", () => {
  initCarousel("carousel-sale");
  initCarousel("carousel-rent");
});




  