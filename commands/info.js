const axios = require('axios');
const { MessageMedia } = require('whatsapp-web.js');

module.exports = {
  name: 'info',
  description: 'Affiche les informations sur le bot.',
  async execute({ client, message, args, env }) {
    try {
      // 1) Télécharger l'image du bot
      const imageUrl = env.DEFAULT_MEDIA_URL || 'https://files.catbox.moe/jvuqi0.jpg';
      const imgRes = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const imgMime = imgRes.headers['content-type'] || 'image/jpeg';
      const imgData = Buffer.from(imgRes.data, 'binary').toString('base64');
      const imageMedia = new MessageMedia(imgMime, imgData, 'info.jpg');

      // 2) Récupérer l'utilisateur qui a envoyé la commande
      const userMention = `@${message.author?.split('@')[0] || message.from}`;

      // 3) Construire la légende
      const caption = `
🤖𝗩𝗔𝗠𝗣𝗜𝗥𝗘 𝗠𝗗📊
Hello 👋🏼 ${userMention}
Je suis 𝚅𝙰𝙼𝙿𝙸𝚁𝙴 𝙼𝙳🌐
𝐮𝐧 𝐛𝐨𝐭 𝐝𝐞𝐯𝐞𝐥𝐨𝐩𝐩𝐞 𝐩𝐚𝐫 𝐣𝐞𝐧𝐢𝐟𝐞𝐫 𝐱𝐦 𝐬𝐭𝐮𝐝𝐢𝐨
𝐣𝐞 𝐬𝐮𝐢𝐬 𝐭𝐫𝐞𝐬 𝐚𝐦𝐮𝐬𝐚𝐧𝐭 𝐞𝐭 𝐮𝐧 𝐩𝐞𝐮 𝐝𝐢𝐚𝐛𝐨𝐥𝐢𝐪𝐮𝐞 𝐩𝐚𝐫𝐟𝐨𝐢𝐬 😈

👨‍💻𝐃𝐄𝐕𝐄𝐋𝐎𝐏𝐏𝐄𝐔𝐑 : 𝑱𝑬𝑵𝑰𝑭𝑬𝑹 𝑿𝑴
👨‍🔬𝐏𝐑𝐎𝐌𝐎𝐓𝐄𝐔𝐑 : 𝐌𝐈𝐊𝐀𝐄𝐋 𝐊𝐀𝐁𝐎𝐑𝐄
🎯𝐒𝐓𝐔𝐃𝐈𝐎 : 𝐽𝐸𝑁𝐼𝐹𝐸𝑅 𝑋𝑀 𝑆𝑇𝑈𝐷𝐼𝑂

♦️𝐉𝐎𝐈𝐍 𝐏𝐑𝐎𝐌𝐎𝐓𝐎𝐑 𝐂𝐇𝐀𝐍𝐍𝐄𝐋 :
https://whatsapp.com/channel/0029VbB3lzT3GJP3AsgHA71W

♦️𝐉𝐎𝐈𝐍 𝐃𝐄𝐕 𝐂𝐇𝐀𝐍𝐍𝐄𝐋 :
https://youtube.com/@xmjenifer?si=7-5eIXYhsJuAyS9W

♦️𝐆𝐈𝐓𝐇𝐔𝐁 :
https://github.com/musicopilotvf456-eng/VAMPIRE-MD
      `.trim();

      // 4) Envoyer l'image avec la légende + mention de l'utilisateur
      await client.sendMessage(message.from, imageMedia, {
        caption,
        mentions: [message.author]
      });

      return { text: null };
    } catch (err) {
      console.error('Erreur dans info.js:', err);
      return { text: '❌ Erreur lors de l\'affichage des infos du bot.' };
    }
  }
};
