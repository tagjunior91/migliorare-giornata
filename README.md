<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Buona Giornata 💖</title>
<link rel="stylesheet" href="styles.css">
</head>
<body>

<div id="login">
  <h2>Inserisci la password per entrare 🌸</h2>
  <input type="password" id="password" placeholder="Password">
  <button onclick="checkPassword()">Entra</button>
  <p id="error"></p>
</div>

<div id="content" style="display:none;">
  <header>
    <h1>Benvenuta! 💖</h1>
    <p>Qui troverai foto, video e lettere per migliorare la giornata 🌈</p>
  </header>

  <section id="gallery">
    <h2>Foto e Video</h2>
    <div class="media-container">
      <img src="photos/foto1.jpg" alt="Foto dolce">
      <img src="photos/foto2.jpg" alt="Foto dolce">
      <video controls>
        <source src="videos/video1.mp4" type="video/mp4">
      </video>
    </div>
  </section>

  <section id="letters">
    <h2>Lettere</h2>
    <div class="letter">
      <h3>Lettera 1</h3>
      <p>Ciao amore, oggi voglio dirti quanto sei speciale per me...</p>
    </div>
    <div class="letter">
      <h3>Lettera 2</h3>
      <p>Quando ti senti triste, ricorda che ogni giorno è una nuova opportunità 💖</p>
    </div>
  </section>

  <section id="chat">
    <h2>Mini Chat</h2>
    <textarea id="chatInput" placeholder="Scrivi qui..."></textarea>
    <button onclick="addMessage()">Invia</button>
    <div id="chatBox"></div>
  </section>

  <section id="links">
    <h2>Link utili</h2>
    <ul>
      <li><a href="https://altrosito.com" target="_blank">Sito speciale</a></li>
      <li><a href="https://thunkable.com" target="_blank">App su Thunkable</a></li>
    </ul>
  </section>
</div>

<script src="script.js"></script>
</body>
</html>
