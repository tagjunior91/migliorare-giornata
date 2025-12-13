<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Sito che migliora la giornata</title>

<style>
body{
  margin:0;
  font-family:sans-serif;
  background:linear-gradient(180deg,#071226,#041627);
  color:white;
}
.overlay{
  position:fixed;
  inset:0;
  background:rgba(0,0,0,0.85);
  display:flex;
  align-items:center;
  justify-content:center;
  z-index:999;
}
.pw-box{
  background:#0b1220;
  padding:22px;
  border-radius:12px;
  width:300px;
}
input,textarea{
  width:100%;
  padding:10px;
  margin-top:8px;
  border:none;
  border-radius:6px;
  background:#111827;
  color:white;
}
button{
  padding:10px 14px;
  margin-top:10px;
  background:#ffd166;
  color:black;
  border:none;
  border-radius:6px;
  cursor:pointer;
}
#app{
  display:none;
  max-width:900px;
  margin:auto;
  padding:20px;
}
.card{
  background:rgba(255,255,255,0.04);
  padding:16px;
  border-radius:16px;
  margin-bottom:18px;
}
.chat-window{
  height:220px;
  overflow:auto;
  border:1px solid #444;
  border-radius:10px;
  padding:10px;
  margin-bottom:8px;
  background:#0b1220;
}
.msg.me{
  background:#111827;
  padding:8px;
  border-radius:8px;
  margin:6px 0;
  text-align:right;
}
.msg.bot{
  background:#133030;
  padding:8px;
  border-radius:8px;
  margin:6px 0;
  text-align:left;
}
.controls{
  display:flex;
  gap:6px;
}
.controls input{ flex:1 }
.link-btn{
  display:inline-block;
  background:#111827;
  padding:12px 16px;
  margin:6px 0;
  border-radius:10px;
  color:white;
  text-decoration:none;
}
footer{
  font-size:12px;
  color:#9ca3af;
  margin-top:20px;
  text-align:center;
}
</style>
</head>

<body>

<!-- PASSWORD -->
<div id="pwOverlay" class="overlay">
  <div class="pw-box">
    <h2>Area Riservata ❤️</h2>
    <input id="pwInput" type="password" placeholder="Inserisci password">
    <button id="pwTry">Entra</button>
  </div>
</div>

<!-- APP -->
<div id="app">

<h1>Sito che migliora la giornata</h1>

<!-- SPOTIFY PRIVATO -->
<div class="card">
  <h3>🎧 Playlist Spotify</h3>
  <a href="https://open.spotify.com/embed/playlist/3QnJM3537623iJIjKazwwS?si=8hMXGWbwTpGceuNT2J-vhA&pi=" target="_blank"
     style="display:inline-block;padding:14px 20px;border-radius:12px;
            background:#1DB954;color:white;font-weight:bold;
            text-decoration:none;">
    ▶️ Ascolta su Spotify
  </a>
</div>

<!-- CHAT -->
<div class="card">
  <h3>Mini chat di incoraggiamento</h3>
  <div id="chat" class="chat-window"></div>
  <div class="controls">
    <input id="chatInput" type="text" placeholder="Scrivi qui...">
    <button id="sendBtn">Invia</button>
  </div>
  <button id="cheerBtn">Ricevi un messaggio positivo</button>
</div>

<!-- NOTE -->
<div class="card">
  <h3>Note condivise</h3>
  <textarea id="sharedNotes" rows="6" placeholder="Scrivi qui..."></textarea>
  <button id="saveNotes">Salva note</button>
</div>

<!-- GOOGLE DRIVE -->
<div class="card">
  <h3>📸 Foto & Lettere (Google Drive)</h3>
  <a id="fotoLink" class="link-btn" target="_blank">Apri Foto</a><br>
  <a id="lettereLink" class="link-btn" target="_blank">Apri Lettere</a>
</div>

