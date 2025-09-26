const axios = require('axios');
const { MessageMedia } = require('whatsapp-web.js');

function generatePairingCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

module.exports = {
  name: 'pair',
  description: 'Génère un code de connexion pour lier un compte WhatsApp au bot.',
  async execute({ client, message, args, env }) {
    try {
      // 1) Générer un code unique
      const pairingCode = generatePairingCode();

      // 2) Télécharger l'image du bot
      const imageUrl = env.DEFAULT_MEDIA_URL || 'https://files.catbox.moe/jvuqi0.jpg';
      const imgRes = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const imgMime = imgRes.headers['content-type'] || 'image/jpeg';
      const imgData = Buffer.from(imgRes.data, 'binary').toString('base64');
      const imageMedia = new MessageMedia(imgMime, imgData, 'pair.jpg');

      // 3) Construire la légende
      const caption = `
┌───────────────────
│ 🅥︎🅐︎🅜︎🅟︎🅘︎🅡︎🅔︎  Ⓜ︎Ⓓ︎
└───────────────────
🌐𝐕𝐄𝐑𝐒𝐈𝐎𝐍 : *1.0*
🖊️𝚃𝚈𝙿𝙴 : 𝙼𝙸𝙽𝙸-𝙱𝙾𝚃
🛅pairing code : ${pairingCode}
🌹⃝━❮ 𝓹𝓻𝓸𝓶𝓾𝓽 𝓹𝓪𝓻 𝓳𝓮𝓷𝓲𝓯𝓮𝓻 𝔁𝓶
__________________________________
__________________________________

🔗 Rejoins notre chaîne :
https://whatsapp.com/channel/0029VbB3lzT3GJP3AsgHA71W
      `.trim();

      // 4) Envoyer l'image avec la légende
      await client.sendMessage(message.from, imageMedia, {
        caption
      });

      return { text: null, pairingCode }; // pairingCode retourné si besoin
    } catch (err) {
      console.error('Erreur dans pair.js:', err);
      return { text: '❌ Erreur lors de la génération du code de connexion.' };
    }
  }
};
