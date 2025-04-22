function displayApartmentForSale() {
  const container = document.getElementById("apartments-container");

  fetch("api/apartments/for-sale")
    .then(res => res.json())
    .then(data => {
      data.apartments.forEach((apt, index) => {
        const saved = savedApartments.some(item => item._id === apt._id);

        const card = document.createElement("div");
        card.className = "apartment-card";

        const imagesHtml = apt.images.map((img, i) => `
            <div class="swiper-slide">
              <img src="${img}" alt="תמונה ${i + 1}" />
            </div>
          `).join("");

        card.innerHTML = `
            <div class="image-wrapper">
            <span class="favorite"><i class="${saved ? "bi bi-bookmark-fill" : "bi bi-bookmark"}" id="saveIcon-${apt._id}" onclick="saveApartment('${apt._id}')" style="font-size: 1rem;"></i></span>
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
              <p><b>${apt.type}</b></p>
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
        /* const fav = card.querySelector('.favorite');
         fav.addEventListener('click', (e) => {
             e.stopPropagation(); 
             fav.classList.toggle('active');
             fav.textContent = fav.classList.contains('active') ? '♥' : '♡';
         });*/

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
}


document.addEventListener("DOMContentLoaded", async () => {
  if (user && user.id)
    await fetchSavedApartments();
  displayApartmentForSale();
});


