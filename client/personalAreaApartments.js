// Fetching logged-in user's data (ID and role) from localStorage.
let user = JSON.parse(localStorage.getItem('user'));

// Checks if the logged-in user is an admin, and updates the title accordingly
function adjustForAdmin() {
    if (user && user.role === 'admin') {
        document.getElementById('title').textContent = 'ניהול דירות';
    }
}

// Checks if the user is logged in and calls the appropriate function to fetch data based on user role.
function fetchData() {
    if (!user || !user.id) {
        displayMessage("עליך להתחבר כדי לפרסם דירות ולצפות בהן.");
        return;
    }

    if (user.role === 'admin')
        fetchDataForAdmin();
    else
        fetchDataForUser();
}

// Fetches all apartments from the database.
function fetchDataForAdmin() {
    fetch(`api/apartments/all-apartments`)
        .then(response => {
            if (response.status === 200) {
                return response.json().then(data => displayManageApartments(data.apartments));
            } else if (response.status === 404) {
                displayMessage("עוד לא פורסמו דירות.");
            } else {
                displayMessage("אירעה שגיאה בהצגת הדירות, נסו שוב מאוחר יותר");
            }
        })
        .catch(error => {
            console.error(error);
            displayMessage("אירעה שגיאה בהצגת הדירות, נסו שוב מאוחר יותר");
        });
}

// Fetches the apartments published by the user from the database.
function fetchDataForUser() {
    fetch(`api/apartments/user-apartments/${user.id}`)
        .then(response => {
            if (response.status === 200) {
                return response.json().then(data => displayUserApartments(data.apartments));
            } else if (response.status === 404) {
                displayMessage("עוד לא פרסמת דירות.");
            } else {
                displayMessage("אירעה שגיאה בהצגת הדירות שפרסמתם, נסו שוב מאוחר יותר");
            }
        })
        .catch(error => {
            console.error(error);
            displayMessage("אירעה שגיאה בהצגת הדירות שפרסמתם, נסו שוב מאוחר יותר");
        });
}

// Shows a message to the user if data fetch fails.
function displayMessage(message) {
    const container = document.getElementById('apartmentsContainer');
    container.innerHTML = `<p class="text-center text-muted">${message}</p>`;
}

