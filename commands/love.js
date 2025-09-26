// commands/love.js
module.exports = {
  name: 'love',
  description: 'Mentionne une personne et lui déclare ton amour',
  async execute({ client, message, args }) {
    try {
      const botImage = 'https://files.catbox.moe/jvuqi0.jpg'; // image du bot
      const mentioned = message.mentionedJid?.[0] || args[0];

      if (!mentioned) {
        return { text: '❌ Utilisation : !love @user' };
      }

      const caption = `
┌───────────────────
│ 🅥︎🅐︎🅜︎🅟︎🅘︎🅡︎🅔︎  Ⓜ︎Ⓓ︎
└───────────────────
🌐𝐕𝐄𝐑𝐒𝐈𝐎𝐍 : *1.0*
🖊️𝚃𝚈𝙿𝙴 : 𝙼𝙸𝙽𝙸-𝙱𝙾𝚃
🌹⃝━❮ 𝓹𝓻𝓸𝓶𝓾𝓽 𝓹𝓪𝓻 𝓳𝓮𝓷𝓲𝓯𝓮𝓻 𝔁𝓶
__________________________________
👀 Hey @${mentioned.split('@')[0]} i love you 🫶🏼🥹
Accept me please 🌹🤭
__________________________________
`;

      await client.sendMessage(message.from, {
        image: { url: botImage },
        caption: caption,
        mentions: [mentioned]
      });
    } catch (err) {
      console.error('Erreur dans love.js:', err);
      return { text: '❌ Impossible d’envoyer le message love.' };
    }
  }
};
