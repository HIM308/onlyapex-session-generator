const express = require('express');
const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/generate', async (req, res) => {
    const { number } = req.body;
    if (!number) return res.status(400).send('Number is required');

    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: true
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, qr } = update;
        if (qr) {
            qrcode.generate(qr, { small: true });
        }
    });

    sock.ev.on('creds.update', saveCreds);

    res.send('Code generated, check terminal.');
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
