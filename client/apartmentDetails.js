
  document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
  
    fetch(`api/apartments/apartments/${id}`)
      .then(res => res.json())
      .then(data => {
        const apt = data.apartment;
        const container = document.getElementById("apartment-details");
  
        const imagesHtml = apt.images.map((img, i) => `
          <div class="swiper-slide"><img src="${img}" data-index="${i}" /></div>
        `).join('');
  
        container.innerHTML = `
          <div class="swiper main-swiper">
            <div class="swiper-wrapper">
              ${imagesHtml}
            </div>
            <div class="swiper-button-next"></div>
            <div class="swiper-button-prev"></div>
            <div class="swiper-pagination"></div>
          </div>
          <h2>${apt.price} ₪</h2>
          <p><strong>${apt.type}</strong> - ${apt.description}</p>
          <p><b>כתובת:</b> ${apt.address.street}, ${apt.address.city}</p>
          <p><b>חדרים:</b> ${apt.apartmentDetails.numberOfRooms}</p>
          <p><b>קומה:</b> ${apt.apartmentDetails.floor}</p>
          <p><b>גודל:</b> ${apt.apartmentDetails.sizeInSquareMeters} מ"ר</p>
        `;
  
        const swiper = new Swiper('.main-swiper', {
          loop: true,
          pagination: { el: '.main-swiper .swiper-pagination' },
          navigation: {
            nextEl: '.main-swiper .swiper-button-next',
            prevEl: '.main-swiper .swiper-button-prev'
          }
        });
  
        // יצירת גלריה מוגדלת
        container.querySelectorAll(".main-swiper img").forEach(img => {
          img.addEventListener("click", (e) => {
            openImageModal(apt.images, parseInt(e.target.dataset.index));
          });
        });
      });
  
    function openImageModal(images, startIndex = 0) {
      const modal = document.createElement("div");
      modal.className = "image-modal";
  
      const closeBtn = document.createElement("div");
      closeBtn.className = "close-btn";
      closeBtn.innerHTML = "&times;";
      closeBtn.addEventListener("click", () => modal.remove());
  
      const imagesHtml = images.map(img => `
        <div class="swiper-slide">
          <img src="${img}" />
        </div>
      `).join("");
  
      modal.innerHTML = `
        <div class="swiper modal-swiper">
          <div class="swiper-wrapper">
            ${imagesHtml}
          </div>
          <div class="swiper-button-next"></div>
          <div class="swiper-button-prev"></div>
          <div class="swiper-pagination"></div>
        </div>
      `;
  
      modal.appendChild(closeBtn);
      document.body.appendChild(modal);
  
      const modalSwiper = new Swiper('.modal-swiper', {
        loop: true,
        initialSlide: startIndex,
        pagination: { el: '.modal-swiper .swiper-pagination' },
        navigation: {
          nextEl: '.modal-swiper .swiper-button-next',
          prevEl: '.modal-swiper .swiper-button-prev'
        }
      });
    }
  });
  
  
  