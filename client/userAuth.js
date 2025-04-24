// Fetching logged-in user's data (ID and role) from localStorage.
let user = JSON.parse(localStorage.getItem("user"));

// Gets the user's role by sending a request to the server
async function getUserRole() {
    await fetch(`api/users/role/${user.id}`)
        .then(response => {
            if (response.status === 200) {
                return response.json().then(data => {
                    console.log(data);
                    console.log(data.role);
                    user.role = data.role;

                });
            } else if (response.status === 404) {
                console.error("משתמש לא נמצא.");
            }

            console.log(user);
        })
        .catch(error => {
            console.error(error);
            console.error("אירעה שגיאה בשליפת הרשאת המשתמש, נסו שוב מאוחר יותר");
        });
}
