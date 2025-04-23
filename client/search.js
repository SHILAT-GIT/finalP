function displayApartmentSearch() {
  const container = document.getElementById("apartments-container");
  const query = new URLSearchParams(window.location.search).get("q");

  if (!query) {
    container.innerHTML = "<p>לא הוזנה מילת חיפוש.</p>";
    return;
  }

  fetch(`/api/apartments/search?q=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .then(data => {
      if (!data.apartments || data.apartments.length === 0) {
        container.innerHTML = "<p>לא נמצאו תוצאות לחיפוש.</p>";
        return;
      }

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
              <p>${apt.address.street}, ${apt.address.city}</p>
            </div>
          `;

        card.addEventListener("click", (e) => {
          const isInsideSwiper = e.target.closest(".swiper");
          const isFavoriteIcon = e.target.closest(".favorite");
          if (!isInsideSwiper && !isFavoriteIcon) {
            window.location.href = `apartmentDetails.html?id=${apt._id}`;
          }
        });


        container.appendChild(card);

        new Swiper(`.apartment-swiper-${index}`, {
          loop: true,
          pagination: {
            el: `.apartment-swiper-${index} .swiper-pagination`,
          },
          navigation: {
            nextEl: `.apartment-swiper-${index} .swiper-button-next`,
            prevEl: `.apartment-swiper-${index} .swiper-button-prev`,
          },
        });
      });
    })
    .catch(err => {
      console.error("שגיאה בעת טעינת תוצאות החיפוש:", err);
      container.innerHTML = "<p>אירעה שגיאה בעת טעינת התוצאות.</p>";
    });
}

document.addEventListener("DOMContentLoaded", async () => {
  if (user && user.id)
    await fetchSavedApartments();
  displayApartmentSearch();
});
