let savedApartments = [];
const user = JSON.parse(localStorage.getItem("user"));

// Fetches the user's saved apartments from the database.
async function fetchSavedApartments() {
  await fetch(`api/users/saved-apartments/${user.id}`)
    .then(response => {
      if (response.status === 200) {
        return response.json().then(data => {
          savedApartments = data.apartments;
        });
      } else if (response.status === 404) {
        savedApartments = [];
      } else {
        console.error("אירעה שגיאה בהצגת הדירות השמורות, נסו שוב מאוחר יותר");
      }
    })
    .catch(error => {
      console.error(error);
      console.error("אירעה שגיאה בהצגת הדירות השמורות, נסו שוב מאוחר יותר");
    });
}

//פונקציה שבודקת אם המשתמש מחובר כדי לשמור אצלו דירה מועדפת
function saveApartment(apartmentId) {
  if (!user || !user.id) {
    alert("עליך להתחבר כדי לשמור דירות למועדפים.");
    return;
  }
  else {
    addApartmentToSavedApartments(apartmentId);
  }
}

//אם המשתמש מחובר  הפונקציה הזו נקראת לשמירת הדירה במועדפים
function addApartmentToSavedApartments(apartmentId) {
  const icon = document.getElementById(`saveIcon-${apartmentId}`);

  if (icon.classList.contains("bi-bookmark-fill")) {
    // קריאה לשרת להסרת הדירה מהשמורים
    fetch("api/users/remove-saved-apartment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, apartmentId })
    })
      .then(response => {
        if (response.status === 200) {
          icon.classList.remove("bi-bookmark-fill");
          icon.classList.add("bi-bookmark");
          alert("הדירה הוסרה מהדירות השמורות בהצלחה!");
        } else {
          alert("אירעה שגיאה בהסרת הדירות מהדירות השמורות");
        }
      })
      .catch(err => {
        console.error(err);
        alert("אירעה שגיאה בהסרת הדירות מהדירות השמורות. נסה שוב מאוחר יותר");
      });
  }
  else {
    // שליחת בקשה לשרת
    fetch("api/users/add-saved-apartment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, apartmentId })
    })
      .then(response => {
        if (response.status === 200) {
          // החלפת האייקון לסימנייה מלאה
          icon.classList.remove("bi-bookmark");
          icon.classList.add("bi-bookmark-fill");
          alert("הדירה נשמרה בהצלחה!");
          window.location.reload();
        } else {
          alert("אירעה שגיאה בשמירת הדירה.");
        }
      })
      .catch(err => {
        console.error(err);
        alert("אירעה שגיאה בשמירת הדירה. נסה שוב מאוחר יותר.");
      });
  }
}