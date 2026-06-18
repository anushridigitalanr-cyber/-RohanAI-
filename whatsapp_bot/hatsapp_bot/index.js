const { Client, LocalAuth } = require('whatsapp-web.js');
const axios = require('axios');
const qrcode = require('qrcode-terminal');
require('dotenv').config();

const BACKEND_URL = 'https://anushridigitalanr.pythonanywhere.com';

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true
    }
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('रोहन WhatsApp वर आला!');
});

client.on('message', async message => {
    if (message.from.includes('@g.us')) return;
    if (message.type !== 'chat') return;
    console.log(`📩 मेसेज आला: ${message.body}`);

    if (message.body.startsWith('!') || message.from.includes('status')) return;

    try {
        const res = await axios.post(`${BACKEND_URL}/webhook`, {
            user_id: message.from,
            message: message.body
        });
        await message.reply(res.data.reply);
        console.log(`✅ उत्तर पाठवले: ${res.data.reply}`);
    } catch(e) {
        console.error('❌ बॅकएन्ड एरर:', e.message);
        await message.reply('रोहनशी संपर्क साधता येत नाही.');
    }
});

client.initialize();
