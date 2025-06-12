const express = require("express");
const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("OnlyApex Pair Code Session Generator is Live");
});

app.post("/generate", async (req, res) => {
  const { state, saveCreds } = await useMultiFileAuthState("session");

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
  });

  res.send("✅ Pair code QR printed in Render logs.");
});

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
