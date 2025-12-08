
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <title>Sito Privato</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #111;
      color: white;
      text-align: center;
      padding: 20px;
    }
    .box {
      max-width: 400px;
      margin: auto;
      padding: 20px;
      background: #222;
      border-radius: 12px;
    }
    input, button, textarea {
      width: 100%;
      padding: 12px;
      margin: 10px 0;
      border-radius: 8px;
      border: none;
      font-size: 16px;
    }
    button {
      background: gold;
      color: black;
      font-weight: bold;
      cursor: pointer;
    }
    .hidden {
      display: none;
    }
    .admin {
      background: #333;
      padding: 15px;
      border-radius: 10px;
      margin-top: 15px;
    }
    .emergenza {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: red;
      color: white;
      border: none;
      padding: 15px 30px;
      border-radius: 50px;
      font-size: 18px;
      font-weight: bold;
    }
    .cartacei {
      background: white;
      color: black;
      padding: 15px;
      border-radius: 10px;
      margin-top: 15px;
    }
  </style>
</head>
<body>

<div class="box" id="loginBox">
  <h2>Accesso Riservato</h2>
  <input type="password" id="pass" placeholder="Inserisci password">
  <button onclick="login()">Entra</button>
</div>

<div class="box hidden" id="userBox">
  <h2>Benvenuto</h2>
  <button onclick="openLink('https://thunkable.com')">La tua app</button>
  <button onclick="openLink('https://github.com')">Sorpresa</button>
  
  <div class="admin">
    <h3>Chat con Piccolo genio</h3>
    <textarea id="msg" placeholder="Scrivi qui..."></textarea>
    <button onclick="sendMsg()">Invia</button>
    <div id="chat"></div>
  </div>

  <div class="cartacei">
    <h3>Cartacei consegnati</h3>
    <p>Nessun documento ancora</p>
  </div>
</div>

<button class="emergenza" onclick="emergenza()">🚨 EMERGENZA</button>

<script>
  const userPass = "0000";
  const adminPass = "1111";

  function login() {
    let p = document.getElementById("pass").value;
    if (p === userPass || p === adminPass) {
      document.getElementById("loginBox").classList.add("hidden");
      document.getElementById("userBox").classList.remove("hidden");
    } else {
      alert("Password errata");
    }
  }

  function openLink(url) {
    window.open(url, "_blank");
  }

  function sendMsg() {
    let msg = document.getElementById("msg").value;
    if (msg !== "") {
      document.getElementById("chat").innerHTML += "<p>👤: " + msg + "</p>";
      document.getElementById("msg").value = "";
    }
  }

  function emergenza() {
    alert("Respira. Ginseng. Chiama qualcuno. Ordina una crêpes.");
  }
</script>

</body>
</html>
