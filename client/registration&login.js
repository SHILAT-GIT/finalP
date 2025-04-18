
function openModal(id) {
  document.getElementById(id).style.display = 'flex';
}

function closeModal(id) {
  document.getElementById(id).style.display = 'none';
  clearErrors();
  clearInputs(id);
}

function clearErrors() {
  document.getElementById("loginError").textContent = "";
  document.getElementById("registerError").textContent = "";
}

/*function clearInputs(modalId) {
  const inputs = document.querySelectorAll(`#${modalId} input`);
  inputs.forEach(input => input.value = '');
  
}*/

function clearInputs(modalId) {
  const modal = document.getElementById(modalId);

  // מאתחלים את כל שדות הסיסמה
  const passwordContainers = modal.querySelectorAll('.password-container');

  passwordContainers.forEach(container => {
    const input = container.querySelector('input');
    const eyeIcon = container.querySelector('i');

    if (input) {
      input.value = '';
      input.type = 'password'; // מחזיר תמיד ל-password
    }

    if (eyeIcon) {
      eyeIcon.classList.remove('fa-eye-slash');
      eyeIcon.classList.add('fa-eye');
    }
  });

  // מנקים גם את שאר השדות בטופס (שאינם בתוך password-container)
  const otherInputs = modal.querySelectorAll('input:not([type="checkbox"])');
  otherInputs.forEach(input => {
    // לא מנקים שדות שכבר טופלו למעלה (בתוך password-container)
    if (!input.closest('.password-container')) {
      input.value = '';
    }
  });
}




function togglePassword(inputId, toggleElement) {
  const input = document.getElementById(inputId);
  const eyeIcon = toggleElement.querySelector('i');

  if (input.value.trim() === "") {
    return; // אם השדה ריק, צא מהפונקציה ולא תתבצע פעולה
  }
  if (input.type === "password") {
    input.type = "text";
    eyeIcon.classList.remove('fa-eye');
    eyeIcon.classList.add('fa-eye-slash');
  } else {
    input.type = "password";
    eyeIcon.classList.remove('fa-eye-slash');
    eyeIcon.classList.add('fa-eye');
  }

}



async function validateLogin() {
  const email = document.getElementById("loginEmail").value.trim();
  const pass = document.getElementById("loginPass").value.trim();
  const errorDiv = document.getElementById("loginError");

  const emailRegex = /^[a-zA-Z0-9._-]{2,}@[a-zA-Z0-9.-]{2,}\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/;
  const passwordRegex = /^(?!.*\s).*/;

  if (!email && !pass) {
    errorDiv.textContent = "נא למלא כתובת מייל וסיסמה.";
    return;
  }

  if (!email) {
    errorDiv.textContent = "נא למלא כתובת מייל.";
    return;
  }

  if (!pass) {
    errorDiv.textContent = "נא למלא סיסמה.";
    return;
  }

  if (pass.length < 6) {
    errorDiv.textContent = "סיסמה חייבת להכיל לפחות 6 תווים.";
    return;
  }

  if (!passwordRegex.test(pass)) {
    errorDiv.textContent = "סיסמה לא תקינה";
    return;
  }

  if (!emailRegex.test(email)) {
    errorDiv.textContent = "כתובת מייל לא תקינה.";
    return;
  }

  try {
    const response = await fetch("api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: pass,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      // שמירה ב-localStorage
      // localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.setItem("user", JSON.stringify({
        id: result.user.id,
        role: result.user.role
      }));
      //הוספה להפעלת הפונקציה שמשנה כפתורים בביצוע התחברות
      updateAuthUI();

      alert("התחברת בהצלחה!");
      errorDiv.textContent = "";
      closeModal("loginModal");
      // אפשר להפנות לעמוד אחר אם רוצים:
      // window.location.href = "/dashboard.html";
    } else {
      errorDiv.textContent = result.message || "שגיאה בהתחברות.";
    }
  } catch (error) {
    errorDiv.textContent = "שגיאה בשרת. נסה/י שוב מאוחר יותר.";
    console.error(error);
  }
}

//פונקציה זו אחראית על החלפת כפתור התחברות להתנתקות בביצוע התחברות
function updateAuthUI() {
  const user = localStorage.getItem("user");

  const btnLogin = document.getElementById("btnLogin");
  const btnRegister = document.getElementById("btnRegister");
  const btnLogout = document.getElementById("btnLogout");
  const iconUser = document.getElementById("iconUser");

  if (user) {
    btnLogin.style.display = "none";
    btnRegister.style.display = "none";
    btnLogout.style.display = "inline-block";
    iconUser.style.display = "inline-block";
  } else {
    btnLogin.style.display = "inline-block";
    btnRegister.style.display = "inline-block";
    btnLogout.style.display = "none";
    iconUser.style.display = "none";
  }
}

//הפעלת הפונקציה להחלפת כפתורים בטעינת העמוד
window.onload = function () {
  updateAuthUI();
};


async function validateRegister() {
  const user = document.getElementById("regUser").value.trim();
  const pass = document.getElementById("regPass").value.trim();
  const phone = document.getElementById("regPhone").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const errorDiv = document.getElementById("registerError");

  const phoneRegex = /05[0-9]{8}$/;
  const emailRegex = /^[a-zA-Z0-9._-]{2,}@[a-zA-Z0-9.-]{2,}\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/;
  const passwordRegex = /^(?!.*\s).*/;

  if (!user || !pass || !phone || !email) {
    errorDiv.textContent = "נא למלא את כל השדות.";
    return;
  }

  if (pass.length < 6) {
    errorDiv.textContent = "סיסמה חייבת להכיל לפחות 6 תווים.";
    return;
  }

  if (!passwordRegex.test(pass)) {
    errorDiv.textContent = "סיסמה לא תקינה.";
    return;
  }

  if (!phoneRegex.test(phone)) {
    errorDiv.textContent = "מספר טלפון לא תקין.";
    return;
  }

  if (!emailRegex.test(email)) {
    errorDiv.textContent = "כתובת מייל לא תקינה.";
    return;
  }

  // שליחת נתונים לשרת
  try {
    const response = await fetch("api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: user,
        email: email,
        phone: phone,
        password: pass,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      alert("נרשמת בהצלחה!");
      errorDiv.textContent = "";
      closeModal("registerModal");
    } else {
      errorDiv.textContent = result.message || "שגיאה בהרשמה.";
    }
  } catch (error) {
    errorDiv.textContent = "שגיאת רשת. נסה/י שוב מאוחר יותר.";
    console.error(error);
  }
}


// הסרת הודעת שגיאה בזמן שמתחילים להקליד
document.querySelectorAll('#registerModal input').forEach(input => {
  input.addEventListener('input', () => {
    document.getElementById('registerError').textContent = '';
  });
});

document.querySelectorAll('#loginModal input').forEach(input => {
  input.addEventListener('input', () => {
    document.getElementById('loginError').textContent = '';
  });
});


//פונקציה המתבצעת בלחיצה על כפתור התנתקות
function logout() {
  const confirmLogout = confirm("האם אתה בטוח שברצונך להתנתק מהמערכת?");

  if (confirmLogout) {
    localStorage.removeItem("user");
    updateAuthUI();
    alert("התנתקת מהמערכת.");
    if (window.location.pathname.startsWith("/personalArea") ||
      window.location.pathname.startsWith("/personalAreaApartments") ||
      window.location.pathname.startsWith("/personalAreaInquiries") ||
      window.location.pathname.startsWith("/savedApartments")) {
      window.location.href = "/";
    }
  } else {
    alert("ההתנתקות בוטלה.");
  }
}

