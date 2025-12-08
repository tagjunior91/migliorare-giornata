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
    .chat-window{height:300px;overflow:auto;padding:12px;background:linear-gradient(180deg,rgba(255,255,255,0.02),transparent);border-radius:8px}
    .msg{padding:8px 10px;border-radius:10px;margin-bottom:8px;max-width:78%}
    .msg.me{background:linear-gradient(90deg,#1f2937,#111827);margin-left:auto}
    .msg.bot{background:linear-gradient(90deg,#132f2f,#0b3a3a)}
    .controls{display:flex;gap:8px;margin-top:8px}
    .controls input[type=text]{flex:1;padding:10px;border-radius:8px;border:1px solid rgba(255,255,255,0.06);background:transparent;color:white}
    button{background:var(--accent);border:none;padding:10px 12px;border-radius:8px;cursor:pointer}
    .notes textarea{width:100%;min-height:120px;padding:10px;border-radius:8px;border:1px solid rgba(255,255,255,0.04);background:transparent;color:white}

    .docs-list{
      background:white;
      color:black;
      padding:10px;
      border-radius:8px;
    }

    .overlay{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.85);z-index:999}
    .pw-box{background:#111;padding:22px;border-radius:12px;width:320px}
    .pw-box input{width:100%;padding:10px;border-radius:8px;border:none;margin-top:10px}
    .actions{display:flex;gap:8px;justify-content:flex-end;margin-top:12px}

    #emergencyBtn{
      position:fixed;
      bottom:20px;
      left:50%;
      transform:translateX(-50%);
      background:red;
      color:white;
      border:none;
      padding:15px 30px;
      border-radius:50px;
      font-size:18px;
      font-weight:bold;
      z-index:999;
    }

    #nataleBtn{
      position:fixed;
      top:20px;
      right:20px;
      background:green;
      color:white;
      border:none;
      padding:10px 16px;
      border-radius:12px;
      font-weight:bold;
      z-index:999;
    }

    body.natale{
      background-image:url('https://images.unsplash.com/photo-1545792220-447b1b4bddd5');
      background-size:cover;
      background-attachment:fixed;
    }
  </style>
</head>

<body>

<!-- Pulsante Natale -->
<button id="nataleBtn">🎄 Natale</button>

<!-- BLOCCO PASSWORD -->
<div id="pwOverlay" class="overlay">
  <div class="pw-box">
    <h2>Inserisci password</h2>
    <input type="password" id="pwInput" placeholder="Password">
    <div class="actions">
      <button onclick="tryPassword()">Entra</button>
    </div>
  </div>
</div>

<div class="container" id="app" style="display:none">

  <header class="card topbar">
    <div>
      <h1>Sito che migliora la giornata</h1>
      <div class="muted">Spazio sicuro</div>
    </div>
  </header>

  <section class="card">
    <h3>Mini chat</h3>
    <div id="chat" class="chat-window"></div>
    <div class="controls">
      <input id="chatInput" type="text" placeholder="Scrivi...">
      <button onclick="sendMessage()">Invia</button>
    </div>
  </section>

  <section class="card">
    <h3>Note condivise</h3>
    <textarea id="sharedNotes"></textarea>
    <button onclick="saveNotes()">Salva note</button>
  </section>

  <section class="card">
    <h3>Cartacei consegnati</h3>
    <input type="file" id="fileInput">
    <button onclick="addLetter()">Aggiungi lettera</button>
    <div id="docs" class="docs-list"></div>
  </section>

  <section class="card">
    <h3>Link utili</h3>
    <div class="links">
      <div><strong>La tua app:</strong> <a id="thunkLink" href="#" target="_blank">Apri</a></div>
      <div><strong>Sorpresa:</strong> <a id="githubLink" href="#" target="_blank">Apri</a></div>
    </div>
  </section>

</div>

<!-- Pulsante Emergenza -->
<button id="emergencyBtn">🚨 EMERGENZA</button>

<script>
  const SITE_PASSWORD = "ciao123";
  const THUNKABLE_URL = "https://x.thunkable.com/copy/TUO_LINK";
  const GITHUB_URL = "https://github.com/TUO_USUARIO";

  document.getElementById("thunkLink").href = THUNKABLE_URL;
  document.getElementById("githubLink").href = GITHUB_URL;

  function tryPassword() {
    const p = document.getElementById("pwInput").value;
    if (p === SITE_PASSWORD) {
      document.getElementById("pwOverlay").style.display = "none";
      document.getElementById("app").style.display = "block";
      loadChat();
      loadDocs();
    } else {
      alert("Password errata");
    }
  }

  function sendMessage() {
    const input = document.getElementById("chatInput");
    const txt = input.value.trim();
    if (!txt) return;
    let chat = JSON.parse(localStorage.getItem("chat") || "[]");
    chat.push(txt);
    localStorage.setItem("chat", JSON.stringify(chat));
    input.value = "";
    loadChat();
  }

  function loadChat() {
    const box = document.getElementById("chat");
    const chat = JSON.parse(localStorage.getItem("chat") || "[]");
    box.innerHTML = "";
    chat.forEach(m => {
      box.innerHTML += "<div class='msg me'>" + m + "</div>";
    });
  }

  function saveNotes() {
    const n = document.getElementById("sharedNotes").value;
    localStorage.setItem("notes", n);
    alert("Note salvate");
  }

  function addLetter() {
    const txt = prompt("Scrivi la lettera:");
    if (!txt) return;
    let docs = JSON.parse(localStorage.getItem("docs") || "[]");
    docs.push({type:"text",text:txt});
    localStorage.setItem("docs", JSON.stringify(docs));
    loadDocs();
  }

  function loadDocs() {
    const box = document.getElementById("docs");
    const docs = JSON.parse(localStorage.getItem("docs") || "[]");
    box.innerHTML = "";
    docs.forEach(d => {
      box.innerHTML += "<pre>" + d.text + "</pre>";
    });
  }

  document.getElementById("fileInput").onchange = function(e) {
    const f = e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = function() {
      let docs = JSON.parse(localStorage.getItem("docs") || "[]");
      docs.push({type:"image",data:r.result});
      localStorage.setItem("docs", JSON.stringify(docs));
      loadDocs();
    };
    r.readAsDataURL(f);
  };

  document.getElementById("emergencyBtn").onclick = function() {
    alert("Respira. Ginseng ☕. Chiama qualcuno 📞. Ordina una crêpes 🥞.");
  };

  document.getElementById("nataleBtn").onclick = function() {
    document.body.classList.toggle("natale");
  };
</script>

</body>
</html>
