const express = require("express");
const { useMultiFileAuthState, fetchLatestBaileysVersion, makeWASocket } = require("@whiskeysockets/baileys");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("🟢 OnlyApex Pair Code Session Generator is Live");
});

app.post("/generate", async (req, res) => {
  const { number } = req.body;
  if (!number) return res.status(400).send("Number is required");

  const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: false, // we don’t want QR
    browser: ["OnlyApex", "Chrome", "110.0.0.0"]
  });

  sock.ev.on("connection.update", async (update) => {
    const { connection, pairingCode } = update;

    if (pairingCode) {
      res.send(`Your Pairing Code: *${pairingCode}*\n\nOpen WhatsApp Web → Link Device → Enter code.`);
    }

    if (connection === "open") {
      console.log("✅ Session connected");
    }
  });

  sock.ev.on("creds.update", saveCreds);
});

app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
