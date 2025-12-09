<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <title>Area Riservata ❤️</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <style>
    body {
      font-family: Arial, sans-serif;
      background: #0d0d0d;
      color: #fff;
      margin: 0;
      padding: 0;
      text-align: center;
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
      border-radius: 10px;
      border: none;
      font-size: 16px;
    }

    button {
      background: #ff4d6d;
      color: white;
      cursor: pointer;
    }

    .hidden {
      display: none;
    }

    .card {
      background: #111;
      border-radius: 16px;
      padding: 15px;
      margin: 15px 0;
    }

    img, video, iframe {
      width: 100%;
      border-radius: 12px;
      margin-top: 10px;
    }

    a {
      color: #ff8fa3;
      text-decoration: none;
      font-size: 18px;
    }

    hr {
      border: none;
      border-top: 1px solid #333;
      margin: 20px 0;
    }
  </style>
</head>
<body>

<div class="box">

  <!-- Login -->
  <div id="loginBox">
    <h2>🔒 Area Protetta</h2>
    <input type="password" id="password" placeholder="Inserisci la password">
    <button onclick="login()">Entra</button>
    <p id="error" style="color:#ff6b6b;"></p>
  </div>

  <!-- Contenuto -->
  <div id="content" class="hidden">

    <h2>❤️ Benvenuta</h2>

    <!-- FOTO -->
    <div class="card">
      <h3>📸 Foto</h3>
      <input id="photoLink" placeholder="Incolla link immagine (https://...)">
      <button onclick="addPhoto()">Aggiungi foto</button>
      <div id="photoList"></div>
    </div>

    <!-- VIDEO -->
    <div class="card">
      <h3>🎬 Video</h3>
      <input id="videoLink" placeholder="Incolla link video (YouTube/mp4)">
      <button onclick="addVideo()">Aggiungi video</button>
      <div id="videoList"></div>
    </div>

    <!-- LETTERE -->
    <div class="card">
      <h3>💌 Lettere</h3>
      <textarea id="letterText" placeholder="Scrivi una lettera..."></textarea>
      <button onclick="addLetter()">Salva lettera</button>
      <div id="letterList"></div>
    </div>

    <!-- CHAT -->
    <div class="card">
      <h3>💬 Mini Chat</h3>
      <input id="chatInput" placeholder="Scrivi un messaggio...">
      <button onclick="sendMsg()">Invia</button>
      <div id="chatBox"></div>
    </div>

    <!-- LINK ESTERNI -->
    <div class="card">
      <h3>🌍 Link Speciali</h3>
      <input id="siteName" placeholder="Nome sito">
      <input id="siteLink" placeholder="Link https://...">
      <button onclick="addLink()">Aggiungi link</button>
      <div id="linkList"></div>
    </div>

  </div>
</div>

<script>
  const PASSWORD = "amore123";   // <-- cambia qui la password

  function login(){
    const p = document.getElementById('password').value;
    if(p === PASSWORD){
      document.getElementById('loginBox').classList.add('hidden');
      document.getElementById('content').classList.remove('hidden');
      loadAll();
    } else {
      document.getElementById('error').innerText = 'Password errata ❌';
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
    renderChat();
    renderLinks();
  }

  /* FOTO */
  function addPhoto(){
    const link = document.getElementById('photoLink').value;
    if(!link) return;
    const photos = load('photos');
    photos.push(link);
    save('photos', photos);
    document.getElementById('photoLink').value='';
    renderPhotos();
  }

  function renderPhotos(){
    const list = document.getElementById('photoList');
    const photos = load('photos');
    list.innerHTML = '';
    photos.forEach(l=>{
      list.innerHTML += `<img src="${l}">`;
    });
  }

  /* VIDEO */
  function addVideo(){
    const link = document.getElementById('videoLink').value;
    if(!link) return;
    const videos = load('videos');
    videos.push(link);
    save('videos', videos);
    document.getElementById('videoLink').value='';
    renderVideos();
  }

  function renderVideos(){
    const list = document.getElementById('videoList');
    const videos = load('videos');
    list.innerHTML = '';

    videos.forEach(l=>{
      if(l.includes('youtube.com') || l.includes('youtu.be')){
        let id = l.split('v=')[1] || l.split('/').pop();
        const clean = id.split('&')[0];
        list.innerHTML += `
          <iframe height="315" src="https://www.youtube.com/embed/${clean}" allowfullscreen></iframe>
        `;
      } else {
        list.innerHTML += `<video src="${l}" controls></video>`;
      }
    });
  }

  /* LETTERE */
  function addLetter(){
    const txt = document.getElementById('letterText').value;
    if(!txt) return;
    const letters = load('letters');
    letters.push(txt);
    save('letters', letters);
    document.getElementById('letterText').value='';
    renderLetters();
  }

  function renderLetters(){
    const list = document.getElementById('letterList');
    const letters = load('letters');
    list.innerHTML = '';
    letters.forEach(t=>{
      list.innerHTML += `<div class="card">${t}</div>`;
    });
  }

  /* CHAT */
  function sendMsg(){
    const txt = document.getElementById('chatInput').value;
    if(!txt) return;
    const chat = load('chat');
    chat.push("❤️ " + txt);
    save('chat', chat);
    document.getElementById('chatInput').value='';
    renderChat();
  }

  function renderChat(){
    const list = document.getElementById('chatBox');
    const chat = load('chat');
    list.innerHTML = '';
    chat.forEach(m=>{
      list.innerHTML += `<div class="card">${m}</div>`;
    });
  }

  /* LINK */
  function addLink(){
    const name = document.getElementById('siteName').value;
    const link = document.getElementById('siteLink').value;
    if(!name || !link) return;
    const links = load('links');
    links.push({name, link});
    save('links', links);
    document.getElementById('siteName').value='';
    document.getElementById('siteLink').value='';
    renderLinks();
  }

  function renderLinks(){
    const list = document.getElementById('linkList');
    const links = load('links');
    list.innerHTML = '';
    links.forEach(l=>{
      list.innerHTML += `<div class="card"><a href="${l.link}" target="_blank">${l.name}</a></div>`;
    });
  }
</script>

</body>
</html>