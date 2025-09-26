const axios = require('axios');
const { MessageMedia } = require('whatsapp-web.js');

module.exports = {
  name: 'menu',
  description: 'Affiche le menu principal du bot avec image et audio.',
  async execute({ client, message, args, env }) {
    try {
      // 1) Télécharger l'image par défaut
      const imageUrl = env.DEFAULT_MEDIA_URL || 'https://files.catbox.moe/jvuqi0.jpg';
      const imgRes = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const imgMime = imgRes.headers['content-type'] || 'image/jpeg';
      const imgData = Buffer.from(imgRes.data, 'binary').toString('base64');
      const imageMedia = new MessageMedia(imgMime, imgData, 'menu.jpg');

      // 2) Télécharger l'audio et préparer en PTT
      const audioUrl = 'https://files.catbox.moe/bcgupz.mp3';
      const audioRes = await axios.get(audioUrl, { responseType: 'arraybuffer' });
      const audioData = Buffer.from(audioRes.data, 'binary').toString('base64');
      const audioMedia = new MessageMedia('audio/mp3', audioData, 'menu.mp3');

      // 3) Construire la légende du menu
      const menuText = `
┌───────────────────
│ 🅥︎🅐︎🅜︎🅟︎🅘︎🅡︎🅔︎  Ⓜ︎Ⓓ︎
└───────────────────
🌐𝐕𝐄𝐑𝐒𝐈𝐎𝐍 : *1.0*
🖊️𝚃𝚈𝙿𝙴 : 𝙼𝙸𝙽𝙸-𝙱𝙾𝚃
🌹⃝━❮ 𝓹𝓻𝓸𝓶𝓾𝓽 𝓹𝓪𝓻 𝓳𝓮𝓷𝓲𝓯𝓮𝓻 𝔁𝓶
__________________________________
__________________________________
➽👤𝐏𝐄𝐑𝐒𝐎𝐍𝐀𝐋-𝗠𝗘𝗡𝗨
☨𝐩𝐢𝐧𝐠
☨𝐦𝐞𝐧𝐮
☨𝐢𝐧𝐟𝐨
☨𝐥𝐨𝐜
☨𝐦𝐨𝐭𝐢𝐯𝐚𝐭𝐢𝐨𝐧
☨𝐩𝐚𝐢𝐫
☨𝐭𝐲𝐩𝐢𝐧𝐠
☨𝐚𝐮𝐭𝐨𝐯𝐮𝐬𝐭𝐚𝐭𝐮𝐭
☨𝐚𝐮𝐭𝐨𝐫𝐞𝐚𝐜𝐭
☨𝐦𝐨𝐫𝐞 
☨𝐡𝐚𝐩𝐩𝐲
☨𝐥𝐨𝐯𝐞
☨𝐟𝐨𝐧𝐭
☨𝐝𝐚𝐭𝐞

__________________________________
__________________________________
➽👥𝐆𝐑𝐎𝐔𝐏𝐄-𝗠𝗘𝗡𝗨
☨𝐠𝐫𝐨𝐮𝐩𝐢𝐧𝐟𝐨
☨𝐭𝐚𝐠𝐚𝐥𝐥
☨𝐭𝐚𝐠𝐚𝐝𝐦𝐢𝐧
☨𝐤𝐢𝐜𝐤
☨𝐝𝐞𝐥𝐞𝐭𝐞
☨𝐦𝐮𝐭𝐞/𝐮𝐧𝐦𝐮𝐭𝐞
☨𝐤𝐢𝐜𝐤𝐚𝐥𝐥
☨𝐚𝐧𝐭𝐢𝐬𝐩𝐚𝐦
☨𝐚𝐧𝐭𝐢𝐬𝐭𝐚𝐭𝐮𝐭
☨𝐚𝐧𝐭𝐢𝐦𝐞𝐝𝐢𝐚
☨𝐚𝐧𝐭𝐢𝐛𝐨𝐭 
☨𝐚𝐧𝐭𝐢𝐦𝐞𝐧𝐭𝐢𝐨𝐧 
☨𝐠𝐚𝐦𝐚𝐥𝐥
☨𝐩𝐫𝐨𝐦𝐨𝐭𝐞
☨𝐝𝐞𝐦𝐨𝐭𝐞
☨𝐝𝐞𝐥𝐠𝐫𝐨𝐮𝐩
__________________________________
__________________________________
📹𝐌𝐄𝐃𝐈𝐀-𝗠𝐄𝐍𝐔
☨𝘀𝘁𝗼𝗿𝗲
☨𝘀𝗲𝗻𝗱
☨𝘀𝘁𝗶𝗰𝗸𝗲𝗿
☨𝘁𝗮𝗸𝗲
☨𝗰𝗼𝗻𝘃𝗲𝗿𝘁𝗧𝗼𝗺𝗽3
☨𝘃𝘃
☨𝗴𝗲𝘁𝗽𝗽
☨𝘀𝗲𝘁𝗽𝗽
☨𝗴𝗲𝗻𝗲𝗿𝗮𝘁𝗲
__________________________________
__________________________________
➽📥𝐃𝐎𝐖𝐍𝐋𝐀𝐎𝐃-𝗠𝐄𝐍𝐔
☨𝐩𝐥𝐚𝐲
☨𝐢𝐦𝐠
☨𝐭𝐢𝐤𝐭𝐨𝐤
☨𝐲𝐭
__________________________________
__________________________________
➽🖥️𝐓𝐄𝐂𝐇𝐍𝐈𝐂𝐀𝐋-𝗠𝐄𝐍𝐔
♧𝐜𝐚𝐥𝐜𝐮𝐥𝐚𝐭𝐞
♧𝐫𝐞𝐜𝐡𝐞𝐚𝐫𝐜𝐡
__________________________________
__________________________________
➽🧑🏼‍💻𝐂𝐑𝐄𝐀𝐓𝐎𝐑𝐒-𝐌𝐄𝐍𝐔
☞𝐣𝐨𝐢𝐧𝐝𝐞𝐯𝐞𝐥𝐠𝐫𝐨𝐮𝐩
☞𝐣𝐨𝐢𝐧𝐩𝐫𝐨𝐦𝐨𝐭𝐠𝐫𝐨𝐮𝐩
☞𝐝𝐞𝐯𝐜𝐡𝐚𝐧𝐧𝐞𝐥
☞𝐩𝐫𝐨𝐦𝐨𝐭𝐜𝐡𝐚𝐧𝐧𝐞𝐥
☞𝗰𝗼𝗻𝘁𝗮𝗰𝘁𝗱𝗲𝘃
☞𝗰𝗼𝗻𝘁𝗮𝗰𝘁𝗽𝗿𝗼𝗺𝗼𝘁
☞𝗵𝗲𝗹𝗽𝗰𝗲𝗻𝘁𝗲𝗿

📡 Chaîne officielle : ${env.WHATSAPP_CHANNEL || 'Non configurée'}
      `.trim();

      // 4) Envoyer l'image avec la légende
      await message.reply(imageMedia, undefined, { caption: menuText });

      // 5) Envoyer l'audio en message vocal (ptt)
      await message.reply(audioMedia, undefined, { sendAudioAsVoice: true });

      return { text: null }; // Pas de texte additionnel (on a déjà tout envoyé)
    } catch (err) {
      console.error('Erreur dans menu.js:', err);
      return { text: '❌ Impossible d\'afficher le menu pour le moment.' };
    }
  }
};
