async function submitRequest() {
    const message = document.getElementById("message").value.trim();
    const responseDiv = document.getElementById("response");

    if (!message) {
      responseDiv.textContent = "אנא הזן תוכן לפנייה.";
      return;
    }

    try {
      const res = await fetch('/api/add-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });

      const data = await res.json();

      if (data.success) {
        responseDiv.style.color = "green";
        responseDiv.textContent = "הפנייה נשלחה בהצלחה!";
        document.getElementById("message").value = "";
      } else {
        responseDiv.style.color = "red";
        responseDiv.textContent = data.message || "משהו השתבש. נסה שוב.";
      }

    } catch (err) {
      responseDiv.textContent = "שגיאה בשרת. נסה שוב מאוחר יותר.";
    }
  }