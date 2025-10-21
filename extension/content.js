console.log("✅ Content script caricato");

async function trovaDomandaERisposte() {
  const textNodes = [...document.body.querySelectorAll("*")]
    .map(el => el.innerText?.trim())
    .filter(t => t && t.length > 0 && t.length < 300);

  // Trova la prima domanda (che finisce con '?')
  const domanda = textNodes.find(t => /\?\s*$/.test(t));
  if (!domanda) return null;

  const idx = textNodes.indexOf(domanda);
  const risposte = textNodes.slice(idx + 1, idx + 10)
    .filter(t => /^[A-D]\s*[\).\-–]?\s*/i.test(t) || (t.length > 2 && t.length < 200))
    .map((t, i) => ({ testo: t, el: document.body.querySelectorAll("*")[idx + 1 + i] }));

  if (risposte.length === 0) return null;
  return { domanda, risposte };
}

async function chiediGPT(domanda, risposte) {
  const opzioni = risposte.map((r, i) => `${String.fromCharCode(65 + i)}. ${r.testo}`).join("\n");
  const prompt = `Domanda: ${domanda}\nOpzioni:\n${opzioni}\nRispondi indicando la lettera o il testo esatto.`;

  const risposta = await fetch("http://localhost:3000/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Sei un assistente che risponde a quiz a scelta multipla." },
        { role: "user", content: prompt }
      ],
      max_tokens: 100
    })
  }).then(r => r.json());

  return risposta.choices?.[0]?.message?.content?.trim();
}

async function compilaQuiz() {
  const dati = await trovaDomandaERisposte();
  if (!dati) return alert("Nessuna domanda trovata 😕");

  const { domanda, risposte } = dati;
  console.log("Domanda:", domanda);
  console.log("Risposte:", risposte.map(r => r.testo));

  const rispostaGPT = await chiediGPT(domanda, risposte);
  console.log("Risposta GPT:", rispostaGPT);

  if (!rispostaGPT) return alert("Nessuna risposta generata 😕");

  const rispostaPulita = rispostaGPT.toLowerCase();
  let trovata = false;

  for (const r of risposte) {
    const testo = r.testo.toLowerCase();
    if (rispostaPulita.includes(testo) || testo.includes(rispostaPulita)) {
      r.el.click?.();
      trovata = true;
      break;
    }
  }

  if (!trovata) {
    const lettera = rispostaPulita.match(/[a-d]/i);
    if (lettera) {
      const index = lettera[0].toUpperCase().charCodeAt(0) - 65;
      if (risposte[index]) {
        risposte[index].el.click?.();
        trovata = true;
      }
    }
  }

  alert(trovata ? "Risposta selezionata ✅" : "Nessuna corrispondenza trovata 😕");
}
chrome.runtime.onMessage.addListener((msg) => {
  console.log("📩 Messaggio ricevuto:", msg);
  if (msg.action === "compila_form") {
    // chiamiamo la funzione async ma SENZA usare await qui
    compilaQuiz()
      .then(() => console.log("✅ Compilazione completata"))
      .catch(err => console.error("❌ Errore in compilaQuiz:", err));
  }
});
