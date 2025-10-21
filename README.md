# 🚀 FormAutoGPT

![status](https://img.shields.io/badge/status-in%20development-yellow)
![license](https://img.shields.io/badge/license-MIT-blue)
![chrome-extension](https://img.shields.io/badge/platform-Chrome-green)

Un’estensione **in sviluppo** per compilare automaticamente form e quiz online, basata su **GPT** tramite API di OpenAI.  
L’obiettivo è astrarre il processo, rendendola adattabile a qualsiasi sito web. 🧠

---

## 🧩 Struttura del progetto

```
FormAutoGPT/
│
├── extension/      → codice dell’estensione Chrome
│   ├── manifest.json
│   ├── content.js
│   ├── popup.html / popup.js
│   ├── background.js
│   ├── icon.png
│   └── test_quiz.html  (pagina di test locale)
│
└── server/         → proxy locale per chiamate OpenAI
    ├── server.js
    ├── package.json
    └── .env (NON pushato su GitHub)
```

---

## ⚙️ Come usarlo localmente

### 1️⃣ Clona il progetto
```bash
git clone https://github.com/<tuo-username>/FormAutoGPT.git
cd FormAutoGPT
```

### 2️⃣ Installa le dipendenze del server
```bash
cd server
npm install
```

### 3️⃣ Crea il file `.env`
All’interno di `server/` crea un file `.env`:
```
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxx
```

### 4️⃣ Avvia il server
```bash
node server.js
```

### 5️⃣ Carica l’estensione su Chrome
1. Apri `chrome://extensions`
2. Attiva la **Modalità sviluppatore**
3. Clicca su **“Carica estensione non pacchettizzata”**
4. Seleziona la cartella `FormAutoGPT/extension`

### 6️⃣ Testa su una pagina
Apri `test_quiz.html` e clicca sull’icona dell’estensione → **Compila con GPT**

---

## 🌍 Obiettivo futuro

🔧 L’obiettivo è rendere FormAutoGPT:
- adattabile a qualsiasi sito web o form HTML;
- configurabile con regole di riconoscimento automatiche;
- eventualmente distribuibile come estensione cross-browser (Chrome, Edge, Firefox).

---

## 🧑‍💻 Autore
**[Il tuo nome o nickname]**  
📧 [Email opzionale]  
💡 *In costante sviluppo e miglioramento.*

---

## 🪪 Licenza
Rilasciato sotto licenza **MIT**.  
Vedi il file [LICENSE](LICENSE) per i dettagli.
