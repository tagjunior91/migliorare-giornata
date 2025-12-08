const adminPassword = "admin123"; // Cambia con la tua password
const userPassword = "user123";   // Cambia con la tua password

function login() {
    const password = document.getElementById("password").value;
    const errorMsg = document.getElementById("errorMsg");

    if(password === adminPassword) {
        document.getElementById("loginDiv").style.display = "none";
        document.getElementById("contentDiv").style.display = "block";
        alert("Accesso come Amministratore");
    } else if(password === userPassword) {
        document.getElementById("loginDiv").style.display = "none";
        document.getElementById("contentDiv").style.display = "block";
        alert("Accesso come Utente");
    } else {
        errorMsg.textContent = "Password errata!";
    }
}

// Mini chat base (salvataggio locale)
function sendMessage() {
    const input = document.getElementById("chatInput");
    const chatBox = document.getElementById("chatBox");
    if(input.value.trim() !== "") {
        const msg = document.createElement("div");
        msg.textContent = input.value;
        msg.className = "chatMessage";
        chatBox.appendChild(msg);
        input.value = "";
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}
