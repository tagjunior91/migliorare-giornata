<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <title>Area Riservata ❤️</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f2f2f2;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }
    #login, #content {
      background: white;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0,0,0,0.2);
      width: 90%;
      max-width: 450px;
    }
    h2, h3 { text-align: center; }
    input, button {
      width: 100%;
      padding: 10px;
      margin-top: 10px;
      border-radius: 5px;
      border: 1px solid #ccc;
    }
    button {
      background-color: black;
      color: white;
      cursor: pointer;
    }
    .hidden { display: none; }
    .section {
      background: #fafafa;
      padding: 15px;
      margin-top: 15px;
      border-radius: 10px;
      border: 1px solid #ddd;
    }
    #chat-box {
      height: 150px;
      overflow-y: auto;
      border: 1px solid #ccc;
      padding: 10px;
      background: white;
    }
  </style>
</head>
<body>

<!-- LOGIN -->
<div id="login">
  <h2>Accedi ❤️</h2>
  <input type="password" id="password" placeholder="Inserisci la password">
  <button onclick="checkPassword()">Entra</button>
</div>

<!-- CONTENUTO SEGRETO -->
<div id="content" class="hidden">
  <h2>Benvenuta ❤️</h2>

  <!-- FOTO & LETTERE -->
  <div class="section">
    <h3>📸 Foto & 📄 Lettere</h3>
    <p>Apri la cartella protetta:</p>
    <a href="INSERISCI_LINK_GOOGLE_DRIVE" target="_blank">Vai alle foto e lettere</a>
  </div>

  <!-- SPOTIFY EMBED -->
  <div class="section">
    <h3>🎵 Playlist Spotify</h3>
    <iframe style="border-radius:12px"
      src="INSERISCI_LINK_EMBED_SPOTIFY"
      width="100%"
      height="352"
      frameborder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture">
    </iframe>
  </div>

  <!-- MINI CHAT -->
  <div class="section">
    <h3>💬 Mini-Chat</h3>
    <div id="chat-box"></div>
    <input type="text" id="chat-input" placeholder="Scrivi un messaggio…">
    <button onclick="sendMessage()">Invia</button>
  </div>

</div>

<script>
  function checkPassword() {
    const pass = document.getElementById("password").value;
    if (pass === "la_tua_password") {
      document.getElementById("login").classList.add("hidden");
      document.getElementById("content").classList.remove("hidden");
    } else {
      alert("Password errata 😢");
    }
  }

  function sendMessage() {
    const box = document.getElementById("chat-box");
    const text = document.getElementById("chat-input").value;
    if (text.trim() === "") return;
    box.innerHTML += "<div>• " + text + "</div>";
    document.getElementById("chat-input").value = "";
    box.scrollTop = box.scrollHeight;
  }
</script>

</body>
</html>