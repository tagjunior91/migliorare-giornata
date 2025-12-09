<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Sito Migliora la Giornata</title>

<style>
body {
  margin:0;
  font-family: system-ui, sans-serif;
  background: linear-gradient(180deg,#071226,#041627);
  color:white;
}
.overlay {
  position:fixed;
  inset:0;
  background:rgba(0,0,0,0.85);
  display:flex;
  justify-content:center;
  align-items:center;
  z-index:999;
}
.pw-box {
  background:#0b1220;
  padding:20px;
  border-radius:12px;
  width:300px;
}
input, textarea {
  width:100%;
  padding:10px;
  border-radius:8px;
  border:none;
  background:#111827;
  color:white;
  margin-top:10px;
}
button {
  padding:10px 14px;
  margin-top:10px;
  border:none;
  border-radius:8px;
  cursor:pointer;
  background:#ffd166;
  color:black;
  font-weight:600;
}
#app {
  display:none;
  max-width:900px;
  margin:auto;
  padding:20px;
}
.card {
  background:rgba(255,255,255,0.03);
  padding:15px;
  border-radius:12px;
  margin-bottom:18px;
}
.chat-window {
  height:220px;
  overflow:auto;
  background:#0b1220;
  padding:10px;
  border-radius:8px;
}
.msg {
  padding:6px 10px;
  border-radius:8px;
  margin-bottom:6px;
  max-width:80%;
}
.msg.me {
  background:#111827;
  margin-left:auto;
  text-align:right;
}
.msg.bot {
  background:#132f2f;
}
.controls {
  display:flex;
  gap:6px;
  margin-top:8px;
}
.docs-list img,
.docs-list video {
  max-width:100%;
  border-radius:8px;
  margin-top:6px;
}
footer {
  text-align:center;
  color:#9ca3af;
  font-size:12px;
  margin-top:20px;
}
</style>
</head>

<body>

<!-- BLOCCO PASSWORD -->
<div id="pwOverlay" class="overlay">
  <div class="pw-box">
    <h2>Inserisci password</h2>
    <input id="pwInput" type="password" placeholder="Password">
    <button id="pwTry">Entra</button>
  </div>
</div>

<!-- APP -->
<div id="app">

  <h1>Sito che migliora la giornata</h1>

  <!-- CHAT -->
  <div class="card">
    <h3>Mini chat di incoraggiamento</h3>
    <div id="chat" class="chat-window"></div>

    <div class="controls">
      <input id="chatInput" type="text" placeholder="Scrivi qualcosa...">
      <button id="sendBtn">Invia</button>
    </div>

    <button id="cheerBtn">Ricevi una dose di positività</button>
  </div>

  <!-- NOTE -->
  <div class="card">
    <h3>Note condivise</h3>
    <textarea id="sharedNotes" placeholder="Scrivi qui..."></textarea>
    <button id="saveNotes">Salva note</button>
  </div>

  <!-- DOCUMENTI -->
  <div class="card">
    <h3>Foto e Video</h3>
    <input id="fileInput" type="file" accept="image/*,video/*">
    <button id="addTextDoc">Aggiungi lettera</button>
    <div id="docs" class="docs-list"></div>
  </div>

  <!-- LINK -->
  <div class="card">
    <h3>Link utili</h3>
    <a id="thunkLink" target="_blank">Apri App Thunkable</a><br>
    <a id="githubLink" target="_blank">Apri sito GitHub</a>
  </div>

  <footer>
    Creato per migliorare la giornata ✨
  </footer>

</div>

<script>
/* PASSWORD */
const SITE_PASSWORD = 'felice2025';

const overlay = document.getElementById('pwOverlay');
const app = document.getElementById('app');
const pwInput = document.getElementById('pwInput');

document.getElementById('pwTry').addEventListener('click', tryPassword);
pwInput.addEventListener('keyup', e => { if(e.key==='Enter') tryPassword(); });

