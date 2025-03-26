// Fetching logged-in user's data (ID and role) from localStorage.
let user = JSON.parse(localStorage.getItem('user'));

// Checks if the logged-in user is an admin, and updates the content accordingly
function adjustForAdmin() {
    if (user && user.role === 'admin') {
        const publishedCard = document.querySelector('.col-md-4:nth-child(1) .custom-card .card-content h3');
        if (publishedCard) {
            publishedCard.textContent = 'ניהול דירות';
        }

        const sentCard = document.querySelector('.col-md-4:nth-child(2) .custom-card .card-content h3');
        if (sentCard) {
            sentCard.textContent = 'ניהול פניות';
        }

        const savedCard = document.querySelector('.col-md-4:nth-child(3)');
        if (savedCard) {
            savedCard.remove();
        }

        const remainingCards = document.querySelectorAll('.col-md-4');
        remainingCards.forEach(card => {
            card.classList.remove('col-md-4');
            card.classList.add('col-md-6');
        });
    }
}

// Updates the user's profile details by sending a request to the server
function updateProfile(event, submitButton) {
    const form = document.querySelector('.needs-validation');

    if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
        form.classList.add('was-validated');
    } else {
        event.preventDefault();

        const formData = new FormData(form);
        const updateData = Object.fromEntries(formData.entries());
        const requestData = {
            userId: user.id,
            updateData: updateData
        };

        fetch('api/users/update-profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData),
        })
            .then(response => {
                if (response.status === 200) {
                    showMessage("השינויים נשמרו בהצלחה!", "success", submitButton);
                } else {
                    showMessage("אירעה שגיאה, נסו שוב מאוחר יותר", "error", submitButton);
                }
            })
            .catch(error => {
                console.error(error);
                showMessage("אירעה שגיאה, נסו שוב מאוחר יותר", "error", submitButton);
            });

        setTimeout(() => {
            form.reset();
            form.classList.remove('was-validated');
        }, 10000);

    }
}

// Displays a message based on the status of the action, showing success or error details
function showMessage(message, type, targetElement) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('mt-3', 'text-center', 'message', `alert-${type}`);
    messageDiv.textContent = message;

    targetElement.insertAdjacentElement('afterend', messageDiv);

    setTimeout(() => {
        messageDiv.remove();
    }, 10000);
}

// Permanently deletes the user's account by sending a request to the server
function deleteAccount(deleteButton) {
    if (user && user.id) {
        const confirmation = window.confirm("האם את/ה בטוח/ה שברצונך למחוק את החשבון?\nפעולה זו לא ניתנת לשחזור.");
        if (confirmation) {
            fetch(`api/users/delete-account/${user.id}`, {
                method: 'DELETE',
            })
                .then(response => {
                    if (response.status === 200) {
                        localStorage.removeItem('user');
                        window.location.href = 'mainPage.html';
                    } else {
                        showMessage("אירעה שגיאה במחיקת החשבון, נסו שוב מאוחר יותר", "error", deleteButton);
                    }
                })
                .catch(error => {
                    console.error(error);
                    showMessage("אירעה שגיאה במחיקת החשבון, נסו שוב מאוחר יותר", "error", deleteButton);
                });
        }
    } else {
        showMessage("לא נמצא חשבון מחובר", "error", deleteButton);
    }
}

// This code runs as soon as the page is fully loaded. 
document.addEventListener("DOMContentLoaded", () => {
    // Calls a function to check if the logged-in user is an admin, and adjusts the displayed content accordingly.
    adjustForAdmin();

    // Resets the form and removes validation styles when the accordion item is reopened.
    const accordionItem = document.getElementById('collapseOne');
    accordionItem.addEventListener('show.bs.collapse', function () {
        const form = document.querySelector('.needs-validation');

        form.reset();
        form.classList.remove('was-validated');
    });

    // Listens for a click on the profile update button and calls the corresponding function to update the profile.
    const submitButton = document.getElementById('submitBtn');
    submitButton.addEventListener('click', (event) => {
        updateProfile(event, submitButton);
    });

    // Listens for a click on the delete account button and calls the corresponding function to delete the account.
    const deleteButton = document.getElementById('deleteBtn');
    deleteButton.addEventListener('click', () => {
        deleteAccount(deleteButton);
    });
});