// Displays the user's apartments.
function displayUserApartments(apartments) {
    const container = document.getElementById('apartmentsContainer');
    container.innerHTML = '';

    const postButton = document.createElement('a');
    postButton.id = 'postBtn';
    postButton.href = 'newApartment.html';
    postButton.classList.add('btn');
    postButton.textContent = 'פרסם דירה';

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('d-flex', 'justify-content-end', 'mb-3');

    buttonContainer.appendChild(postButton);
    container.appendChild(buttonContainer);

    const table = document.createElement('table');
    table.classList.add('table', 'table-responsive');

    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>#</th>
            <th>סוג</th>
            <th>מחיר</th>
            <th>מיקום</th>
            <th>תמונות</th>
            <th>סטטוס</th>
            <th></th>
        </tr>
    `;

    let isEvenRow = true;

    const tbody = document.createElement('tbody');
    apartments.forEach((apartment, index) => {
        const row = document.createElement('tr');
        row.classList.add(isEvenRow ? 'even' : 'odd');

        row.innerHTML = `
            <td>${index + 1}</td>
            <td><span class="badge badge-type ${apartment.type === 'דירה למכירה' ? 'text-bg-success' : 'text-bg-primary'}">${apartment.type}</span></td>
            <td>${apartment.price} ₪</td>
            <td>${apartment.address.street}, ${apartment.address.city}, ${apartment.address.region}</td>
            <td style="text-align: center; vertical-align: middle;">
                <div id="carousel-${index}" class="carousel slide position-relative" data-bs-ride="carousel" 
                    style="width: 80px; height: 50px; display: flex; align-items: center; justify-content: center; margin: auto;">
                    <div class="carousel-inner" style="width: 80px; height: 50px; cursor: pointer;" onclick='openImageModal(${JSON.stringify(apartment.images)})' >
                        ${apartment.images.map((img, i) => `
                            <div class="carousel-item ${i === 0 ? "active" : ""}">
                                <img src="${img}" class="d-block" alt="Image ${index + 1}-${i + 1}" style="width: 80px; height: 50px; object-fit: cover;">
                            </div>
                        `).join("")}
                    </div>
                    
                    <button class="carousel-control-prev" type="button" data-bs-target="#carousel-${index}" data-bs-slide="prev" 
                            style="position: absolute; left: -20px; top: 50%; transform: translateY(-50%); ">
                        <i class="bi bi-chevron-left" style="font-size: 20px; color: #38444d;"></i>
                        <span class="visually-hidden">Previous</span>
                    </button>

                    <button class="carousel-control-next" type="button" data-bs-target="#carousel-${index}" data-bs-slide="next" 
                            style="position: absolute; right: -20px; top: 50%; transform: translateY(-50%);">
                        <i class="bi bi-chevron-right" style="font-size: 20px; color: #38444d;"></i>
                        <span class="visually-hidden">Next</span>
                    </button>
                </div>
            </td>
            <td><span class="badge badge-status ${getStatusClass(apartment.status)}">${apartment.status}</span></td>
            <td><i class="bi bi-chevron-down icon-toggle" onclick="toggleDescription(${index})"></i></td>
        `;

        const descriptionRow = document.createElement('tr');
        descriptionRow.classList.add('apartment-description');
        descriptionRow.innerHTML = `
            <td colspan="7">
                <strong>מ"ר: </strong> ${apartment.apartmentDetails.sizeInSquareMeters}
                <strong>,</strong>
                <strong>מספר חדרים: </strong> ${apartment.apartmentDetails.numberOfRooms}
                <strong>,</strong>
                <strong>קומה: </strong> ${apartment.apartmentDetails.floor}
                <br/>
                <strong>תיאור: </strong> ${apartment.description}
            </td>
        `;

        descriptionRow.classList.add(isEvenRow ? 'even' : 'odd');

        tbody.appendChild(row);
        tbody.appendChild(descriptionRow);

        isEvenRow = !isEvenRow;
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    container.appendChild(table);
}

// Returns a CSS class that suits the provided status
function getStatusClass(status) {
    switch (status) {
        case 'מאושר':
            return 'badge-approved';
        case 'ממתין לאישור':
            return 'badge-pending';
        case 'נדחה':
            return 'badge-rejected';
        default:
            return '';
    }
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

//  Toggles the visibility of the apartment description row
function toggleDescription(index, tableIndex = null) {
    let descriptionRow, icon;

    // Admin view: When tableIndex is provided, it indicates we are in the admin view.
    if (tableIndex !== null) {
        descriptionRow = document.querySelectorAll(`#table-${tableIndex} .apartment-description`)[index];
        icon = document.querySelectorAll(`#table-${tableIndex} .icon-toggle`)[index];
    }
    // User view: When tableIndex is not provided, we are in the user view.
    else {
        descriptionRow = document.querySelectorAll('.apartment-description')[index];
        icon = document.querySelectorAll('.icon-toggle')[index];
    }

    const apartmentRow = descriptionRow.previousElementSibling;

    if (descriptionRow.style.display === 'none' || descriptionRow.style.display === '') {
        descriptionRow.style.display = 'table-row';
        icon.classList.remove('bi-chevron-down');
        icon.classList.add('bi-chevron-up');
        apartmentRow.classList.add('has-description');
    } else {
        descriptionRow.style.display = 'none';
        icon.classList.remove('bi-chevron-up');
        icon.classList.add('bi-chevron-down');
        apartmentRow.classList.remove('has-description');
    }
}

