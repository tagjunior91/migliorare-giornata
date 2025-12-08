import React, { useEffect, useState, useRef } from "react";
/*
  Sito "Migliora la Giornata" - Single-file React app
  - Usa TailwindCSS per lo stile (assicurati di avere Tailwind configurato nel progetto)
  - Richiede le seguenti variabili d'ambiente (da impostare in hosting come Vercel / Netlify):
      NEXT_PUBLIC_SUPABASE_URL
      NEXT_PUBLIC_SUPABASE_ANON_KEY
      NEXT_PUBLIC_ADMIN_PASS_HASH   (sha256 hex)
      NEXT_PUBLIC_USER_PASS_HASH    (sha256 hex)
  - Prima di deploy, genera gli hash delle password reali e mettili in env. Il confronto avviene client-side con WebCrypto (SHA-256).
  - Il codice usa Supabase per: messages (chat), notes (note condivise), storage 'documents' per foto/lettere, e una tabella 'links' per i collegamenti esterni.

  Tabelle consigliate in Supabase (SQL):

  create table messages (
    id uuid default gen_random_uuid() primary key,
    sender text,
    text text,
    created_at timestamptz default now()
  );

  create table notes (
    id uuid default gen_random_uuid() primary key,
    content text,
    updated_by text,
    updated_at timestamptz default now()
  );

  create table links (
    id uuid default gen_random_uuid() primary key,
    title text,
    url text,
    kind text
  );

  Storage: crea un bucket pubblico o protetto chiamato 'documents'

  IMPORTANTE: questo file è una base funzionale — personalizza le regole di sicurezza (RLS) su Supabase per proteggere i contenuti.
*/

