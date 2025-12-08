<!doctype html>
<html lang="it">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Sito "Migliora la giornata"</title>
  <style>
    :root{--bg:#0f1724;--card:#0b1220;--accent:#ffd166;--muted:#9ca3af;color-scheme:dark}
    *{box-sizing:border-box}
    body{margin:0;font-family:Inter,system-ui,Segoe UI,Roboto,Helvetica,Arial;color:white;background:linear-gradient(180deg,#071226 0%,#041627 100%);min-height:100vh}
    .container{max-width:980px;margin:32px auto;padding:20px}
    .card{background:rgba(255,255,255,0.03);border-radius:12px;padding:18px;margin-bottom:18px;box-shadow:0 6px 18px rgba(0,0,0,0.5)}
    header{display:flex;gap:12px;align-items:center}
    header h1{margin:0;font-size:20px}
    .muted{color:var(--muted);font-size:13px}
    .links a{color:var(--accent);text-decoration:none}
    /* chat */
    .chat-window{height:300px;overflow:auto;padding:12px;background:linear-gradient(180deg,rgba(255,255,255,0.02),transparent);border-radius:8px}
    .msg{padding:8px 10px;border-radius:10px;margin-bottom:8px;max-width:78%}
    .msg.me{background:linear-gradient(90deg,#1f2937,#111827);margin-left:auto}
    .msg.bot{background:linear-gradient(90deg,#132f2f,#0b3a3a)}
    .controls{display:flex;gap:8px;margin-top:8px}
    .controls input[type=text]{flex:1;padding:10px;border-radius:8px;border:1px solid rgba(255,255,255,0.06);background:transparent;color:white}
    button{background:var(--accent);border:none;padding:10px 12px;border-radius:8px;cursor:pointer}
    .notes{display:flex;gap:12px;flex-wrap:wrap}
    .notes textarea{flex:1;min-height:120px;padding:10px;border-radius:8px;border:1px solid rgba(255,255,255,0.04);background:transparent;color:white}
    .grid{display:grid;grid-template-columns:1fr 320px;gap:12px}
    @media(max-width:880px){.grid{grid-template-columns:1fr} .container{margin:12px}}
    .docs-list img{max-width:100%;border-radius:8px}
    .small{font-size:13px;color:var(--muted)}
    footer{display:flex;justify-content:space-between;align-items:center;gap:12px}
    .topbar{display:flex;justify-content:space-between;align-items:center}
    .pill{background:rgba(255,255,255,0.03);padding:6px 10px;border-radius:999px;font-size:13px}
    /* password modal */
    .overlay{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:linear-gradient(180deg,rgba(2,6,23,0.6),rgba(2,6,23,0.85));backdrop-filter:blur(4px);z-index:999}
    .pw-box{background:var(--card);padding:22px;border-radius:12px;max-width:420px;width:92%}
    .pw-box input{width:100%;padding:10px;border-radius:8px;border:1px solid rgba(255,255,255,0.06);background:transparent;color:white}
    .hint{font-size:13px;color:var(--muted);margin-top:8px}
    .actions{display:flex;gap:8px;justify-content:flex-end;margin-top:12px}
    .danger{background:#ef4444}
    .meta{font-size:12px;color:var(--muted)}
  </style>
</head>
<body>
  <div id="pwOverlay" class="overlay">
    <div class="pw-box card">
      <h2>Benvenuta — inserisci la password</h2>
      <input id="pwInput" type="password" placeholder="Password" />
      <div class="hint">Questa è una protezione lato client: per la produzione usa autenticazione reale.</div>
      <div class="actions">
        <button id="pwTry">Entra</button>
        <button id="pwReset" class="danger">Reset locale</button>
      </div>
    </div>
  </div>

  <div class="container" id="app" style="display:none">
    <header class="card topbar">
      <div>
        <h1>Sito che migliora la giornata</h1>
        <div class="muted">Piccole cose per tirarti su: chat, note condivise, ricordi cartacei e link utili.</div>
      </div>
      <div style="text-align:right">
        <div class="pill" id="userInfo">Accesso: locale</div>
        <div class="small">Modifica la password nel codice (variabile)</div>
      </div>
    </header>

    <div class="grid">
      <main>
        <section class="card">
          <h3>Mini chat di incoraggiamento</h3>
          <div id="chat" class="chat-window" aria-live="polite"></div>
          <div class="controls">
            <input id="chatInput" type="text" placeholder="Scrivi qualcosa..." />
            <button id="sendBtn">Invia</button>
          </div>
          <div class="small">La chat è locale e le conversazioni restano sul tuo browser (localStorage).</div>
        </section>

        <section class="card">
          <h3>Note condivise</h3>
          <div class="notes">
            <textarea id="sharedNotes" placeholder="Appunti condivisi... (puoi copiare il link per condividerli)"></textarea>
          </div>
          <div style="display:flex;gap:8px;margin-top:8px">
            <button id="saveNotes">Salva</button>
            <button id="copyLink">Copia link condivisibile</button>
            <button id="exportNotes">Esporta (JSON)</button>
          </div>
          <div class="small">Chi riceve il link vedrà il contenuto incollato nell'area note. Il link contiene i dati codificati nell'URL.</div>
        </section>

        <section class="card">
          <h3>Cartacei consegnati (foto & lettere)</h3>
          <div style="display:flex;gap:8px;margin-bottom:8px">
            <input id="fileInput" type="file" accept="image/*" />
            <button id="addTextDoc">Aggiungi lettera</button>
            <button id="exportDocs">Esporta documenti (JSON)</button>
          </div>
          <div id="docs" class="docs-list"></div>
          <div class="small">I file sono salvati nel browser come DataURL. Se vuoi conservarli permanentemente, scarica l'esportazione e archiviali offline o su cloud.</div>
        </section>
      </main>

      <aside>
        <section class="card">
          <h3>Link utili</h3>
          <div class="links">
            <div><strong>App Thunkable:</strong> <a id="thunkLink" href="#" target="_blank">Apri app Thunkable</a></div>
            <div><strong>Sito su GitHub:</strong> <a id="githubLink" href="#" target="_blank">Apri sito GitHub</a></div>
          </div>
          <div style="margin-top:12px">
            <h4>Backup & Ripristino</h4>
            <button id="backupBtn">Scarica backup</button>
            <input id="restoreFile" type="file" accept="application/json" />
          </div>
        </section>

        <section class="card">
          <h3>Piccole magie</h3>
          <p class="muted">Premi "Invia" nella chat per ricevere risposte automatiche di stimolo e citazioni. Puoi personalizzare i messaggi nel codice (array 'BOT_MESSAGES').</p>
          <div style="margin-top:8px">
            <button id="cheerBtn">Ricevi una dose di positività</button>
            <div id="cheerArea" class="small"></div>
          </div>
        </section>
      </aside>
    </div>

    <footer class="card">
      <div class="meta">Creato per tirare su la giornata — versione locale</div>
      <div><button id="logout">Esci</button></div>
    </footer>
  </div>

  <script>
    /***** CONFIGURAZIONE (personalizza qui) *****/
    const SITE_PASSWORD = localStorage.getItem('mg_password') || '26071989'; // cambiala prima di pubblicare
    const THUNKABLE_URL = 'https://x.thunkable.com/copy/IL_TUO_LINK_APP';
    const GITHUB_URL = 'https://tagjunior91.github.io/Sorpresa/';
    const BOT_MESSAGES = [
    
    ];
    /*********************************************/

    // inizializzazione link
    document.getElementById('thunkLink').href = THUNKABLE_URL;
    document.getElementById('githubLink').href = GITHUB_URL;

    // password modal
    const overlay = document.getElementById('pwOverlay');
    const app = document.getElementById('app');
    const pwInput = document.getElementById('pwInput');
    document.getElementById('pwTry').addEventListener('click', tryPassword);
    pwInput.addEventListener('keyup', (e)=>{ if(e.key==='Enter') tryPassword(); });
    document.getElementById('pwReset').addEventListener('click', ()=>{ if(confirm('Reset locale (cancella tutte le note e documenti)?')){ localStorage.clear(); alert('Locale resettato. Ricarica la pagina.'); }});

    function tryPassword(){
      const p = pwInput.value;
      if(!p) return alert('Inserisci la password');
      if(p === SITE_PASSWORD){
        overlay.style.display = 'none'; app.style.display = 'block';
        loadAll();
      } else {
        alert('Password errata.');
      }
    }

    // logout
    document.getElementById('logout').addEventListener('click', ()=>{ overlay.style.display='flex'; app.style.display='none'; pwInput.value=''; });

    /* CHAT */
    const chatEl = document.getElementById('chat');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keyup', (e)=>{ if(e.key==='Enter') sendMessage(); });

    function sendMessage(){
      const text = chatInput.value.trim();
      if(!text) return;
      pushChat({who:'me',text,ts:Date.now()});
      chatInput.value='';
      // risposta automatica
      setTimeout(()=>{
        const r = BOT_MESSAGES[Math.floor(Math.random()*BOT_MESSAGES.length)];
        pushChat({who:'bot',text:r,ts:Date.now()});
      }, 800 + Math.random()*800);
    }

    function pushChat(msg){
      const arr = JSON.parse(localStorage.getItem('mg_chat')||'[]');
      arr.push(msg); localStorage.setItem('mg_chat',JSON.stringify(arr));
      renderChat();
    }

    function renderChat(){
      const arr = JSON.parse(localStorage.getItem('mg_chat')||'[]');
      chatEl.innerHTML='';
      arr.forEach(m=>{
        const d = document.createElement('div'); d.className='msg '+(m.who==='me'?'me':'bot'); d.textContent=m.text; chatEl.appendChild(d);
      });
      chatEl.scrollTop = chatEl.scrollHeight;
    }

    /* NOTE CONDIVISE */
    const notesEl = document.getElementById('sharedNotes');
    document.getElementById('saveNotes').addEventListener('click', ()=>{ localStorage.setItem('mg_notes', notesEl.value); alert('Note salvate localmente'); });
    document.getElementById('copyLink').addEventListener('click', ()=>{
      const text = notesEl.value || '';
      const encoded = btoa(unescape(encodeURIComponent(text)));
      const url = location.origin + location.pathname + '?shared=' + encoded;
      navigator.clipboard.writeText(url).then(()=>alert('Link copiato negli appunti'));
    });
    document.getElementById('exportNotes').addEventListener('click', ()=>{ const data = {notes: notesEl.value}; downloadJSON(data,'notes.json'); });

    // carica note da localStorage o da URL
    function loadNotesFromURL(){
      const params = new URLSearchParams(location.search);
      if(params.has('shared')){
        try{ const decoded = decodeURIComponent(escape(atob(params.get('shared')))); notesEl.value = decoded; }
        catch(e){ console.warn('Impossibile decodificare shared'); }
      }
    }

    /* DOCUMENTI CARTACEI */
    const docsEl = document.getElementById('docs');
    const fileInput = document.getElementById('fileInput');
    const addTextDocBtn = document.getElementById('addTextDoc');
    fileInput.addEventListener('change', handleFile);
    addTextDocBtn.addEventListener('click', ()=>{
      const t = prompt('Incolla il testo della lettera:'); if(!t) return;
      addDoc({type:'letter',name:'lettera-'+Date.now(),text:t});
    });

    function handleFile(e){
      const f = e.target.files[0]; if(!f) return;
      const reader = new FileReader();
      reader.onload = ()=>{ addDoc({type:'image',name:f.name,data:reader.result}); fileInput.value=''; };
      reader.readAsDataURL(f);
    }

    function addDoc(doc){
      const arr = JSON.parse(localStorage.getItem('mg_docs')||'[]'); arr.push(doc); localStorage.setItem('mg_docs',JSON.stringify(arr)); renderDocs(); }

    function renderDocs(){
      const arr = JSON.parse(localStorage.getItem('mg_docs')||'[]'); docsEl.innerHTML='';
      if(arr.length===0){ docsEl.innerHTML='<div class="small">Nessun documento aggiunto</div>'; return; }
      arr.forEach((d,i)=>{
        const wrapper = document.createElement('div'); wrapper.style.marginBottom='12px';
        const meta = document.createElement('div'); meta.className='small'; meta.textContent = d.name + ' • ' + d.type;
        wrapper.appendChild(meta);
        if(d.type==='image'){
          const img = document.createElement('img'); img.src = d.data; wrapper.appendChild(img);
        } else {
          const p = document.createElement('pre'); p.style.whiteSpace='pre-wrap'; p.textContent = d.text; wrapper.appendChild(p);
        }
        const btns = document.createElement('div'); btns.style.display='flex'; btns.style.gap='8px'; btns.style.marginTop='6px';
        const dl = document.createElement('button'); dl.textContent='Scarica'; dl.addEventListener('click', ()=>{ if(d.type==='image') downloadDataURL(d.data,d.name); else downloadText(d.text,d.name+'.txt'); });
        const del = document.createElement('button'); del.textContent='Elimina'; del.addEventListener('click', ()=>{ if(confirm('Eliminare?')){ removeDoc(i); }});
        btns.appendChild(dl); btns.appendChild(del); wrapper.appendChild(btns);
        docsEl.appendChild(wrapper);
      });
    }

    function removeDoc(index){ const arr = JSON.parse(localStorage.getItem('mg_docs')||'[]'); arr.splice(index,1); localStorage.setItem('mg_docs',JSON.stringify(arr)); renderDocs(); }

    /* BACKUP / EXPORT */
    function downloadJSON(obj, filename){ const blob = new Blob([JSON.stringify(obj, null, 2)], {type:'application/json'}); const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=filename; a.click(); URL.revokeObjectURL(url); }
    function downloadDataURL(dataURL, filename){ const a=document.createElement('a'); a.href=dataURL; a.download=filename; a.click(); }
    function downloadText(txt, filename){ const blob = new Blob([txt],{type:'text/plain'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=filename; a.click(); URL.revokeObjectURL(url); }

    document.getElementById('backupBtn').addEventListener('click', ()=>{ const data = {notes: localStorage.getItem('mg_notes')||'', chat: JSON.parse(localStorage.getItem('mg_chat')||'[]'), docs: JSON.parse(localStorage.getItem('mg_docs')||'[]')}; downloadJSON(data,'migliora_backup.json'); });
    document.getElementById('restoreFile').addEventListener('change',(e)=>{ const f=e.target.files[0]; if(!f) return; const r=new FileReader(); r.onload=()=>{ try{ const obj=JSON.parse(r.result); if(obj.notes) localStorage.setItem('mg_notes', obj.notes); if(obj.chat) localStorage.setItem('mg_chat', JSON.stringify(obj.chat)); if(obj.docs) localStorage.setItem('mg_docs', JSON.stringify(obj.docs)); alert('Ripristino completato. Ricarica la pagina.'); } catch(err){ alert('File non valido'); } }; r.readAsText(f); });
    document.getElementById('exportDocs').addEventListener('click', ()=>{ const docs = JSON.parse(localStorage.getItem('mg_docs')||'[]'); downloadJSON(docs,'docs.json'); });

    // restore backup download

    /* CHEER BUTTON */
    document.getElementById('cheerBtn').addEventListener('click', ()=>{ const r = BOT_MESSAGES[Math.floor(Math.random()*BOT_MESSAGES.length)]; document.getElementById('cheerArea').textContent = r; pushChat({who:'bot',text:r,ts:Date.now()}); });

    /* UTIL */
    function loadAll(){
      renderChat();
      notesEl.value = localStorage.getItem('mg_notes') || '';
      renderDocs();
      loadNotesFromURL();
      document.getElementById('userInfo').textContent = 'Accesso: locale • password: ' + (SITE_PASSWORD ? 'impostata' : 'non impostata');
    }

    // restore password from prompt? allow setting
    // scelta: se vuoi cambiare password, apri console e esegui localStorage.setItem('mg_password','nuova'); oppure implementare UI

    // helper per copia
    window.copyText = (t)=>navigator.clipboard.writeText(t);

    // utility per import
  </script>
</body>
</html>
