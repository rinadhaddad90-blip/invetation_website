function enterInvitation() {
  document.querySelector(".opening").style.display = "none";
  document.querySelector("#invitation").style.display = "block";

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


// Countdown
const weddingDate = new Date("October 3, 2026 20:00:00").getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const distance = weddingDate - now;

  if (distance <= 0) {
    document.getElementById("days").textContent = "0";
    document.getElementById("hours").textContent = "00";
    document.getElementById("minutes").textContent = "00";
    document.getElementById("seconds").textContent = "00";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) /
    (1000 * 60 * 60)
  );

  const minutes = Math.floor(
    (distance % (1000 * 60 * 60)) /
    (1000 * 60)
  );

  const seconds = Math.floor(
    (distance % (1000 * 60)) /
    1000
  );

  document.getElementById("days").textContent = days;
  document.getElementById("hours").textContent =
    String(hours).padStart(2, "0");

  document.getElementById("minutes").textContent =
    String(minutes).padStart(2, "0");

  document.getElementById("seconds").textContent =
    String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);


// Guest Messages
async function sendMessage() {
  const name = document.getElementById("guestName").value.trim();
  const message = document.getElementById("guestMessage").value.trim();
  const status = document.getElementById("messageStatus");

  if (!name || !message) {
    status.textContent = "Please enter your name and message.";
    return;
  }

  status.textContent = "Sending...";

  // هنحط رابط Google Apps Script هنا بعدين
  const GOOGLE_SCRIPT_URL = "PUT_YOUR_GOOGLE_SCRIPT_URL_HERE";

  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({
        name: name,
        message: message
      })
    });

    status.textContent = "Your message has been sent 🤍";

    document.getElementById("guestName").value = "";
    document.getElementById("guestMessage").value = "";

  } catch (error) {
    status.textContent = "Something went wrong. Please try again.";
  }
}const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzrL6ZjpajoLvCo4wTAZmzlaSfkwSrBgogJzI25h8dIRE75SOjLea6XYA3z-SxW1hoPDQ/exec";

function sendMessage() {
  const name = document.getElementById("guestName").value.trim();
  const message = document.getElementById("guestMessage").value.trim();
  const status = document.getElementById("messageStatus");

  if (!name || !message) {
    status.textContent = "Please write your name and message.";
    return;
  }

  status.textContent = "Sending...";

  fetch(SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "text/plain"
    },
    body: JSON.stringify({
      name: name,
      message: message
    })
  })
    .then(() => {
      status.textContent = "Your message has been sent 💌";

      document.getElementById("guestName").value = "";
      document.getElementById("guestMessage").value = "";

      setTimeout(loadMessages, 1000);
    })
    .catch(() => {
      status.textContent = "Something went wrong. Please try again.";
    });
}

function loadMessages() {
  fetch(SCRIPT_URL)
    .then(response => response.json())
    .then(data => {
      const messagesList = document.getElementById("messagesList");

      messagesList.innerHTML = "";

      data.slice(1).reverse().forEach(row => {
        const name = row[0];
        const message = row[1];

        if (!name || !message) return;

        const box = document.createElement("div");
        box.className = "guest-message";

        const nameElement = document.createElement("strong");
        nameElement.textContent = name;

        const messageElement = document.createElement("p");
        messageElement.textContent = message;

        box.appendChild(nameElement);
        box.appendChild(messageElement);

        messagesList.appendChild(box);
      });
    })
    .catch(error => {
      console.log("Could not load messages:", error);
    });
}

window.addEventListener("load", loadMessages);