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
        <button class="my-btn" id="btnLogin" onclick="openModal('loginModal')">התחברות</button>
        <!-- כפתור הרשמה -->
        <button class="my-btn" id="btnRegister" onclick="openModal('registerModal')">הרשמה</button>
        <!-- כפתור התנתקות (מוסתר בהתחלה) -->
        <button class="my-btn" id="btnLogout" onclick="logout()" style="display: none;">התנתקות</button>


        <!-- התחברות -->
        <div class="modal-overlay" id="loginModal">
          <div class="my-modal">
            <button class="close-btn" onclick="closeModal('loginModal')">×</button>
            <h2>התחברות למערכת</h2>
            <input class="inputLoginRegister" type="email" id="loginEmail" placeholder="כתובת מייל" />
            <div class="password-container">
              <input class="inputLoginRegister" type="password" id="loginPass" minlength="6" placeholder="סיסמה" />
              <span class="toggle-password" onclick="togglePassword('loginPass', this)">
                <i class="fa fa-eye"></i> </span>
            </div>
            <div id="loginError" class="error"></div>
            <button class="btn-send" onclick="validateLogin()">שלח</button>
          </div>
        </div>
        <!-- הרשמה -->
        <div class="modal-overlay" id="registerModal">
          <div class="my-modal">
            <button class="close-btn" onclick="closeModal('registerModal')">×</button>
            <h2>הרשמה למערכת</h2>
            <input class="inputLoginRegister" type="text" id="regUser" placeholder="שם משתמש" />
            <div class="password-container">
              <input class="inputLoginRegister" type="password" id="regPass" minlength="6" placeholder="סיסמה" />
              <span class="toggle-password" onclick="togglePassword('regPass', this)">
                <i class="fa fa-eye"></i> </span>
            </div>
            <input class="inputLoginRegister" type="text" id="regPhone" placeholder="מספר טלפון" />
            <input class="inputLoginRegister" type="email" id="regEmail" placeholder="כתובת מייל" />
            <div id="registerError" class="error"></div>
            <button class="btn-send" onclick="validateRegister()">שלח</button>
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
        <input type="text" id="searchInput" placeholder="חפש...">
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
        <p>DirotIsrael@gmail.com :אימייל</p>
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
