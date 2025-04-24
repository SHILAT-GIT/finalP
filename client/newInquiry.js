async function submitRequest() {
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();
  const responseDiv = document.getElementById("response");

  if (!name&&!phone&&!email&&!message) {
    responseDiv.classList.add("message-error");
    responseDiv.textContent = "אנא הזן פרטי פניה.";
    return;
  }
  
  if (!name) {
    responseDiv.classList.add("message-error");
    responseDiv.textContent = "אנא הזן שם.";
    return;
  }

  if (!phone) {
    responseDiv.classList.add("message-error");
    responseDiv.textContent = "אנא הזן מספר טלפון.";
    return;
  }


  const phoneRegex = /05[0-9]{8}$/;
  const emailRegex = /^[a-zA-Z0-9._-]{2,}@[a-zA-Z0-9.-]{2,}\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/;

  if (!phoneRegex.test(phone)) {
    responseDiv.classList.add("message-error");
    responseDiv.textContent = "מספר טלפון לא תקין.";
    return;
  }

  if (!email) {
    responseDiv.classList.add("message-error");
    responseDiv.textContent = "אנא הזן כתובת מייל.";
    return;
  }

  if (!emailRegex.test(email)) {
    responseDiv.classList.add("message-error");
    responseDiv.textContent = "כתובת מייל לא תקינה.";
    return;
  }

  if (!message) {
    responseDiv.classList.add("message-error");
    responseDiv.textContent = "אנא הזן תוכן לפנייה.";
    return;
  }

  try {
    responseDiv.classList.remove("message-error");
    responseDiv.textContent = "";

    const res = await fetch('/api/generalInquiries/send-inquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, email, message })
    });

    if (res.status === 200) {
      alert("הפנייה נשלחה בהצלחה!");
    } else {
      console.error(data.message);
      alert("משהו השתבש. נסה שוב.");
    }

    setTimeout(() => {
      document.getElementById("name").value = "";
      document.getElementById("phone").value = "";
      document.getElementById("email").value = "";
      document.getElementById("message").value = "";
      responseDiv.textContent = "";
    }, 10000);

  } catch (err) {
    alert("שגיאה בשרת. נסה שוב מאוחר יותר.");
  }
}