// Displays all apartments for the admin
function displayManageApartments(apartments) {
    const container = document.getElementById('apartmentsContainer');
    container.innerHTML = '';

    const pending = apartments.filter(apartment => apartment.status === 'ממתין לאישור');
    const approved = apartments.filter(apartment => apartment.status === 'מאושר');
    const rejected = apartments.filter(apartment => apartment.status === 'נדחה');

    const accordion = document.createElement('div');
    accordion.classList.add('accordion');
    accordion.id = 'accordionExample';

    // Creates a table to display all provided apartments
    const createTableForStatus = (apartments, tableIndex) => {
        if (apartments.length === 0) {
            const div = document.createElement('div');
            div.innerHTML = `<p class="text-center text-muted">אין דירות בסטטוס הזה</p>`;
            return div;
        }

        const table = document.createElement('table');

        table.id = `table-${tableIndex}`;

        table.classList.add('table', 'table-responsive');

        const thead = document.createElement('thead');

        let theadContent = `
        <tr>
            <th>#</th>
            <th>סוג</th>
            <th>מחיר</th>
            <th>מיקום</th>
            <th>תמונות</th>
            <th>סטטוס</th>
            <th>שינוי סטטוס</th>
    `;

        if (tableIndex === 3) {
            theadContent += `<th>מחיקה</th>`;
        }

        theadContent += `
            <th></th>
        </tr>
    `;

        thead.innerHTML = theadContent;

        let isEvenRow = true;

        const tbody = document.createElement('tbody');
        apartments.forEach((apartment, index) => {
            const row = document.createElement('tr');
            row.classList.add(isEvenRow ? 'even' : 'odd');

            row.innerHTML = `
                <td>${index + 1}</td>
                <td><span class="badge badge-type ${apartment.type === 'דירה למכירה' ? 'text-bg-success' : 'text-bg-primary'}">${apartment.type}</span></td>
                <td>${apartment.price} ₪</td>
                <td>${apartment.address.street} ${apartment.address.apartmentNumber}, ${apartment.address.city}, ${apartment.address.region}</td>
                <td style="text-align: center; vertical-align: middle;">
                    <div id="carousel-${index}" class="carousel slide position-relative" data-bs-ride="carousel" 
                        style="width: 80px; height: 50px; display: flex; align-items: center; justify-content: center; margin: auto;">
                        <div class="carousel-inner" style="width: 80px; height: 50px; cursor: pointer;" onclick='openImageModal(${JSON.stringify(apartment.images)})' >
                            ${apartment.images.map((img, i) => `
                                <div class="carousel-item ${i === 0 ? "active" : ""}">
                                    <img src="${img}" class="d-block" alt="Image ${index + 1}-${i + 1}" style="width: 80px; height: 50px; object-fit: cover;">
                                </div>
                            `).join("")}
                        </div>
                        
                        <button class="carousel-control-prev" type="button" data-bs-target="#carousel-${index}" data-bs-slide="prev" 
                                >
                            <i class="bi bi-chevron-left" style="font-size: 20px; color: #38444d;"></i>
                            <span class="visually-hidden">Previous</span>
                        </button>

                        <button class="carousel-control-next" type="button" data-bs-target="#carousel-${index}" data-bs-slide="next" 
                               >
                            <i class="bi bi-chevron-right" style="font-size: 20px; color: #38444d;"></i>
                            <span class="visually-hidden">Next</span>
                        </button>
                    </div>
                </td>
                <td><span class="badge badge-status ${getStatusClass(apartment.status)}">${apartment.status}</span></td>
                <td>
                    <div style="display: flex; justify-content: ${apartment.status === 'ממתין לאישור' ? 'space-evenly' : 'center'};">
                        ${apartment.status !== "מאושר"
                    ? `<i class="bi bi-check-circle icon-button text-success" onclick="changeApartmentStatus('${apartment._id}', 'מאושר')"></i>`
                    : ""}
        
                        ${apartment.status !== "נדחה"
                    ? `<i class="bi bi-dash-circle icon-button text-danger" onclick="changeApartmentStatus('${apartment._id}', 'נדחה')"></i>`
                    : ""}
                    </div>
                </td>
                ${tableIndex === 3 ? `<td><i class="bi bi-trash-fill icon-button" onclick="deleteApartment('${apartment._id}')"></i></td>` : ''}
                <td><i class="bi bi-chevron-down icon-toggle" onclick="toggleDescription(${index}, ${tableIndex})"></i></td>
            `;

            const descriptionRow = document.createElement('tr');
            descriptionRow.classList.add('apartment-description');
            descriptionRow.innerHTML = `
                <td colspan="${tableIndex === 3 ? '9' : '8'}">
                    <strong>מ"ר: </strong> ${apartment.apartmentDetails.sizeInSquareMeters}
                    <strong>,</strong>
                    <strong>מספר חדרים: </strong> ${apartment.apartmentDetails.numberOfRooms}
                    <strong>,</strong>
                    <strong>קומה: </strong> ${apartment.apartmentDetails.floor}
                    <br/>
                    <strong>תיאור: </strong> ${apartment.description}
                    <br/>
                    <hr/>
                    <strong>מפרסם / פרטי קשר: </strong> שם: ${apartment.owner.name} , טל: ${apartment.owner.phone} ${apartment.owner.email ? ", דוא''ל: " + apartment.owner.email : ''}
                </td>
            `;

            descriptionRow.classList.add(isEvenRow ? 'even' : 'odd');

            tbody.appendChild(row);
            tbody.appendChild(descriptionRow);

            isEvenRow = !isEvenRow;
        });

        table.appendChild(thead);
        table.appendChild(tbody);

        return table;
    };

    // Generates an accordion item for each status category
    const createAccordionItem = (statusName, apartments, tableIndex) => {
        const accordionItem = document.createElement('div');
        accordionItem.classList.add('accordion-item');

        const collapseId = `collapse-${tableIndex}`;
        const buttonId = `button-${tableIndex}`;

        accordionItem.innerHTML = `
            <h2 class="accordion-header" id="${buttonId}">
                <button class="accordion-button ${tableIndex === 1 ? '' : 'collapsed'}" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}"
                    aria-expanded="${tableIndex === 1 ? 'true' : 'false'}" aria-controls="${collapseId}">
                    ${statusName}
                </button>
            </h2>
            <div id="${collapseId}" class="accordion-collapse collapse ${tableIndex === 1 ? 'show' : ''}" data-bs-parent="#accordionExample">
                <div class="accordion-body">
                    ${createTableForStatus(apartments, tableIndex).outerHTML}
                </div>
            </div>
        `;

        return accordionItem;
    };

    accordion.appendChild(createAccordionItem('ממתין לאישור', pending, 1));
    accordion.appendChild(createAccordionItem('מאושר', approved, 2));
    accordion.appendChild(createAccordionItem('נדחה', rejected, 3));

    container.appendChild(accordion);
}

