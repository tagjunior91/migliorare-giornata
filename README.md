<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <title>Area Protetta ❤️</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <style>
    body{
      background:#0d0d0d;
      font-family:Arial, sans-serif;
      color:white;
      margin:0;
      text-align:center;
    }
    .box{max-width:700px;margin:auto;padding:20px;}
    input,textarea,button{
      width:100%;padding:12px;margin:6px 0;
      border-radius:10px;border:none;font-size:16px;
    }
    button{background:#ff4d6d;color:white;cursor:pointer;}
    .card{
      background:#111;padding:15px;margin:10px 0;border-radius:14px;
    }
    .hidden{display:none;}
    img,video,iframe{width:100%;border-radius:12px;margin-top:10px;}
    a{color:#ff8fa3;text-decoration:none;font-size:18px;}
    #chatBox{max-height:250px;overflow:auto;}
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
      <h3>📸 Foto</h3>
      <input id="photoLink" placeholder="Link foto (https://...)">
      <button onclick="addPhoto()">Aggiungi foto</button>
      <div id="photoList"></div>
    </div>

    <!-- VIDEO -->
    <div class="card">
      <h3>🎬 Video</h3>
      <input id="videoLink" placeholder="Link video (YouTube/mp4)">
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
      <h3>💬 Chat</h3>
      <input id="chatInput" placeholder="Scrivi...">
      <button onclick="sendMsg()">Invia</button>
      <div id="chatBox"></div>
    </div>

    <!-- LINK -->
    <div class="card">
      <h3>🌍 Link Speciali</h3>
      <input id="siteName" placeholder="Nome sito">
      <input id="siteLink" placeholder="https://...">
      <button onclick="addLink()">Aggiungi Link</button>
      <div id="linkList"></div>
    </div>

  </div>
</div>

<script>
/* PASSWORD */
const PASSWORD = "amore123";

/* LOGIN */
function login(){
  const p=document.getElementById('password').value;
  if(p===PASSWORD){
    document.getElementById('loginBox').classList.add('hidden');
    document.getElementById('content').classList.remove('hidden');
    renderAll();
  }else{
    document.getElementById('error').innerText="Password errata ❌";
  }
}

/* UTIL STORAGE */
function save(key,data){localStorage.setItem(key,JSON.stringify(data));}
function load(key){return JSON.parse(localStorage.getItem(key) || "[]");}

/* FOTO */
function addPhoto(){
  const link=document.getElementById('photoLink').value;
  if(!link) return;
  const arr=load('photos');
  arr.push(link);
  save('photos',arr);
  document.getElementById('photoLink').value='';
  renderPhotos();
}
function renderPhotos(){
  const box=document.getElementById('photoList');
  box.innerHTML='';
  load('photos').forEach(l=>{
    box.innerHTML+=`<img src="${l}">`;
  });
}

/* VIDEO */
function addVideo(){
  const link=document.getElementById('videoLink').value;
  if(!link) return;
  const arr=load('videos');
  arr.push(link);
  save('videos',arr);
  document.getElementById('videoLink').value='';
  renderVideos();
}
function renderVideos(){
  const box=document.getElementById('videoList');
  box.innerHTML='';
  load('videos').forEach(l=>{
    if(l.includes('youtube.com')||l.includes('youtu.be')){
      let id=l.split('v=')[1]||l.split('/').pop();
      id=id.split('&')[0];
      box.innerHTML+=`<iframe height="315" src="https://www.youtube.com/embed/${id}" allowfullscreen></iframe>`;
    }else{
      box.innerHTML+=`<video src="${l}" controls></video>`;
    }
  });
}

/* LETTERE */
function addLetter(){
  const txt=document.getElementById('letterText').value;
  if(!txt) return;
  const arr=load('letters');
  arr.push(txt);
  save('letters',arr);
  document.getElementById('letterText').value='';
  renderLetters();
}
function renderLetters(){
  const box=document.getElementById('letterList');
  box.innerHTML='';
  load('letters').forEach(t=>{
    box.innerHTML+=`<div class="card">${t}</div>`;
  });
}

/* CHAT */
let chatMemory=[];
const BOT=[
  "Sono qui con te 🤍",
  "Respira… va tutto bene 🌙",
  "Non sei sola",
  "Ti penso"
];

function sendMsg(){
  const txt=document.getElementById('chatInput').value.trim();
  if(!txt) return;
  chatMemory.push({text:txt});
  document.getElementById('chatInput').value='';
  renderChat();

  setTimeout(()=>{
    const r=BOT[Math.floor(Math.random()*BOT.length)];
    chatMemory.push({text:r});
    renderChat();
  },1000);

  setTimeout(()=>{
    chatMemory.shift();
    renderChat();
  },60000);
}

function renderChat(){
  const box=document.getElementById('chatBox');
  box.innerHTML='';
  chatMemory.forEach(m=>{
    box.innerHTML+=`<div class="card">${m.text}</div>`;
  });
}

/* LINK */
function addLink(){
  const name=document.getElementById('siteName').value;
  const link=document.getElementById('siteLink').value;
  if(!name||!link) return;
  const arr=load('links');
  arr.push({name,link});
  save('links',arr);
  document.getElementById('siteName').value='';
  document.getElementById('siteLink').value='';
  renderLinks();
}
function renderLinks(){
  const box=document.getElementById('linkList');
  box.innerHTML='';
  load('links').forEach(l=>{
    box.innerHTML+=`<div class="card"><a href="${l.link}" target="_blank">${l.name}</a></div>`;
  });
}

/* RENDER ALL */
function renderAll(){
  renderPhotos();
  renderVideos();
  renderLetters();
  renderLinks();
}

</script>

</body>
</html>
