
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

  /*// איפוס צ׳קבוקסים אם יש
  const checkboxes = modal.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => checkbox.checked = false);*/
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




function validateLogin() {
  const user = document.getElementById("loginUser").value.trim();
  const pass = document.getElementById("loginPass").value.trim();
  const errorDiv = document.getElementById("loginError");

  if (!user && !pass) {
    errorDiv.textContent = "נא למלא שם משתמש וסיסמה.";
    return;
  }

  if (!user) {
    errorDiv.textContent = "נא למלא שם משתמש.";
    return;
  }

  if (!pass) {
    errorDiv.textContent = "נא למלא סיסמה.";
    return;
  }



  errorDiv.textContent = "";
  alert("התחברת בהצלחה!");
  closeModal("loginModal");
}

function validateRegister() {
  const user = document.getElementById("regUser").value.trim();
  const pass = document.getElementById("regPass").value.trim();
  const phone = document.getElementById("regPhone").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const errorDiv = document.getElementById("registerError");

  const phoneRegex = /^[0-9]{9,10}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!user || !pass || !phone || !email) {
    errorDiv.textContent = "נא למלא את כל השדות.";
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

  errorDiv.textContent = "";
  alert("נרשמת בהצלחה!");
  closeModal("registerModal");
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