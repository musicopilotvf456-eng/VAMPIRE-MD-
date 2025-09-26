// commands/more.js
module.exports = {
  name: 'more',
  description: 'Affiche des infos sur le bot et le lien de la chaîne',
  async execute({ client, message }) {
    try {
      const botImage = 'https://files.catbox.moe/jvuqi0.jpg'; // Image officielle du bot
      const caption = `
┌───────────────────
│ 🅥︎🅐︎🅜︎🅟︎🅘︎🅡︎🅔︎  Ⓜ︎Ⓓ︎
└───────────────────
🌐 𝐕𝐄𝐑𝐒𝐈𝐎𝐍 : *1.0*
🖊️ 𝚃𝚈𝙿𝙴 : 𝙼𝙸𝙽𝙸-𝙱𝙾𝚃
👨‍💻 𝐃𝐄𝐕𝐄𝐋𝐎𝐏𝐏𝐄𝐔𝐑 : 𝑱𝑬𝑵𝑰𝑭𝑬𝑹 𝑿𝑴
👨‍🔬 𝐏𝐑𝐎𝐌𝐎𝐓𝐄𝐔𝐑 : 𝐌𝐈𝐊𝐀𝐄𝐋 𝐊𝐀𝐁𝐎𝐑𝐄
📢 𝐂𝐇𝐀𝐈𝐍𝐄 𝐖𝐇𝐀𝐓𝐒𝐀𝐏𝐏 :
https://whatsapp.com/channel/0029VbB3lzT3GJP3AsgHA71W
🌹⃝━❮ 𝓹𝓻𝓸𝓶𝓾𝓽 𝓹𝓪𝓻 𝓳𝓮𝓷𝓲𝓯𝓮𝓻 𝔁𝓶
__________________________________
__________________________________
`;

      await client.sendMessage(message.from, {
        image: { url: botImage },
        caption: caption
      });
    } catch (err) {
      console.error('Erreur dans more.js:', err);
      return { text: '❌ Impossible d’afficher les infos du bot.' };
    }
  }
};
