<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <title>Area Speciale ❤️</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <style>
    body {
      font-family: Arial, sans-serif;
      background: #0d0d0d;
      color: white;
      text-align: center;
      margin: 0;
      padding: 0;
    }

    .box {
      max-width: 700px;
      margin: auto;
      padding: 20px;
    }

    input, textarea, button {
      width: 100%;
      padding: 12px;
      margin: 8px 0;
      border-radius: 12px;
      border: none;
      font-size: 16px;
    }

    button {
      background: #ff4d6d;
      color: white;
      cursor: pointer;
    }

    .hidden { display: none; }

    .card {
      background: #111;
      border-radius: 18px;
      padding: 15px;
      margin: 15px 0;
    }

    img, video, iframe {
      width: 100%;
      border-radius: 12px;
    }

    a {
      color: #ff8fa3;
      font-size: 18px;
      text-decoration: none;
    }
  </style>
</head>
<body>

<div class="box">

  <!-- LOGIN -->
  <div id="loginBox">
    <h2>🔒 Area Protetta</h2>
    <input type="password" id="password" placeholder="Inserisci password">
    <button onclick="login()">Entra</button>
    <p id="error" style="color:#ff6b6b;"></p>
  </div>

  <!-- CONTENUTO -->
  <div id="content" class="hidden">

    <h2>❤️ Benvenuta</h2>

    <!-- FOTO -->
    <div class="card">
      <h3>📸 Foto (da link)</h3>
      <input id="photoLink" placeholder="Incolla link immagine">
      <button onclick="addPhoto()">Aggiungi foto</button>
      <div id="photoList"></div>
    </div>

    <!-- VIDEO -->
    <div class="card">
      <h3>🎬 Video (da link)</h3>
      <input id="videoLink" placeholder="Incolla link YouTube o MP4">
      <button onclick="addVideo()">Aggiungi video</button>
      <div id="videoList"></div>
    </div>

    <!-- LETTERE (LINK) -->
    <div class="card">
      <h3>💌 Lettere (file esterni)</h3>
      <input id="letterName" placeholder="Titolo lettera">
      <input id="letterLink" placeholder="Link (Drive/Dropbox/GitHub)">
      <button onclick="addLetterLink()">Aggiungi lettera</button>
      <div id="letterList"></div>
    </div>

    <!-- CARTACEI (LINK) -->
    <div class="card">
      <h3>📦 Cartacei (foto/pdf esterni)</h3>
      <input id="paperName" placeholder="Nome oggetto">
      <input id="paperLink" placeholder="Link esterno">
      <button onclick="addPaper()">Aggiungi cartaceo</button>
      <div id="paperList"></div>
    </div>

    <!-- CHAT (auto pulizia) -->
    <div class="card">
      <h3>💬 Mini Chat</h3>
      <input id="chatInput" placeholder="Scrivi un messaggio...">
      <button onclick="sendMsg()">Invia</button>
      <div id="chatBox"></div>
    </div>

  </div>

</div>

<script>
  const PASSWORD = "26071989"; // CAMBIA QUI

  def = JSON.parse || function(v){return v};

  function login(){
    const p = document.getElementById("password").value;
    if(p === PASSWORD){
      document.getElementById("loginBox").classList.add("hidden");
      document.getElementById("content").classList.remove("hidden");
      loadAll();
    } else {
      document.getElementById("error").innerText = "Password errata ❌";
    }
  }

  function save(key, data){
    localStorage.setItem(key, JSON.stringify(data));
  }

  function load(key){
    return JSON.parse(localStorage.getItem(key) || "[]");
  }

  function loadAll(){
    renderPhotos();
    renderVideos();
    renderLetters();
    renderPapers();
    renderChat();
  }

  /* FOTO */
  function addPhoto(){
    const link = document.getElementById("photoLink").value;
    if(!link) return;
    let data = load("photos");
    data.push(link);
    save("photos", data);
    document.getElementById("photoLink").value = "";
    renderPhotos();
  }

  function renderPhotos(){
    const list = document.getElementById("photoList");
    list.innerHTML = "";
    load("photos").forEach(l=>{
      list.innerHTML += `<img src="${l}">`;
    });
  }

  /* VIDEO */
  function addVideo(){
    const link = document.getElementById("videoLink").value;
    if(!link) return;
    let data = load("videos");
    data.push(link);
    save("videos", data);
    document.getElementById("videoLink").value = "";
    renderVideos();
  }

  function renderVideos(){
    const list = document.getElementById("videoList");
    list.innerHTML = "";

    load("videos").forEach(l=>{
      if(l.includes("youtube.com") || l.includes("youtu.be")){
        let id = l.split("v=")[1] || l.split("/").pop();
        id = id.split("&")[0];
        list.innerHTML += `<iframe height="315" src="https://www.youtube.com/embed/${id}" allowfullscreen></iframe>`;
      } else {
        list.innerHTML += `<video src="${l}" controls></video>`;
      }
    });
  }

  /* LETTERE (LINK) */
  function addLetterLink(){
    const name = document.getElementById("letterName").value;
    const link = document.getElementById("letterLink").value;
    if(!name || !link) return;
    let data = load("letters");
    data.push({name, link});
    save("letters", data);
    document.getElementById("letterName").value = "";
    document.getElementById("letterLink").value = "";
    renderLetters();
  }

  function renderLetters(){
    const list = document.getElementById("letterList");
    list.innerHTML = "";
    load("letters").forEach(item=>{
      list.innerHTML += `<div class="card"><a href="${item.link}" target="_blank">📄 ${item.name}</a></div>`;
    });
  }

  /* CARTACEI (LINK) */
  function addPaper(){
    const name = document.getElementById("paperName").value;
    const link = document.getElementById("paperLink").value;
    if(!name || !link) return;
    let data = load("papers");
    data.push({name, link});
    save("papers", data);
    document.getElementById("paperName").value = "";
    document.getElementById("paperLink").value = "";
    renderPapers();
  }

  function renderPapers(){
    const list = document.getElementById("paperList");
    list.innerHTML = "";
    load("papers").forEach(item=>{
      list.innerHTML += `<div class="card"><a href="${item.link}" target="_blank">📦 ${item.name}</a></div>`;
    });
  }

  /* CHAT – AUTO RESET OGNI VISITA */
  function sendMsg(){
    const txt = document.getElementById("chatInput").value;
    if(!txt) return;
    let data = load("chat");
    data.push("❤️ " + txt);
    save("chat", data);
    document.getElementById("chatInput").value = "";
    renderChat();
  }

  function renderChat(){
    const list = document.getElementById("chatBox");
    list.innerHTML = "";
    localStorage.removeItem("chat"); // auto pulizia
  }

</script>

</body>
</html>
