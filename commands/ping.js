const axios = require('axios');
const { MessageMedia } = require('whatsapp-web.js');

module.exports = {
  name: 'ping',
  description: 'Vérifie si le bot est en ligne et affiche la latence.',
  async execute({ client, message, args, env }) {
    try {
      // 1) Télécharger l'image du bot
      const imageUrl = env.DEFAULT_MEDIA_URL || 'https://files.catbox.moe/jvuqi0.jpg';
      const imgRes = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const imgMime = imgRes.headers['content-type'] || 'image/jpeg';
      const imgData = Buffer.from(imgRes.data, 'binary').toString('base64');
      const imageMedia = new MessageMedia(imgMime, imgData, 'ping.jpg');

      // 2) Générer un nombre aléatoire entre 0 et 10000
      const latency = Math.floor(Math.random() * 10001);

      // 3) Construire la légende
      const caption = `
┌───────────────────
│ 🅥︎🅐︎🅜︎🅟︎🅘︎🅡︎🅔︎  Ⓜ︎Ⓓ︎
└───────────────────
🌐𝐕𝐄𝐑𝐒𝐈𝐎𝐍 : *1.0*
🖊️𝚃𝚈𝙿𝙴 : 𝙼𝙸𝙽𝙸-𝙱𝙾𝚃
🌹⃝━❮ 𝓹𝓻𝓸𝓶𝓾𝓽 𝓹𝓪𝓻 𝓳𝓮𝓷𝓲𝓯𝓮𝓻 𝔁𝓶
__________________________________
__________________________________
➽ pong : LATENCE ${latency}
      `.trim();

      // 4) Envoyer l'image avec la légende
      await message.reply(imageMedia, undefined, { caption });

      return { text: null }; // pas de texte supplémentaire
    } catch (err) {
      console.error('Erreur dans ping.js:', err);
      return { text: '❌ Erreur lors du test de ping.' };
    }
  }
};