<!-- ALTRI LINK -->
<div class="card">
  <h3>Link esterni</h3>
  <a id="thunkLink" class="link-btn" target="_blank">La tua APP</a><br>
  <a id="githubLink" class="link-btn" target="_blank">Sorpresa</a>
</div>

<footer>
  Creato per migliorare la giornata 🌙
</footer>

</div>

<script>
// PASSWORD
const SITE_PASSWORD = "felice2025";
const overlay = document.getElementById("pwOverlay");
const app = document.getElementById("app");
const pwInput = document.getElementById("pwInput");

document.getElementById("pwTry").addEventListener("click", tryPassword);
pwInput.addEventListener("keyup", e => { if(e.key==="Enter") tryPassword(); });

function tryPassword(){
  if(pwInput.value.trim() === SITE_PASSWORD){
    overlay.style.display = "none";
    app.style.display = "block";
    loadAll();
  } else {
    alert("Password errata");
  }
}

// CHAT
const chatEl = document.getElementById("chat");
const chatInput = document.getElementById("chatInput");

const BOT_MESSAGES = [
  "Respira. Sei più forte di quanto pensi.",
  "Un passo alla volta. Ce la farai.",
  "Va bene anche fermarsi un momento.",
  "Non devi risolvere tutto oggi.",
  "Quello che senti ha senso.",
  "Sei più resiliente di quanto immagini.",
  "Anche questo passerà.",
  "Non sei solo.",
  "Concediti gentilezza.",
  "Stai facendo del tuo meglio.",
  "Sei abbastanza così come sei.",
  "Ricorda quante volte ce l’hai già fatta.",
  "Meriti serenità.",
  "Una cosa alla volta.",
  "Respira ancora.",
  "Il tuo valore non dipende da oggi.",
  "Domani è un nuovo inizio.",
  "Piccoli passi contano.",
  "Non sei in ritardo.",
  "Anche il silenzio cura."
];

let botPool = [];

function getRandomBotMessage(){
  if(botPool.length === 0){
    botPool = [...BOT_MESSAGES];
  }
  const i = Math.floor(Math.random() * botPool.length);
  return botPool.splice(i,1)[0];
}

document.getElementById("sendBtn").addEventListener("click", sendMessage);
chatInput.addEventListener("keyup", e => { if(e.key==="Enter") sendMessage(); });

document.getElementById("cheerBtn").addEventListener("click", ()=>{
  addMsg("bot", getRandomBotMessage());
});

function sendMessage(){
  const text = chatInput.value.trim();
  if(!text) return;
  addMsg("me", text);
  chatInput.value="";
  setTimeout(()=>{
    addMsg("bot", getRandomBotMessage());
  },600);
}

function addMsg(who, text){
  const div = document.createElement("div");
  div.className = "msg " + who;
  div.textContent = text;
  chatEl.appendChild(div);
  chatEl.scrollTop = chatEl.scrollHeight;
}

// NOTE
const notesEl = document.getElementById("sharedNotes");
document.getElementById("saveNotes").addEventListener("click", ()=>{
  localStorage.setItem("mg_notes", notesEl.value);
  alert("Note salvate");
});

// LINK
document.getElementById("fotoLink").href =
  "https://drive.google.com/drive/folders/11IZbIpJGcTMsjpHyZg9FOJdC48BVHKd-?usp=drive_link";

document.getElementById("lettereLink").href =
  "https://drive.google.com/drive/folders/1ZxZPDbCzWZsZFGBij3gNMklj_JG21jsU?usp=drive_link";

document.getElementById("thunkLink").href =
  "https://x.thunkable.com/projects/63e95a440d81be1e64c70fc8/preview/6c7f23d1-783a-43f7-b02f-ce20de85a754";

document.getElementById("githubLink").href =
  "https://tagjunior91.github.io/Sorpresa/";

// LOAD
function loadAll(){
  notesEl.value = localStorage.getItem("mg_notes") || "";
}
</script>

</body>
</html>
