import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";
import chalk from "chalk"; // per colori in console (facoltativo ma utile)

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Log iniziale
console.log(chalk.blueBright("🚀 Proxy attivo su http://localhost:3000"));

// Endpoint principale
app.post("/ask", async (req, res) => {
  console.log(chalk.yellow("✅ Richiesta ricevuta dal client!"));
  console.log(chalk.gray("Body ricevuto:"), req.body);

  try {
    // Chiamata all'API di OpenAI
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: req.body.model || "gpt-4o-mini", // ✅ modello valido
        messages: req.body.messages,
        max_completion_tokens: req.body.max_tokens || 150 // ✅ parametro corretto
      })
    });

    const data = await openaiResponse.json();

    // Log di debug
    console.log(chalk.cyan("🔹 Risposta API OpenAI:"));
    console.dir(data, { depth: null });

    if (data.error) {
      console.error(chalk.red("❌ Errore OpenAI:"), data.error);
      return res.status(400).json({ error: data.error });
    }

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json(data);

    console.log(chalk.green("🟢 Risposta inviata al client con successo!"));
  } catch (err) {
    console.error(chalk.red("❌ Errore proxy:"), err);
    res.status(500).json({ error: "Errore interno del server proxy" });
  }
});

// Avvio server
const PORT = 3000;
app.listen(PORT, () => console.log(chalk.blueBright(`🌐 Server in ascolto sulla porta ${PORT}`)));
