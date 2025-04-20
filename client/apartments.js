/*document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("apartments-container");
  
    fetch('api/apartments/apartments')
      .then(res => res.json())
      .then(data => {
        data.apartments.forEach(apt => {
          const card = document.createElement('div');
          card.className = 'apartment-card';
  
          // תצוגת תמונה ראשונה
          const mainImg = apt.images?.[0] || 'default.jpg';
  
          card.innerHTML = `
            <div class="image-wrapper">
              <img src="${mainImg}" alt="תמונה של דירה">
              <span class="favorite">♡</span>
            </div>
            <div class="details">
              <h3>${apt.price} ₪</h3>
              <p>${apt.apartmentDetails.numberOfRooms} חד׳ · קומה ${apt.apartmentDetails.floor} · ${apt.apartmentDetails.sizeInSquareMeters} מ"ר</p>
              <p>${apt.type}, ${apt.address.street} ${apt.address.apartmentNumber}, ${apt.address.city}</p>
            </div>
          `;
  
          // לחיצה עוברת לעמוד דירה
          card.addEventListener('click', () => {
            window.location.href = `apartmentDetails.html?id=${apt._id}`;
          });
  
          // מועדף
          card.querySelector('.favorite').addEventListener('click', (e) => {
            e.stopPropagation(); // לא נעבור לעמוד הפרטי
            e.target.classList.toggle('active');
            e.target.textContent = e.target.classList.contains('active') ? '♥' : '♡';
          });
  
          container.appendChild(card);
        });
      });
  });*/

 /* document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("apartments-container");
  
    fetch("api/apartments/apartments")
      .then(res => res.json())
      .then(data => {
        data.apartments.forEach((apt, index) => {
          const card = document.createElement("div");
          card.className = "apartment-card";
  
          const imagesHtml = apt.images.map((img, i) => `
            <div class="swiper-slide">
              <img src="${img}" alt="תמונה ${i + 1}" />
            </div>
          `).join("");
  
          card.innerHTML = `
            <div class="swiper apartment-swiper-${index}">
              <div class="swiper-wrapper">
                ${imagesHtml}
              </div>
              <div class="swiper-button-next"></div>
              <div class="swiper-button-prev"></div>
              <div class="swiper-pagination"></div>
            </div>
            <div class="details">
              <span class="favorite">♡</span>
              <h3>${apt.price} ₪</h3>
              <p>${apt.apartmentDetails.numberOfRooms} חד׳ · קומה ${apt.apartmentDetails.floor} · ${apt.apartmentDetails.sizeInSquareMeters} מ"ר</p>
              <p>${apt.type}, ${apt.address.street}, ${apt.address.city}</p>
            </div>
          `;
  
          // קליק על כרטיס עובר לעמוד הדירה
          card.addEventListener("click", () => {
            window.location.href = `apartmentDetails.html?id=${apt._id}`;
          });
  
          // מועדפים
          card.querySelector('.favorite').addEventListener('click', (e) => {
            e.stopPropagation(); // שלא יעביר לעמוד
            e.target.classList.toggle('active');
            e.target.textContent = e.target.classList.contains('active') ? '♥' : '♡';
          });
  
          container.appendChild(card);
  
          new Swiper(`.apartment-swiper-${index}`, {
            loop: true,
            pagination: { el: `.apartment-swiper-${index} .swiper-pagination` },
            navigation: {
              nextEl: `.apartment-swiper-${index} .swiper-button-next`,
              prevEl: `.apartment-swiper-${index} .swiper-button-prev`
            }
          });
        });
      });
  });*/

  document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("apartments-container");
  
    fetch("api/apartments/apartments")
      .then(res => res.json())
      .then(data => {
        data.apartments.forEach((apt, index) => {
          const card = document.createElement("div");
          card.className = "apartment-card";
  
          const imagesHtml = apt.images.map((img, i) => `
            <div class="swiper-slide">
              <img src="${img}" alt="תמונה ${i + 1}" />
            </div>
          `).join("");
  
          card.innerHTML = `
            <div class="image-wrapper">
              <span class="favorite">♡</span>
              <div class="swiper apartment-swiper-${index}">
                <div class="swiper-wrapper">
                  ${imagesHtml}
                </div>
                <div class="swiper-button-next"></div>
                <div class="swiper-button-prev"></div>
                <div class="swiper-pagination"></div>
              </div>
            </div>
            <div class="details">
              <h3>${apt.price} ₪</h3>
              <p>${apt.apartmentDetails.numberOfRooms} חד׳ · קומה ${apt.apartmentDetails.floor} · ${apt.apartmentDetails.sizeInSquareMeters} מ"ר</p>
              <p>${apt.type}, ${apt.address.street}, ${apt.address.city}</p>
            </div>
          `;
  
          // קליק על כרטיס עובר לעמוד הדירה (אבל רק אם לא נלחץ על כפתור או תמונה בתוך הקרוסלה)
          card.addEventListener("click", (e) => {
            const isInsideSwiper = e.target.closest(".swiper");
            const isFavoriteIcon = e.target.closest(".favorite");
            if (!isInsideSwiper && !isFavoriteIcon) {
              window.location.href = `apartmentDetails.html?id=${apt._id}`;
            }
          });
  
          // מועדפים
          const fav = card.querySelector('.favorite');
          fav.addEventListener('click', (e) => {
            e.stopPropagation(); // שלא יעביר לעמוד
            fav.classList.toggle('active');
            fav.textContent = fav.classList.contains('active') ? '♥' : '♡';
          });
  
          container.appendChild(card);
  
          new Swiper(`.apartment-swiper-${index}`, {
            loop: true,
            pagination: { el: `.apartment-swiper-${index} .swiper-pagination` },
            navigation: {
              nextEl: `.apartment-swiper-${index} .swiper-button-next`,
              prevEl: `.apartment-swiper-${index} .swiper-button-prev`
            }
          });
        });
      });
  });
  
  
  