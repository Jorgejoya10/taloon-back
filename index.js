import express from "express";
import bodyParser from "body-parser";
import cors from "cors"; //Esta libreria sirve para poder conectar el backend con el frontend desde diferentes servidores locales.
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL; // URL del Webhook

// Habilitar CORS y body-parser
app.use(cors());
app.use(bodyParser.json());

// Endpoint para recibir datos y enviarlos a Slack
app.post("/send-to-slack", async (req, res) => {
  const { instagramUser } = req.body;

  if (!instagramUser) {
    return res.status(400).json({ error: "Usuario de Instagram no proporcionado." });
  }

  try {
    // Enviar mensaje al canal de Slack
    const slackResponse = await fetch(slackWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: `Nuevo Candidato: ${instagramUser}` }),
    });

    if (!slackResponse.ok) {
      throw new Error("Error al enviar mensaje a Slack.");
    }

    // Respuesta exitosa
    res.status(200).json({ message: "Mensaje enviado a Slack exitosamente." });
  } catch (error) {
    console.error("Error al enviar mensaje a Slack:", error);
    res.status(500).json({ error: "Error interno al enviar mensaje a Slack." });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