// Updates the apartment status by sending a request to the server
function changeApartmentStatus(apartmentId, status) {
    fetch('api/apartments/change-apartment-status', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apartmentId: apartmentId, status: status })
    })
        .then(response => {
            if (response.status === 200) {
                fetchData();
                showToast("הסטטוס עודכן בהצלחה!", "success");
            } else {
                showToast("אירעה שגיאה, נסו שוב מאוחר יותר", "error");
            }
        })
        .catch(error => {
            console.error(error);
            showToast("אירעה שגיאה, נסו שוב מאוחר יותר", "error");
        });
}

// Permanently deletes a apartment by sending a request to the server
function deleteApartment(apartmentId) {
    if (user && user.id) {
        const confirmation = window.confirm("האם את/ה בטוח/ה שברצונך למחוק את הדירה?\nפעולה זו לא ניתנת לשחזור.");
        if (confirmation) {
            fetch(`api/apartments/delete-apartment/${apartmentId}`, {
                method: 'DELETE',
            })
                .then(response => {
                    if (response.status === 200) {
                        fetchData();
                        showToast("הדירה נמחקה בהצלחה!", "success");
                    } else {
                        showToast("אירעה שגיאה במחיקת הדירה, נסו שוב מאוחר יותר", "error");
                    }
                })
                .catch(error => {
                    console.error(error);
                    showToast("אירעה שגיאה במחיקת הדירה, נסו שוב מאוחר יותר", "error");
                });
        }
    } else {
        showToast("לא נמצא חשבון מחובר", "error");
    }
}

// Displays an error or success message in the appropriate toast
function showToast(message, type) {
    const toastSuccess = document.getElementById("toastSuccess");
    const toastDanger = document.getElementById("toastDanger");
    const toastBodySuccess = document.getElementById("toastBodySuccess");
    const toastBodyDanger = document.getElementById("toastBodyDanger");

    if (type === "success") {
        toastBodySuccess.innerText = message;

        const toast = new bootstrap.Toast(toastSuccess);
        toast.show();
    } else if (type === "error") {
        toastBodyDanger.innerText = message;

        const toast = new bootstrap.Toast(toastDanger);
        toast.show();
    }
}

// This code runs as soon as the page is fully loaded. 
document.addEventListener("DOMContentLoaded", () => {
    // Calls a function to check if the logged-in user is an admin, and adjusts the displayed content accordingly.
    adjustForAdmin();

    // Calls a function to fetch data according to the user's role from the database.
    fetchData();
});
