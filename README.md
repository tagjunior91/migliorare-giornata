<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Sito Migliora la Giornata</title>
<style>
body { margin:0; font-family:sans-serif; background:linear-gradient(180deg,#071226,#041627); color:white; }
.overlay { position:fixed; inset:0; background:rgba(0,0,0,0.8); display:flex; justify-content:center; align-items:center; z-index:999; }
.pw-box { background:#0b1220; padding:20px; border-radius:10px; width:300px; }
input, textarea { width:100%; padding:8px; margin-top:8px; border-radius:5px; border:none; background:#111827; color:white; }
button { padding:8px 12px; margin-top:8px; border:none; border-radius:5px; cursor:pointer; background:#ffd166; color:black; }
#app { display:none; padding:20px; max-width:900px; margin:auto; }
h1,h2,h3,h4 { margin:0 0 8px 0; }
.card { background:rgba(255,255,255,0.03); padding:12px; border-radius:10px; margin-bottom:16px; }
.chat-window { height:200px; overflow:auto; border:1px solid #444; padding:10px; margin-bottom:8px; background:#0b1220; }
.msg.me { background:#111827; padding:6px; border-radius:5px; margin:4px 0; text-align:right; }
.msg.bot { background:#132f2f; padding:6px; border-radius:5px; margin:4px 0; text-align:left; }
.controls { display:flex; gap:4px; margin-bottom:12px; }
.controls input { flex:1; }
.notes { margin-bottom:12px; }
.docs-list img { max-width:100%; border-radius:6px; margin-top:4px; }
footer { margin-top:20px; font-size:12px; color:#9ca3af; }
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

  <!-- CHAT -->
  <div class="card">
    <h3>Mini chat di incoraggiamento</h3>
    <div class="chat-window" id="chat"></div>
    <div class="controls">
      <input id="chatInput" type="text" placeholder="Scrivi qualcosa...">
      <button id="sendBtn">Invia</button>
    </div>
    <button id="cheerBtn">Ricevi una dose di positività</button>
  </div>

  <!-- NOTE -->
  <div class="card">
    <h3>Note condivise</h3>
    <div class="notes">
      <textarea id="sharedNotes" placeholder="Scrivi qui..."></textarea>
    </div>
    <button id="saveNotes">Salva</button>
  </div>

  <!-- DOCUMENTI -->
  <div class="card">
    <h3>Cartacei consegnati (foto & lettere)</h3>
    <input id="fileInput" type="file" accept="image/*">
    <button id="addTextDoc">Aggiungi lettera</button>
    <div id="docs" class="docs-list"></div>
  </div>

  <!-- LINK -->
  <div class="card">
    <h3>Link utili</h3>
    <div><a id="thunkLink" href="#" target="_blank">App Thunkable</a></div>
    <div><a id="githubLink" href="#" target="_blank">Sito GitHub</a></div>
  </div>

  <footer>
    Creato per tirare su la giornata — versione locale
  </footer>
</div>

<script>
const SITE_PASSWORD = 'felice2025';
const overlay = document.getElementById('pwOverlay');
const app = document.getElementById('app');
const pwInput = document.getElementById('pwInput');

document.getElementById('pwTry').addEventListener('click', tryPassword);
pwInput.addEventListener('keyup', e=>{ if(e.key==='Enter') tryPassword(); });

function tryPassword(){
  if(pwInput.value.trim()===SITE_PASSWORD){
    overlay.style.display='none';
    app.style.display='block';
    loadAll();
  } else alert('Password errata');
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
  div.className='msg '+who;
  div.textContent=text;
  chatEl.appendChild(div);
  chatEl.scrollTop = chatEl.scrollHeight;
}

// NOTE
const notesEl = document.getElementById('sharedNotes');
document.getElementById('saveNotes').addEventListener('click', ()=>{ localStorage.setItem('mg_notes', notesEl.value); alert('Note salvate'); });

// DOCUMENTI
const docsEl = document.getElementById('docs');
const fileInput = document.getElementById('fileInput');
const addTextDocBtn = document.getElementById('addTextDoc');

fileInput.addEventListener('change', e=>{
  const f = e.target.files[0];
  if(!f) return;
  const reader = new FileReader();
  reader.onload = ()=>{ addDoc({type:'image',name:f.name,data:reader.result}); fileInput.value=''; };
  reader.readAsDataURL(f);
});

addTextDocBtn.addEventListener('click', ()=>{
  const t = prompt('Incolla il testo della lettera:'); 
  if(!t) return;
  addDoc({type:'letter',name:'lettera-'+Date.now(),text:t});
});

function addDoc(doc){
  const arr = JSON.parse(localStorage.getItem('mg_docs')||'[]'); arr.push(doc); localStorage.setItem('mg_docs',JSON.stringify(arr)); renderDocs(); 
}

function renderDocs(){
  const arr = JSON.parse(localStorage.getItem('mg_docs')||'[]'); docsEl.innerHTML='';
  arr.forEach((d,i)=>{
    const wrapper = document.createElement('div'); wrapper.style.marginBottom='8px';
    const meta = document.createElement('div'); meta.textContent=d.name+' • '+d.type;
    wrapper.appendChild(meta);
    if(d.type==='image'){
      const img = document.createElement('img'); img.src=d.data; wrapper.appendChild(img);
    } else {
      const p = document.createElement('pre'); p.textContent=d.text; wrapper.appendChild(p);
    }
    docsEl.appendChild(wrapper);
  });
}

// LINK
document.getElementById('thunkLink').href = 'https://x.thunkable.com/copy/IL_TUO_LINK_APP';
document.getElementById('githubLink').href = 'https://yourusername.github.io/tuo-repo/';

// LOAD ALL
function loadAll(){
  notesEl.value = localStorage.getItem('mg_notes')||'';
  renderDocs();
}
</script>

</body>
</html>
