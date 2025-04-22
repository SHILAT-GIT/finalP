// const user = JSON.parse(localStorage.getItem("user"));
// let savedApartments = [];

// // Fetches the user's saved apartments from the database.
// async function fetchSavedApartments() {
//   await fetch(`api/users/saved-apartments/${user.id}`)
//     .then(response => {
//       if (response.status === 200) {
//         return response.json().then(data => {
//           savedApartments = data.apartments;
//       });
//       } else if (response.status === 404) {
//         savedApartments = [];
//       } else {
//         console.error("אירעה שגיאה בהצגת הדירות השמורות, נסו שוב מאוחר יותר");
//       }
//     })
//     .catch(error => {
//       console.error(error);
//       console.error("אירעה שגיאה בהצגת הדירות השמורות, נסו שוב מאוחר יותר");
//     });
// }

function displayApartments() {

  const container = document.getElementById("apartments-container");

  fetch("api/apartments/apartments")
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

// //פונקציה שבודקת אם המשתמש מחובר כדי לשמור אצלו דירה מועדפת
// function saveApartment(apartmentId) {
//   if (!user || !user.id) {
//     alert("עליך להתחבר כדי לשמור דירות למועדפים.");
//     return;
//   }
//   else {
//     addApartmentToSavedApartments(apartmentId);
//   }
// }

// //אם המשתמש מחובר  הפונקציה הזו נקראת לשמירת הדירה במועדפים
// function addApartmentToSavedApartments(apartmentId) {
//   const icon = document.getElementById(`saveIcon-${apartmentId}`);

//   if (icon.classList.contains("bi-bookmark-fill")) {
//     // קריאה לשרת להסרת הדירה מהשמורים
//     fetch("api/users/remove-saved-apartment", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ userId: user.id, apartmentId })
//     })
//       .then(response => {
//         if (response.status === 200) {
//           icon.classList.remove("bi-bookmark-fill");
//           icon.classList.add("bi-bookmark");
//           alert("הדירה הוסרה מהדירות השמורות בהצלחה!");
//         } else {
//           alert("אירעה שגיאה בהסרת הדירות מהדירות השמורות");
//         }
//       })
//       .catch(err => {
//         console.error(err);
//         alert("אירעה שגיאה בהסרת הדירות מהדירות השמורות. נסה שוב מאוחר יותר");
//       });
//   }
//   else {
//     // שליחת בקשה לשרת
//     fetch("api/users/add-saved-apartment", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ userId: user.id, apartmentId })
//     })
//       .then(response => {
//         if (response.status === 200) {
//           // החלפת האייקון לסימנייה מלאה
//           icon.classList.remove("bi-bookmark");
//           icon.classList.add("bi-bookmark-fill");
//           alert("הדירה נשמרה בהצלחה!");
//         } else {
//           alert("אירעה שגיאה בשמירת הדירה.");
//         }
//       })
//       .catch(err => {
//         console.error(err);
//         alert("אירעה שגיאה בשמירת הדירה. נסה שוב מאוחר יותר.");
//       });
//   }
// }

document.addEventListener("DOMContentLoaded", async () => {
  if (user && user.id)
    await fetchSavedApartments();

  displayApartments();

});




/*let user = JSON.parse(localStorage.getItem('user'));
function fetchData() {
    if (!user || !user.id) {
        displayMessage("עליך להתחבר כדי לשמור דירות ולצפות בהן.");
        return;
    }

    fetch(`api/users/saved-apartments/${user.id}`)
        .then(response => {
            if (response.status === 200) {
                return response.json().then(data => displaySavedApartments(data.apartments));
            } else if (response.status === 404) {
                displayMessage("עוד לא שמרת דירות.");
            } else {
                displayMessage("אירעה שגיאה בהצגת הדירות השמורות, נסו שוב מאוחר יותר");
            }
        })
        .catch(error => {
            console.error(error);
            displayMessage("אירעה שגיאה בהצגת הדירות השמורות, נסו שוב מאוחר יותר");
        });
}


function removeSaved(apartmentId) {
  fetch("api/users/remove-saved-apartment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, apartmentId: apartmentId })
    })
      .then(response => {
          if (response.status === 200) {
              fetchData();
          } else {
              alert("אירעה שגיאה בהסרת הדירה מהדירות השמורות, נסו שוב מאוחר יותר.");
          }
      })
      .catch((error) => {
          console.error(error);
          alert("אירעה שגיאה בהסרת הדירה מהדירות השמורות, נסו שוב מאוחר יותר.")
      });
}*/




