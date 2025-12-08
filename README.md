<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Sito Migliora la Giornata</title>
<style>
body { margin:0; font-family: sans-serif; background:#071226; color:white; }
.overlay { position:fixed; inset:0; background:rgba(0,0,0,0.8); display:flex; justify-content:center; align-items:center; z-index:999; }
.pw-box { background:#0b1220; padding:20px; border-radius:10px; width:300px; }
input { width:100%; padding:8px; margin-top:8px; border-radius:5px; border:none; background:#111827; color:white; }
button { padding:8px 12px; margin-top:8px; border:none; border-radius:5px; cursor:pointer; background:#ffd166; color:black; }
#app { display:none; padding:20px; }
.chat-window { height:200px; overflow:auto; border:1px solid #444; padding:10px; margin-bottom:8px; background:#0b1220; }
.msg.me { background:#111827; padding:6px; border-radius:5px; margin:4px 0; text-align:right; }
.msg.bot { background:#132f2f; padding:6px; border-radius:5px; margin:4px 0; text-align:left; }
.controls { display:flex; gap:4px; }
.controls input { flex:1; }
</style>
</head>
<body>

<div id="pwOverlay" class="overlay">
  <div class="pw-box">
    <h2>Inserisci password</h2>
    <input id="pwInput" type="password" placeholder="Password">
    <button id="pwTry">Entra</button>
  </div>
</div>

<div id="app">
  <h1>Sito che migliora la giornata</h1>

  <div class="chat-window" id="chat"></div>
  <div class="controls">
    <input id="chatInput" type="text" placeholder="Scrivi qualcosa...">
    <button id="sendBtn">Invia</button>
  </div>
</div>

<script>
const SITE_PASSWORD = 'felice2025';
const overlay = document.getElementById('pwOverlay');
const app = document.getElementById('app');
const pwInput = document.getElementById('pwInput');

document.getElementById('pwTry').addEventListener('click', tryPassword);
pwInput.addEventListener('keyup', e=>{ if(e.key==='Enter') tryPassword(); });

function tryPassword() {
  const p = pwInput.value.trim();
  if(p===SITE_PASSWORD) {
    overlay.style.display='none';
    app.style.display='block';
  } else {
    alert('Password errata');
  }
}

// CHAT
const chatEl = document.getElementById('chat');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const BOT_MESSAGES = [
  "Respira profondamente — c'è ancora una piccola luce.",
  "Hai superato giorni peggiori: oggi sei più forte di ieri.",
  "Un piccolo gesto può cambiare la giornata: prova a fare qualcosa che ami."
];

sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keyup', e=>{ if(e.key==='Enter') sendMessage(); });

function sendMessage(){
  const text = chatInput.value.trim();
  if(!text) return;
  addMsg('me',text);
  chatInput.value='';
  setTimeout(()=>{
    const r = BOT_MESSAGES[Math.floor(Math.random()*BOT_MESSAGES.length)];
    addMsg('bot',r);
  }, 500);
}

function addMsg(who,text){
  const div = document.createElement('div');
  div.className='msg '+who;
  div.textContent=text;
  chatEl.appendChild(div);
  chatEl.scrollTop = chatEl.scrollHeight;
}
</script>

</body>
</html>
