// Fetching logged-in user's data (ID and role) from localStorage.
let user = JSON.parse(localStorage.getItem('user'));


// Fetches all inquiries from the database.
function fetchGeneralInquiries() {
    fetch(`api/generalInquiries/all-inquiries`)
        .then(response => {
            if (response.status === 200) {
                return response.json().then(data => displayGeneralInquiries(data.inquiries));
            } else if (response.status === 404) {
                displayMessage("עוד לא נשלחו פניות.");
            } else {
                displayMessage("אירעה שגיאה בהצגת הפניות, נסו שוב מאוחר יותר");
            }
        })
        .catch(error => {
            console.error(error);
            displayMessage("אירעה שגיאה בהצגת הפניות, נסו שוב מאוחר יותר");
        });
}

// Shows a message to the user if data fetch fails.
function displayMessage(message) {
    const container = document.getElementById('inquiriesContainer');
    container.innerHTML = `<p class="text-center text-muted">${message}</p>`;
}

// Returns a CSS class that suits the provided status
function getStatusClass(status) {
    switch (status) {
        case 'התקבלה':
            return 'badge-accepted';
        case 'בטיפול':
            return 'badge-processing';
        case 'טופל':
            return 'badge-done';
        default:
            return '';
    }
}

// Displays all general inquiries 
function displayGeneralInquiries(inquiries) {
    const container = document.getElementById('inquiriesContainer');
    container.innerHTML = '';

    const accepted = inquiries.filter(inquiry => inquiry.status === 'התקבלה');
    const processing = inquiries.filter(inquiry => inquiry.status === 'בטיפול');
    const done = inquiries.filter(inquiry => inquiry.status === 'טופל');

    const accordion = document.createElement('div');
    accordion.classList.add('accordion');
    accordion.id = 'accordionExample';

    // Creates a table to display all provided inquiries
    const createTableForStatus = (inquiries, tableIndex) => {
        if (inquiries.length === 0) {
            const div = document.createElement('div');
            div.innerHTML = `<p class="text-center text-muted">אין פניות בסטטוס הזה</p>`;
            return div;
        }

        const table = document.createElement('table');

        table.id = `table-${tableIndex}`;

        table.classList.add('table', 'table-responsive');

        const thead = document.createElement('thead');

        let theadContent = `
        <tr>
            <th>#</th>
            <th>תאריך</th>
            <th>שם</th>
            <th>פלאפון</th>
            <th>דוא"ל</th>
            <th>תוכן הפניה</th>
            <th>סטטוס</th>
            <th>שינוי סטטוס</th>
    `;

        if (tableIndex === 3) {
            theadContent += `<th>מחיקה</th>`;
        }

        theadContent += ` </tr> `;

        thead.innerHTML = theadContent;

        let isEvenRow = true;

        const tbody = document.createElement('tbody');
        inquiries.forEach((inquiry, index) => {
            const row = document.createElement('tr');
            row.classList.add(isEvenRow ? 'even' : 'odd');

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${inquiry.date}</td>
                <td>${inquiry.name}</td>
                <td>${inquiry.phone}</td>
                <td>${inquiry.email}</td>
                <td>${inquiry.message}</td>
                <td><span class="badge badge-status ${getStatusClass(inquiry.status)}">${inquiry.status}</span></td>
                <td>
                    <div style="display: flex; justify-content: ${inquiry.status === 'התקבלה' ? 'space-evenly' : 'center'};">
                        ${inquiry.status !== "בטיפול"
                    ? `<i class="bi bi-pencil-square icon-button text-primary" onclick="changeInquiryStatus('${inquiry._id}', 'בטיפול')"></i>`
                    : ""}
        
                        ${inquiry.status !== "טופל"
                    ? `<i class="bi bi-check-circle icon-button text-success" onclick="changeInquiryStatus('${inquiry._id}', 'טופל')"></i>`
                    : ""}
                    </div>
                </td>
                ${tableIndex === 3 ? `<td><i class="bi bi-trash-fill icon-button" onclick="deleteInquiry('${inquiry._id}')"></i></td>` : ''}
            `;

            tbody.appendChild(row);

            isEvenRow = !isEvenRow;
        });

        table.appendChild(thead);
        table.appendChild(tbody);

        return table;
    };

    // Generates an accordion item for each status category
    const createAccordionItem = (statusName, inquiries, tableIndex) => {
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
                    ${createTableForStatus(inquiries, tableIndex).outerHTML}
                </div>
            </div>
        `;

        return accordionItem;
    };

    accordion.appendChild(createAccordionItem('התקבלה', accepted, 1));
    accordion.appendChild(createAccordionItem('בטיפול', processing, 2));
    accordion.appendChild(createAccordionItem('טופל', done, 3));

    container.appendChild(accordion);
}

// Updates the inquiry status by sending a request to the server
function changeInquiryStatus(inquiryId, status) {
    fetch('api/generalInquiries/change-inquiry-status', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inquiryId: inquiryId, status: status })
    })
        .then(response => {
            if (response.status === 200) {
                fetchGeneralInquiries();
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

// Permanently deletes a inquiry by sending a request to the server
function deleteInquiry(inquiryId) {
    if (user && user.id) {
        const confirmation = window.confirm("האם את/ה בטוח/ה שברצונך למחוק את הפניה?\nפעולה זו לא ניתנת לשחזור.");
        if (confirmation) {
            fetch(`api/generalInquiries/delete-inquiry/${inquiryId}`, {
                method: 'DELETE',
            })
                .then(response => {
                    if (response.status === 200) {
                        fetchGeneralInquiries();
                        showToast("הפניה נמחקה בהצלחה!", "success");
                    } else {
                        showToast("אירעה שגיאה במחיקת הפניה, נסו שוב מאוחר יותר", "error");
                    }
                })
                .catch(error => {
                    console.error(error);
                    showToast("אירעה שגיאה במחיקת הפניה, נסו שוב מאוחר יותר", "error");
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
    // Calls a function to fetch all general inquires from the database.
    fetchGeneralInquiries();
});
