document.addEventListener("DOMContentLoaded", () => {

  header();
  footer();
})

function header() {
  const header = document.getElementById("header");
  header.innerHTML = `
    <div class="header">
      <span id="logo"><a href="mainPage.html"><img src="logo.jpg"></a></span>
      <h1 id="titelMainPage">דירות ישראל</h1>
      <span id="buttonMainPageHeader">
        <!-- כפתור התחברות -->
        <button class="my-btn" id="btnLogin" style="border: 1px solid black" onclick="openModal('loginModal')"><b>התחברות</b></button>
        <!-- כפתור הרשמה -->
        <button class="my-btn" id="btnRegister" style="border: 1px solid black" onclick="openModal('registerModal')"><b>הרשמה</b></button>
        <!-- כפתור התנתקות (מוסתר בהתחלה) -->
        <button class="my-btn" id="btnLogout" style="border: 1px solid black" onclick="logout()" style="display: none;"><b>התנתקות</b></button>

        <!-- הרשמה -->
        <div class="modal-overlay" id="registerModal">
          <div class="my-modal">
            <button class="close-btn" onclick="closeModal('registerModal')">×</button>
            <h2>הרשמה למערכת</h2>
            <input class="inputLoginRegister" type="text" id="regUser" placeholder="שם משתמש" />
            <div class="password-container">
              <input class="inputLoginRegister" type="password" id="regPass" minlength="9" placeholder="סיסמה" />
              <span class="toggle-password" onclick="togglePassword('regPass', this)">
                <i class="fa fa-eye"></i> </span>
            </div>
            <input class="inputLoginRegister" type="text" id="regPhone" placeholder="מספר טלפון" />
            <input class="inputLoginRegister" type="email" id="regEmail" placeholder="כתובת מייל" />
            <div id="registerError" class="error"></div>
            <button class="btn-send" onclick="validateRegister()">שלח</button>
          </div>
        </div>
        <!-- התחברות -->
        <div class="modal-overlay" id="loginModal">
          <div class="my-modal">
            <button class="close-btn" onclick="closeModal('loginModal')">×</button>
            <h2>התחברות למערכת</h2>
            <input class="inputLoginRegister" type="email" id="loginEmail" placeholder="כתובת מייל" />
            <div class="password-container">
              <input class="inputLoginRegister" type="password" id="loginPass" minlength="9" placeholder="סיסמה" />
              <span class="toggle-password" style="transform: translateY(-115%);" onclick="togglePassword('loginPass', this)">
                <i class="fa fa-eye"></i> </span>
              <div class="forgot-password-link">
              <a href="#" onclick="openForgotPassword()">שכחתי סיסמה</a>
              </div>
            </div>
            <div id="loginError" class="error"></div>
            <button class="btn-send" onclick="validateLogin()">שלח</button>
          </div>
        </div>
        <!-- שכחתי סיסמה -->
        <div class="modal-overlay" id="forgotPasswordModal">
          <div class="my-modal">
            <button class="close-btn" onclick="closeModal('forgotPasswordModal')">×</button>
            <h2>שכחתי סיסמה</h2>
            <input class="inputLoginRegister" type="email" id="forgotPasswordEmail" placeholder="כתובת מייל" />
            <input class="inputLoginRegister" type="text" id="forgotPasswordPhone" placeholder="מספר טלפון" />
            <div id="forgotPasswordError" class="error"></div>
            <button class="btn-send" onclick="validateForgotPassword()">שלח</button>
          </div>
        </div>
        <!-- קביעת סיסמה חדשה -->
        <div class="modal-overlay" id="resetPasswordModal">
          <div class="my-modal">
            <button class="close-btn" onclick="closeModal('resetPasswordModal')">×</button>
            <h2>הגדרת סיסמה חדשה</h2>
            <div class="password-container">
              <input class="inputLoginRegister" type="password" id="newPassword" placeholder="סיסמה חדשה" minlength="9" />
              <span class="toggle-password" onclick="togglePassword('newPassword', this)">
                <i class="fa fa-eye"></i> </span>
            </div>
            <div class="password-container">    
              <input class="inputLoginRegister" type="password" id="confirmNewPassword" placeholder="אימות סיסמה חדשה" minlength="9" />
              <span class="toggle-password" onclick="togglePassword('confirmNewPassword', this)">
                <i class="fa fa-eye"></i> </span>
            </div>
            <div id="resetPasswordError" class="error"></div>
            <button class="btn-send" onclick="submitNewPassword()">אישור</button>
          </div>
        </div>
      </span>
    </div>

    <ul>
      <li><a href="mainPage.html">בית</a></li>
      <li><a href="about.html">אודותנו</a></li>
      <li class="my-dropdown">
        <a href="apartments.html" class="dropbtn">דירות</a>
        <div class="my-dropdown-content">
          <a href="apartmentsForSale.html">דירות למכירה</a>
          <a href="apartmentsForRent.html">דירות להשכרה</a>
        </div>
      </li>
      <li><a href="newApartment.html">+ פרסם דירה</a></li>
      <li><a href="newInquiry.html">+ השאר פניה</a></li>
      <li class="search-container" style="margin-top: 3.5px;">
        <input type="text" id="searchInput" placeholder="חפש לפי: עיר / רחוב / קומה / מטר רבוע / מספר חדרים.">
        <i class="fas fa-search search-icon"></i>
      </li>
      <li style="float: left; display: none;" id="iconUser"><a href="personalArea.html" id="iconPerson"><i
            class="fas fa-user"></i></a></li>
    </ul>
`;
}

function footer() {
  const footer = document.getElementById("footer");
  footer.innerHTML = `<div class="footer-content">
      <div class="contact-info">
        <p><b>פרטי יצירת קשר:</b></p>
        <p>כתובת: תל אביב, רחוב אלנבי 123</p>
        <p>טלפון: 03-1234567</p>
        <p>אימייל: DirotIsrael@gmail.com</p>
      </div>
      <div class="social-icons">
        <p><b>בקרו אותנו ברשתות החברתיות:</b></p>
        <a href="#"><i class="fab fa-facebook-f"></i></a>
        <a href="#"><i class="fab fa-instagram"></i></a>
        <a href="#"><i class="fab fa-linkedin-in"></i></a>
        <a href="#"><i class="fab fa-twitter"></i></a>
      </div>
    </div>`;
}


//אחראי על החיפוש
document.addEventListener("DOMContentLoaded", () => {
  const searchIcon = document.querySelector(".search-icon");
  const searchInput = document.getElementById("searchInput");

  searchIcon.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (query) {
      window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    }
  });
});
