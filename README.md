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
      <h2>Benvenuto — inserisci la password</h2>
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
        <section class="card" id="userChatSection">
          <h3>Mini chat di incoraggiamento</h3>
          <div id="chat" class="chat-window" aria-live="polite"></div>
          <div class="controls">
            <input id="chatInput" type="text" placeholder="(Piccolo genio) Scrivi qualcosa..." />
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
            <div><strong>La tua app:</strong> <a id="thunkLink" href="#" target="_blank">Apri app Thunkable</a></div>
            <div><strong>Sorpresa:</strong> <a id="githubLink" href="#" target="_blank">Apri sito GitHub</a></div>
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
    const SITE_PASSWORD = localStorage.getItem('mg_password') || 'utente2025';
    const ADMIN_PASSWORD = localStorage.getItem('mg_admin_password') || 'admin2025';
    <button id="emergenzaButton" style="position: fixed; bottom: 20px; right: 20px; background-color: red; color: white; padding: 10px 15px; border-radius: 8px; border: none; cursor: pointer; z-index: 1000;">🆘 Emergenza</button>

<script>
const emergenzaButton = document.getElementById('emergenzaButton');
emergenzaButton.addEventListener('click', () => {
    const scelta = prompt('Emergenza! Scegli: 1=Ginseng, 2=Chiama, 3=Crêpes');
    if(scelta === '1') alert('Prendi Ginseng!');
    else if(scelta === '2') alert('Chiama qualcuno!');
    else if(scelta === '3') alert('Ordina una crêpes!');
    else alert('Scelta non valida');
});
</script>
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <title>Sito Migliora la Giornata</title>
  <style>
    body { font-family: Arial, sans-serif; background:#111; color:#fff; padding:20px; }
    .box { background:#222; padding:20px; border-radius:10px; max-width:500px; margin:auto; }
    input, button { padding:10px; margin-top:10px; width:100%; }
    #app { display:none; }
    #emergenzaButton {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: red;
      color: white;
      padding: 12px;
      border-radius: 8px;
      border: none;
    }
  </style>
</head>
<body>

<div class="box" id="loginBox">
  <h2>Inserisci password</h2>
  <input type="password" id="pw" placeholder="Password">
  <button onclick="login()">Entra</button>
</div>

<div id="app">
  <h1>Benvenuto 🌟</h1>
  <p>Sito attivo correttamente</p>
</div>

<button id="emergenzaButton" onclick="emergenza()">🆘 Emergenza</button>

<script>
  const USER_PW = "utente2025";
  const ADMIN_PW = "admin2025";

  function login() {
    const pw = document.getElementById("pw").value;
    if (pw === USER_PW || pw === ADMIN_PW) {
      document.getElementById("loginBox").style.display = "none";
      document.getElementById("app").style.display = "block";
    } else {
      alert("Password sbagliata");
    }
  }

  function emergenza() {
    const scelta = prompt("Emergenza! 1 = Ginseng | 2 = Chiama | 3 = Crêpes");
    if (scelta === "1") alert("Prendi Ginseng!");
    else if (scelta === "2") alert("Chiama qualcuno!");
    else if (scelta === "3") alert("Ordina una crêpes!");
  }
</script>

</body>
</html>