// ---- Helpers ----
async function sha256hex(str) {
  const enc = new TextEncoder();
  const data = enc.encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

// Load supabase client dynamically to keep file self-contained
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function MiglioraGiornataApp() {
  // Auth gating with two passwords
  const [entered, setEntered] = useState(false);
  const [role, setRole] = useState(null); // 'admin' or 'user'
  const [passInput, setPassInput] = useState("");
  const [status, setStatus] = useState("");

  // App state
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [notes, setNotes] = useState("");
  const [links, setLinks] = useState([]);
  const [documents, setDocuments] = useState([]);
  const fileInputRef = useRef();

  // On mount: fetch initial data
  useEffect(() => {
    if (!entered) return;
    fetchMessages();
    fetchNotes();
    fetchLinks();
    listDocuments();
    subscribeMessages();
  }, [entered]);

  // ---- Auth / Gate ----
  async function handleEnter(e) {
    e.preventDefault();
    setStatus("Verifico la password...");
    try {
      const h = await sha256hex(passInput || "");
      const adminHash = process.env.NEXT_PUBLIC_ADMIN_PASS_HASH || "";
      const userHash = process.env.NEXT_PUBLIC_USER_PASS_HASH || "";
      if (!adminHash || !userHash) {
        setStatus("Errore: hash password non impostati. Imposta le env vars.");
        return;
      }
      if (h === adminHash) {
        setRole("admin");
        setEntered(true);
        setStatus("Benvenuto Admin");
      } else if (h === userHash) {
        setRole("user");
        setEntered(true);
        setStatus("Benvenuto");
      } else {
        setStatus("Password errata");
      }
    } catch (err) {
      console.error(err);
      setStatus("Errore inatteso");
    }
  }

  // ---- Messages (chat) ----
  async function fetchMessages() {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(200);
    if (error) console.error(error);
    else setMessages(data || []);
  }

  async function sendMessage() {
    if (!newMsg.trim()) return;
    const sender = role || "user";
    const { data, error } = await supabase.from("messages").insert([
      { sender, text: newMsg.trim() },
    ]);
    if (error) console.error(error);
    else {
      setNewMsg("");
      // push locally for snappy UI
      setMessages((m) => [...m, { ...data[0] }]);
    }
  }

  function subscribeMessages() {
    const channel = supabase.channel("public:messages");
    channel.on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "messages" },
      (payload) => {
        setMessages((m) => [...m, payload.new]);
      }
    );
    channel.subscribe();
    // cleanup on unload
    return () => supabase.removeChannel(channel);
  }

  // ---- Notes (shared) ----
  async function fetchNotes() {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1);
    if (error) console.error(error);
    else if (data && data[0]) setNotes(data[0].content || "");
  }

  async function saveNotes() {
    const updater = role || "user";
    // upsert: if a row exists, update it; otherwise insert
    const { error } = await supabase.from("notes").upsert(
      [
        {
          id: "singleton-note",
          content: notes,
          updated_by: updater,
          updated_at: new Date().toISOString(),
        },
      ],
      { onConflict: ["id"] }
    );
    if (error) console.error(error);
    else setStatus("Note salvate");
  }

  // ---- Links ----
  async function fetchLinks() {
    const { data, error } = await supabase.from("links").select("*");
    if (error) console.error(error);
    else setLinks(data || []);
  }

  async function addLink(title, url, kind = "other") {
    if (role !== "admin") return setStatus("Solo admin può aggiungere link");
    const { error } = await supabase.from("links").insert([{ title, url, kind }]);
    if (error) console.error(error);
    else fetchLinks();
  }

  // ---- Documents (storage) ----
  async function listDocuments() {
    const { data, error } = await supabase.storage.from("documents").list("");
    if (error) console.error(error);
    else setDocuments(data || []);
  }

  async function uploadDocument(file) {
    if (!file) return;
    const fileName = `${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from("documents").upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });
    if (error) console.error(error);
    else {
      setStatus("File caricato");
      listDocuments();
    }
  }

  async function getDocumentUrl(path) {
    const { data } = await supabase.storage.from("documents").createSignedUrl(path, 60 * 60 * 24); // 24h
    return data?.signedUrl || "";
  }

  // ---- Small UI helpers ----
  function Logout() {
    setEntered(false);
    setRole(null);
    setPassInput("");
    setStatus("");
  }

  // ---- Render ----
  if (!entered) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl p-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">Entra — Migliora la Giornata</h1>
          <p className="text-sm text-gray-500 mb-4">Inserisci la password per accedere al sito. (Admin / Utente)</p>
          <form onSubmit={handleEnter} className="space-y-3">
            <input
              type="password"
              value={passInput}
              onChange={(e) => setPassInput(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none"
            />
            <button className="w-full py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium">Entra</button>
            <p className="text-sm text-center text-gray-500">{status}</p>
          </form>
          <div className="mt-4 text-xs text-gray-400">Stile: Elegante • Lingua: Italiano</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold">Migliora la Giornata</h2>
            <p className="text-sm text-gray-500">Area privata — ruolo: {role}</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={Logout} className="px-3 py-2 rounded-lg border">Logout</button>
            <div className="text-sm text-gray-500">{status}</div>
          </div>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column: Improve-day section + Links */}
          <section className="col-span-1 md:col-span-1 bg-white p-4 rounded-2xl shadow">
            <h3 className="font-semibold text-lg mb-2">Migliora la Giornata</h3>
            <p className="text-sm text-gray-600 mb-3">Brevi cose positive: frasi, audio (puoi incollare link), immagini.</p>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50">
                <strong>Citazione del giorno</strong>
                <p className="mt-2 text-gray-700">"Fai oggi qualcosa per cui il tuo futuro ti ringrazierà."</p>
              </div>

              <div>
                <h4 className="font-medium">Link utili</h4>
                <ul className="mt-2 space-y-2">
                  {links.map((l) => (
                    <li key={l.id} className="text-sm">
                      <a href={l.url} target="_blank" rel="noreferrer" className="underline">
                        {l.title}
                      </a>
                    </li>
                  ))}
                </ul>
                {role === "admin" && (
                  <AddLinkForm onAdd={(t, u) => addLink(t, u, "thunkable")} />
                )}
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-medium">App Thunkable</h4>
              <p className="text-sm text-gray-600">Inserisci qui il link della tua app Thunkable (es. https://x.thunkable.com/...)</p>
              <div className="mt-2">
                <a
                  className="inline-block px-3 py-2 rounded-lg border"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    const thunk = links.find((x) => x.kind === "thunkable");
                    if (thunk) window.open(thunk.url, "_blank");
                    else setStatus("Nessun link Thunkable impostato");
                  }}
                >
                  Apri App Thunkable
                </a>
              </div>
            </div>
          </section>

          {/* Middle: Chat */}
          <section className="col-span-1 md:col-span-1 bg-white p-4 rounded-2xl shadow">
            <h3 className="font-semibold text-lg mb-2">Mini Chat</h3>
            <div className="h-72 overflow-auto border rounded-lg p-3 mb-3 bg-gray-50">
              {messages.map((m) => (
                <div key={m.id} className={`mb-2 ${m.sender === role ? "text-right" : "text-left"}`}>
                  <div className={`inline-block p-2 rounded-lg ${m.sender === role ? "bg-indigo-600 text-white" : "bg-white text-gray-800 shadow"}`}>
                    <div className="text-xs font-semibold">{m.sender}</div>
                    <div className="text-sm">{m.text}</div>
                    <div className="text-xs text-gray-400 mt-1">{new Date(m.created_at).toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                placeholder="Scrivi..."
                className="flex-1 px-3 py-2 border rounded-lg"
              />
              <button onClick={sendMessage} className="px-4 py-2 rounded-lg bg-indigo-600 text-white">Invia</button>
            </div>
          </section>

          {/* Right: Notes + Documents */}
          <section className="col-span-1 md:col-span-1 bg-white p-4 rounded-2xl shadow">
            <h3 className="font-semibold text-lg mb-2">Note condivise</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={8}
              className="w-full border rounded-lg p-3"
            />
            <div className="flex gap-2 mt-3">
              <button onClick={saveNotes} className="px-3 py-2 rounded-lg bg-green-600 text-white">Salva note</button>
              {role === "admin" && (
                <>
                  <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => uploadDocument(e.target.files[0])} />
                  <button onClick={() => fileInputRef.current.click()} className="px-3 py-2 rounded-lg border">Carica Documento</button>
                </>
              )}
            </div>

            <div className="mt-4">
              <h4 className="font-medium">Cartacei consegnati</h4>
              <div className="mt-2 space-y-2">
                {documents.map((d) => (
                  <DocumentPreview key={d.name} file={d} getUrl={getDocumentUrl} />
                ))}
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-medium">Altri siti (GitHub)</h4>
              <p className="text-sm">Aggiungi il link al progetto GitHub nella sezione link.</p>
            </div>
          </section>
        </main>

        <footer className="mt-6 text-sm text-gray-500">Progetto base — Personalizza regole di sicurezza e variabili d'ambiente prima del deploy.</footer>
      </div>
    </div>
  );
}

function AddLinkForm({ onAdd }) {
  const [t, setT] = useState("");
  const [u, setU] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!t || !u) return;
        onAdd(t, u);
        setT("");
        setU("");
      }}
      className="mt-2 space-y-2"
    >
      <input value={t} onChange={(e) => setT(e.target.value)} placeholder="Titolo" className="w-full px-2 py-1 border rounded" />
      <input value={u} onChange={(e) => setU(e.target.value)} placeholder="URL" className="w-full px-2 py-1 border rounded" />
      <button className="px-3 py-1 rounded bg-indigo-600 text-white">Aggiungi link</button>
    </form>
  );
}

function DocumentPreview({ file, getUrl }) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    (async () => {
      const u = await getUrl(file.name);
      setUrl(u);
    })();
  }, [file]);

  return (
    <div className="border rounded p-2 flex items-center gap-3">
      <div className="flex-1">
        <div className="font-medium text-sm">{file.name}</div>
        <div className="text-xs text-gray-500">{Math.round((file.size || 0) / 1024)} KB</div>
      </div>
      {url ? (
        <a href={url} target="_blank" rel="noreferrer" className="px-3 py-1 rounded border">Apri</a>
      ) : (
        <div className="text-xs text-gray-400">Caricamento...</div>
      )}
    </div>
  );
}
