// Fetches the user's saved apartments from the database.
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

// Shows a message to the user if there are no saved apartments or if fetching them fails.
function displayMessage(message) {
    const container = document.getElementById('savedApartmentsContainer');
    container.innerHTML = `<p class="text-center text-muted">${message}</p>`;
}

// Displays the user's saved apartments.
function displaySavedApartments(apartments) {
    const container = document.getElementById('savedApartmentsContainer');
    container.innerHTML = '';

    apartments.forEach((apartment, index) => {
        const apartmentElement = document.createElement('div');
        apartmentElement.classList.add('row', 'mt-4', 'border', 'rounded', 'p-3', 'shadow-sm', 'g-4', 'position-relative');

        const isNew = (new Date() - new Date(apartment.createdAt)) / (1000 * 60 * 60 * 24) < 7;

        apartmentElement.innerHTML = `
            <h5 class="mb-0 position-absolute text-start" style="left: 20px;">
                <span class="badge ${apartment.type === 'דירה למכירה' ? 'text-bg-success' : 'text-bg-primary'}">${apartment.type}</span>
            </h5>
    
            ${isNew ?
                `<h5 class="mb-0 position-absolute text-end" style="right: 20px;">
                    <span style="color: white; background: rgb(0, 153, 255); font-weight: bold; padding: 4px 8px;border-radius: 12px; font-size: 1rem; z-index: 10;">חדש!</span>
                </h5>`
                : ''}

            <div class="col-md-4 text-center m-auto" >
                <div id="carousel-${index}" class="carousel slide position-relative" data-bs-ride="carousel" 
                        style=" display: flex; align-items: center; justify-content: center; margin: auto;">
                    <div class="carousel-inner" onclick='openImageModal(${JSON.stringify(apartment.images)})' style="cursor: pointer;">
                        ${apartment.images.map((img, i) => `
                            <div class="carousel-item ${i === 0 ? "active" : ""}">
                                <img src="${img}" class="img-fluid rounded-3" alt="Image ${index + 1}-${i + 1}" style="height:180px">
                            </div>
                        `).join("")}
                    </div>
                        
                    <button class="carousel-control-prev" type="button" data-bs-target="#carousel-${index}" data-bs-slide="prev" >
                        <i class="bi bi-chevron-left" style="font-size: 20px; color: #38444d;"></i>
                        <span class="visually-hidden">Previous</span>
                    </button>

                    <button class="carousel-control-next" type="button" data-bs-target="#carousel-${index}" data-bs-slide="next" >
                        <i class="bi bi-chevron-right" style="font-size: 20px; color: #38444d;"></i>
                        <span class="visually-hidden">Next</span>
                    </button>
                </div>
            </div>

            <div class="col-md-8 d-flex flex-column justify-content-center">
                <h4 class="mt-2 fw-bold">${apartment.price} ₪</h4>
                <span class="text-muted">${apartment.address.street}, ${apartment.address.city}, ${apartment.address.region}</span>
                
                <p class="mt-3">
                    <strong>מ"ר: </strong> ${apartment.apartmentDetails.sizeInSquareMeters}
                    <strong>,</strong>
                    <strong>מספר חדרים: </strong> ${apartment.apartmentDetails.numberOfRooms}
                    <strong>,</strong>
                    <strong>קומה: </strong> ${apartment.apartmentDetails.floor}
                    <br/>
                    ${apartment.description}
                </p>
            
                <div class="d-flex justify-content-between mt-2">
                    <button class="btn btn-primary contact-btn" onclick="sendInquiry('${apartment._id}')">
                        צרו איתי קשר    
                    </button>
                    <button class="btn save-btn" onclick="removeSaved('${apartment._id}')">
                        <i class="bi bi-bookmark-fill" style="font-size: 1.5rem;"></i>
                    </button>
                </div>
            </div>
        `;

        // <img src="${apartment.image}" class="img-fluid rounded-3" alt="תמונה של הדירה">

        container.appendChild(apartmentElement);
    });
}

// Opens an image modal with a carousel of images
function openImageModal(imageArray) {
    const carouselInner = document.getElementById('carouselImages');
    carouselInner.innerHTML = '';

    imageArray.forEach((imageSrc, index) => {
        const isActive = index === 0 ? 'active' : '';
        carouselInner.innerHTML += `
            <div class="carousel-item ${isActive}">
                <img src="${imageSrc}" class="d-block" alt="Apartment Image" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
        `;
    });

    const imageModal = new bootstrap.Modal(document.getElementById('imageModal'));
    imageModal.show();
}

// Removes an apartment from the user's saved list by sending a request to the server.
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
}

// Sends an inquiry about an apartment the user is interested in by sending a request to the server.
function sendInquiry(apartmentId) {
    fetch("api/inquiries/send-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, apartmentId: apartmentId })
    })
        .then(response => {
            if (response.status === 200) {
                alert("הפנייה נשלחה בהצלחה!")
            } else if (response.status === 402) {
                alert("שלחת כבר פניה לגבי דירה זו, אנו מטפלים בה וניצור עימך קשר בהקדם.");
            } else {
                alert("אירעה שגיאה בשליחת הפניה, נסו שוב מאוחר יותר.");
            }
        })
        .catch((error) => {
            console.error(error);
            alert("אירעה שגיאה בשליחת הפניה, נסו שוב מאוחר יותר.")
        });
}

// This code runs as soon as the page is fully loaded. 
document.addEventListener("DOMContentLoaded", async () => {
    // Calls a function to fetch the user's role and updates the `user` variable
    await getUserRole();

    // Calls a function to fetch the user's saved apartments from the database.
    fetchData();
});
