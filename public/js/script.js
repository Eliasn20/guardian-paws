
setInterval(() => {
    const now = new Date();
    const options = {
      timeZone: 'America/Toronto', 
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    document.getElementById("datetime").textContent = now.toLocaleString("en-CA", options);
  }, 1000);
  
  function toggleDisclaimer() {
    const disclaimer = document.getElementById("privacy-content");
    if (disclaimer) {
      disclaimer.style.display = disclaimer.style.display === "none" ? "block" : "none";
    }
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    const findForm = document.querySelector('form[action*="search"]');
    if (findForm) {
      findForm.addEventListener("submit", (e) => {
        const inputs = findForm.querySelectorAll("input, select");
        for (let input of inputs) {
          if (input.type !== "checkbox" && input.value.trim() === "") {
            e.preventDefault();
            alert("Please fill out all fields before submitting.");
            return;
          }
        }
      });
    }
  
    const giveawayForm = document.querySelector('form[action="/give"]');
    if (giveawayForm) {
      giveawayForm.addEventListener("submit", (e) => {
        const requiredInputs = giveawayForm.querySelectorAll("input[required], select[required], textarea[required]");
        for (let input of requiredInputs) {
          if (input.value.trim() === "") {
            e.preventDefault();
            alert("Please complete all required fields.");
            return;
          }
        }
  
        const email = giveawayForm.querySelector("input[name='owner_email']");
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email.value.trim())) {
          e.preventDefault();
          alert("Please enter a valid email address.");
        }
      });
    }
  });
  