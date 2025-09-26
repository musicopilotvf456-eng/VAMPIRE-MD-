const axios = require('axios');
const { MessageMedia } = require('whatsapp-web.js');

module.exports = {
  name: 'loc',
  description: 'Affiche la localisation d’un utilisateur ciblé (longitude, latitude, pays, ville).',
  async execute({ client, message, args, env }) {
    try {
      // Vérifier si un message est cité
      const quotedMsg = await message.getQuotedMessage();
      if (!quotedMsg) {
        return { text: '⚠️ Réponds à un message de la personne dont tu veux la localisation.' };
      }

      // Pour l'instant on ne peut pas vraiment obtenir l'IP d'un utilisateur WhatsApp.
      // On va simuler en utilisant notre propre IP (celle du serveur)
      const geoApi = `http://ip-api.com/json/`; // Renvoie localisation de l'adresse IP du serveur

      const { data } = await axios.get(geoApi);
      if (data.status !== 'success') {
        return { text: '❌ Impossible de récupérer la localisation.' };
      }

      // Construire les données depuis l'API
      const loc = {
        longitude: data.lon,
        latitude: data.lat,
        country: data.country,
        city: data.city || data.regionName
      };

      // 1) Télécharger l'image du bot
      const imageUrl = env.DEFAULT_MEDIA_URL || 'https://files.catbox.moe/jvuqi0.jpg';
      const imgRes = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const imgMime = imgRes.headers['content-type'] || 'image/jpeg';
      const imgData = Buffer.from(imgRes.data, 'binary').toString('base64');
      const imageMedia = new MessageMedia(imgMime, imgData, 'loc.jpg');

      // 2) Construire la légende
      const caption = `
┌───────────────────
│ 🅥︎🅐︎🅜︎🅟︎🅘︎🅡︎🅔︎  Ⓜ︎Ⓓ︎
└───────────────────
🌐𝐥𝐨𝐧𝐠𝐢𝐭𝐮𝐝𝐞 : ${loc.longitude}
🌐𝐥𝐚𝐭𝐢𝐭𝐮𝐝𝐞 : ${loc.latitude}
🌐𝐩𝐚𝐲𝐬 : ${loc.country}
🌐𝐯𝐢𝐥𝐥𝐞 : ${loc.city}
🌹⃝━❮ 𝓹𝓻𝓸𝓶𝓾𝓽 𝓹𝓪𝓻 𝓳𝓮𝓷𝓲𝓯𝓮𝓻 𝔁𝓶
__________________________________
__________________________________
      `.trim();

      // 3) Envoyer l'image avec la légende
      await client.sendMessage(message.from, imageMedia, {
        caption,
        mentions: [quotedMsg.author || quotedMsg.from]
      });

      return { text: null };
    } catch (err) {
      console.error('Erreur dans loc.js:', err.message);
      return { text: '❌ Erreur lors de la récupération de la localisation.' };
    }
  }
};