function tryPassword(){
  if(pwInput.value.trim() === SITE_PASSWORD){
    overlay.style.display='none';
    app.style.display='block';
    loadAll();
  } else {
    alert('Password errata ❌');
  }
}

/* CHAT */
const chatEl = document.getElementById('chat');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');

const BOT_MESSAGES = [
  "Respira profondamente — c'è una luce anche oggi.",
  "Sei più forte di quanto pensi.",
  "Giorni difficili creano persone forti.",
  "Sorridi, anche piano piano 🤍"
];

sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keyup', e=>{ if(e.key==='Enter') sendMessage(); });
document.getElementById('cheerBtn').addEventListener('click', ()=>{
  const r = BOT_MESSAGES[Math.floor(Math.random()*BOT_MESSAGES.length)];
  addMsg('bot', r);
});

function sendMessage(){
  const text = chatInput.value.trim();
  if(!text) return;
  addMsg('me', text);
  chatInput.value='';
  setTimeout(()=>{
    const r = BOT_MESSAGES[Math.floor(Math.random()*BOT_MESSAGES.length)];
    addMsg('bot', r);
  }, 500);
}

function addMsg(who,text){
  const div = document.createElement('div');
  div.className = 'msg ' + who;
  div.textContent = text;
  chatEl.appendChild(div);
  chatEl.scrollTop = chatEl.scrollHeight;
}

/* NOTE */
const notesEl = document.getElementById('sharedNotes');
document.getElementById('saveNotes').addEventListener('click', ()=>{
  localStorage.setItem('mg_notes', notesEl.value);
  alert('Note salvate ✅');
});

/* DOCUMENTI (foto + video + lettere) */
const docsEl = document.getElementById('docs');
const fileInput = document.getElementById('fileInput');
document.getElementById('addTextDoc').addEventListener('click', ()=>{
  const text = prompt('Scrivi la lettera:');
  if(!text) return;
  addDoc({type:'letter', name:'lettera_'+Date.now(), text});
});

fileInput.addEventListener('change', handleFile);

function handleFile(e){
  const f = e.target.files[0];
  if(!f) return;

  const reader = new FileReader();

  if(f.type.startsWith('image/')){
    reader.onload = ()=> addDoc({type:'image', name:f.name, data:reader.result});
    reader.readAsDataURL(f);
  }
  else if(f.type.startsWith('video/')){
    reader.onload = ()=> addDoc({type:'video', name:f.name, data:reader.result});
    reader.readAsDataURL(f);
  }

  fileInput.value = '';
}

function addDoc(doc){
  const arr = JSON.parse(localStorage.getItem('mg_docs') || '[]');
  arr.push(doc);
  localStorage.setItem('mg_docs', JSON.stringify(arr));
  renderDocs();
}

function renderDocs(){
  const arr = JSON.parse(localStorage.getItem('mg_docs') || '[]');
  docsEl.innerHTML = '';
  arr.forEach(d=>{
    const wrap = document.createElement('div');

    const meta = document.createElement('div');
    meta.textContent = d.name + ' • ' + d.type;
    wrap.appendChild(meta);

    if(d.type==='image'){
      const img = document.createElement('img');
      img.src = d.data;
      wrap.appendChild(img);
    }
    else if(d.type==='video'){
      const video = document.createElement('video');
      video.src = d.data;
      video.controls = true;
      wrap.appendChild(video);
    }
    else {
      const p = document.createElement('pre');
      p.textContent = d.text;
      wrap.appendChild(p);
    }

    docsEl.appendChild(wrap);
  });
}

/* LINK */
document.getElementById('thunkLink').href = 'https://x.thunkable.com/copy/IL_TUO_LINK_APP';
document.getElementById('githubLink').href = 'https://yourusername.github.io/tuo-repo/';

/* LOAD */
function loadAll(){
  notesEl.value = localStorage.getItem('mg_notes') || '';
  renderDocs();
}
</script>

</body>
</html>