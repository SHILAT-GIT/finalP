async function addToRecentlyViewed(apartmentId) {
    await fetch("api/users/view-apartment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, apartmentId })
    })
        .then(response => {
            if (response.status === 200) {
                console.log("הדירה נוספה בהצלחה להסטוריית הצפיה של המשתמש!");
            } else {
                console.error("אירעה שגיאה בהוספת הדירה להסטוריית הצפיה של המשתמש. נסה שוב מאוחר יותר");
            }
        })
        .catch(err => {
            console.error(err);
            console.error("אירעה שגיאה בהוספת הדירה להסטוריית הצפיה של המשתמש. נסה שוב מאוחר יותר");
        });
}

async function fetchRecommendedApartments() {
    await fetch(`api/apartments/recommended-apartments/${user.id}`)
        .then(response => {
            if (response.status === 200) {
                return response.json().then(data => {
                    displayRecommendedApartments(data.apartments);
                });
            } else {
                document.getElementById("smartRecommendations-title").style.display = "none";
                console.error("אירעה שגיאה בהצגת הדירות המומלצות, נסו שוב מאוחר יותר");
            }
        })
        .catch(error => {
            document.getElementById("smartRecommendations-title").style.display = "none";
            console.error(error);
            console.error("אירעה שגיאה בהצגת הדירות המומלצות, נסו שוב מאוחר יותר");
        });
}

function displayRecommendedApartments(apartments) {
    const container = document.getElementById("smartRecommendations");

    apartments.forEach((apt, index) => {
        const saved = savedApartments.some(item => item._id === apt._id);
        const isNew = (new Date() - new Date(apt.createdAt)) / (1000 * 60 * 60 * 24) < 7;

        const card = document.createElement("div");
        card.className = "apartment-card";

        const imagesHtml = apt.images.map((img, i) => `
              <div class="swiper-slide">
                <img src="${img}" alt="תמונה ${i + 1}" />
              </div>
            `).join("");

        card.innerHTML = `
              <div class="image-wrapper">
              ${isNew ? '<span class="new-badge">חדש!</span>' : ''}
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
        card.addEventListener("click", async (e) => {
            const isInsideSwiper = e.target.closest(".swiper");
            const isFavoriteIcon = e.target.closest(".favorite");
            if (!isInsideSwiper && !isFavoriteIcon) {
                if (user && user.id)
                    await addToRecentlyViewed(apt._id);

                window.location.href = `apartmentDetails.html?id=${apt._id}`;
            }
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

}

document.addEventListener("DOMContentLoaded", async () => {
    if (!user || !user.id)
        document.getElementById("smartRecommendations-title").style.display = "none";
    else
        await fetchRecommendedApartments();
});