/*
const form = document.getElementById("apartmentForm");

  function validateDigitsOnly(input) {
    input.value = input.value.replace(/[^0-9]/g, "");
  }

  function validatePrice(input) {
    input.value = input.value.replace(/[^0-9,]/g, "");
  }

  function validateDecimal(input) {
    input.value = input.value.replace(/[^0-9.]/g, "");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    let isValid = true;

    const type = form.type.value;
    const price = form.price.value;
    const apartmentNumber = form.apartmentNumber.value;
    const region = form.region.value;
    const size = form.sizeInSquareMeters.value;
    const rooms = form.numberOfRooms.value;
    const floor = form.floor.value;

    // Check required selects
    if (!type) {
      isValid = false;
      document.getElementById("typeError").style.display = "block";
    } else document.getElementById("typeError").style.display = "none";

    if (!region) {
      isValid = false;
      document.getElementById("regionError").style.display = "block";
    } else document.getElementById("regionError").style.display = "none";

    if (!/^[0-9,]+$/.test(price)) {
      isValid = false;
      document.getElementById("priceError").style.display = "block";
    } else document.getElementById("priceError").style.display = "none";

    if (!/^\d+$/.test(apartmentNumber)) {
      isValid = false;
      document.getElementById("aptNumError").style.display = "block";
    } else document.getElementById("aptNumError").style.display = "none";

    if (!/^\d+(\.\d+)?$/.test(size)) {
      isValid = false;
      document.getElementById("sizeError").style.display = "block";
    } else document.getElementById("sizeError").style.display = "none";

    if (!/^\d+(\.\d+)?$/.test(rooms)) {
      isValid = false;
      document.getElementById("roomsError").style.display = "block";
    } else document.getElementById("roomsError").style.display = "none";

    if (!/^\d+$/.test(floor)) {
      isValid = false;
      document.getElementById("floorError").style.display = "block";
    } else document.getElementById("floorError").style.display = "none";

    if (isValid) {
      // שליחת הטופס אם הכול תקין
      form.submit();
    }
  });*/
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("עליך לבצע התחברות על מנת לפרסם דירה באתר.");
  } else {
    const form = document.getElementById("apartmentForm");
  
    function validateDigitsOnly(input) {
      input.value = input.value.replace(/[^0-9]/g, "");
    }
  
    function validatePrice(input) {
      input.value = input.value.replace(/[^0-9,]/g, "");
    }
  
    function validateDecimal(input) {
      input.value = input.value.replace(/[^0-9.]/g, "");
    }
  
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      let isValid = true;
  
      const requiredFields = [
        { name: "type", errorId: "typeError", message: "נא לבחור סוג דירה" },
        { name: "price", errorId: "priceError", pattern: /^[0-9,]+$/, message: "יש להזין מחיר עם ספרות ופסיקים בלבד (לדוג' 1,000,000)" },
        { name: "apartmentNumber", errorId: "aptNumError", pattern: /^\d+$/, message: "יש להזין ספרות בלבד" },
        { name: "street", errorId: "streetError", message: "נא להזין את שם הרחוב" },
        { name: "city", errorId: "cityError", message: "נא להזין את שם העיר" },
        { name: "region", errorId: "regionError", message: "נא לבחור אזור" },
        { name: "sizeInSquareMeters", errorId: "sizeError", pattern: /^\d+(\.\d+)?$/, message: "יש להזין מספר עם נקודה בלבד" },
        { name: "numberOfRooms", errorId: "roomsError", pattern: /^\d+(\.\d+)?$/, message: "יש להזין מספר עם נקודה בלבד" },
        { name: "floor", errorId: "floorError", message: "נא להזין את מספר או תיאור הקומה" },
        { name: "images", errorId: "imagesError", message: "נא להעלות לפחות תמונה אחת" },
      ];
  
      requiredFields.forEach(({ name, errorId, pattern, message }) => {
        const field = form[name];
        const errorElement = document.getElementById(errorId);
  
        let value = field.value?.trim?.() ?? ""; // ברירת מחדל
        let isFieldValid = true;
  
        // טיפול מיוחד לתמונות:
        if (name === "images") {
          const files = field.files;
          const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  
          isFieldValid = files && files.length > 0;
  
          if (isFieldValid) {
            for (const file of files) {
              if (!allowedTypes.includes(file.type)) {
                isFieldValid = false;
                break;
              }
            }
          }
        } else if (!value || (pattern && !pattern.test(value))) {
          isFieldValid = false;
        }
  
        if (!isFieldValid) {
          isValid = false;
          errorElement.textContent = message;
          errorElement.style.display = "block";
        } else {
          errorElement.style.display = "none";
        }
      });
  
  
      /*if (isValid) {
        // כאן אפשר לשלוח את הטופס אם הכל תקין
        form.submit();
      }*/
      if (isValid) {
        const formData = new FormData(form);
        formData.append("userId", user.id);
  
        for (let [key, value] of formData.entries()) {
          console.log(key, value);
        }
  
        fetch("api/apartments/add-apartment", {
            method: "POST",
            body: formData
        })
            .then((res) => {
                if (res.ok) {
                    alert("הדירה נשלחה בהצלחה!");
                    form.reset(); // נקה את כל השדות כולל קבצים
                    // ננקה גם את הודעות השגיאה
                    document.querySelectorAll(".error").forEach(el => el.style.display = "none");
                } else {
                    alert("קרתה שגיאה בשליחה. נסה שוב.");
                }
            })
            .catch(() => {
                alert("קרתה שגיאה בשליחה. נסה שוב.");
            });
            
      }
  
    });
  
  }