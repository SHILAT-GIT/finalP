/*קרוסלה*/
/*const slider1 = document.querySelector('.slider1');
const prevBtn1 = document.querySelector('.prev-btn1');
const nextBtn1 = document.querySelector('.next-btn1');
let slideIndex1 = 0;

prevBtn1.addEventListener('click', () => {
    if (slideIndex1 > 0) {
        slideIndex1--;
        slider1.style.transform = `translateX(-${slideIndex1 * 33.33}%)`;
    }
});

nextBtn1.addEventListener('click', () => {
    if (slideIndex1 < 2) {
        slideIndex1++;
        slider1.style.transform = `translateX(-${slideIndex1 * 33.33}%)`;
    }
});

const slider2 = document.querySelector('.slider2');
const prevBtn2 = document.querySelector('.prev-btn2');
const nextBtn2 = document.querySelector('.next-btn2');
let slideIndex2 = 0;

prevBtn2.addEventListener('click', () => {
    if (slideIndex2 > 0) {
        slideIndex2--;
        slider2.style.transform = `translateX(-${slideIndex2 * 33.33}%)`;
    }
});

nextBtn2.addEventListener('click', () => {
    if (slideIndex2 < 2) {
        slideIndex2++;
        slider2.style.transform = `translateX(-${slideIndex2 * 33.33}%)`;
    }
});*/
/*סוף הקרוסלה*/


/*function initCarousel(id) {
  const carousel = document.getElementById(id);
  const track = carousel.querySelector(".carousel-track");
  const prevBtn = carousel.querySelector(".prev");
  const nextBtn = carousel.querySelector(".next");
  const slides = Array.from(track.children);
  console.log(slides); // בדיקה

  let index = 0;

  function updateSlide() {
    track.style.transform = `translateX(-${index * 100}%)`;
  }

  prevBtn.addEventListener("click", () => {
    index = (index - 1 + slides.length) % slides.length;
    updateSlide();
  });

  nextBtn.addEventListener("click", () => {
    index = (index + 1) % slides.length;
    updateSlide();
  });
}

// הפעלת הקרוסלות
initCarousel("carousel-sale");
initCarousel("carousel-rent");*/



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




  