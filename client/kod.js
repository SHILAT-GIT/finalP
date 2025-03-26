/*קרוסלה*/ 
const slider1 = document.querySelector('.slider1');
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
});
/*סוף הקרוסלה*/