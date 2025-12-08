<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <title>Il tuo spazio speciale</title>
  <style>
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      background: #0f1724;
      color: white;
      text-align: center;
    }

    .box {
      background: #111827;
      padding: 30px;
      max-width: 400px;
      margin: 100px auto;
      border-radius: 15px;
      box-shadow: 0 0 20px rgba(0,0,0,0.4);
    }

    input, button {
      width: 100%;
      padding: 12px;
      margin-top: 10px;
      border-radius: 8px;
      border: none;
      font-size: 16px;
    }

    button {
      background: #facc15;
      cursor: pointer;
      font-weight: bold;
    }

    #app {
      display: none;
      padding: 20px;
    }

    #emergenzaBtn {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: red;
      color: white;
      border: none;
      border-radius: 12px;
      padding: 14px 18px;
      font-size: 16px;
      cursor: pointer;
      display: none;
    }

    .linkbox {
      margin-top: 20px;
    }

    a {
      color: #facc15;
      text-decoration: none;
      font-size: 18px;
      display: block;
      margin: 10px 0;
    }
  </style>
</head>
<body>

<div class="box" id="loginBox">
  <h2>🔐 Inserisci password</h2>
  <input type="password" id="password" placeholder="Scrivi la password">
  <button onclick="login()">Entra</button>
</div>

<div id="app">
  <h1>🎉 Sei dentro!</h1>
  <p>Il tuo spazio è attivo e funzionante.</p>

  <div class="linkbox">
    <a href="#" onclick="alert('La tua app')">👉 La tua app</a>
    <a href="#" onclick="alert('Sorpresa')">🎁 Sorpresa</a>
  </div>
</div>

<button id="emergenzaBtn" onclick="emergenza()">🆘 Emergenza</button>

<script>
  const USER_PASSWORD = "utente2025";
  const ADMIN_PASSWORD = "admin2025";

  function login() {
    const pw = document.getElementById("password").value;

    if (pw === USER_PASSWORD || pw === ADMIN_PASSWORD) {
      document.getElementById("loginBox").style.display = "none";
      document.getElementById("app").style.display = "block";
      document.getElementById("emergenzaBtn").style.display = "block";
    } else {
      alert("Password sbagliata");
    }
  }

  function emergenza() {
    const scelta = prompt("Emergenza! Digita 1 = Ginseng, 2 = Chiama, 3 = Crêpes");

    if (scelta === "1") {
      alert("💊 Prendi Ginseng!");
    } else if (scelta === "2") {
      alert("📞 Chiama qualcuno!");
    } else if (scelta === "3") {
      alert("🥞 Ordina una crêpes!");
    }
  }
</script>

</body>
</html>
