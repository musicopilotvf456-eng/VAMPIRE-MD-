// commands/happy.js
module.exports = {
  name: 'happy',
  description: 'Mentionne une personne et lui dit que tu es heureux',
  async execute({ client, message, args }) {
    try {
      const botImage = 'https://files.catbox.moe/jvuqi0.jpg'; // image du bot
      const mentioned = message.mentionedJid?.[0] || args[0];

      if (!mentioned) {
        return { text: '❌ Utilisation : !happy @user' };
      }

      const caption = `
┌───────────────────
│ 🅥︎🅐︎🅜︎🅟︎🅘︎🅡︎🅔︎  Ⓜ︎Ⓓ︎
└───────────────────
🌐𝐕𝐄𝐑𝐒𝐈𝐎𝐍 : *1.0*
🖊️𝚃𝚈𝙿𝙴 : 𝙼𝙸𝙽𝙸-𝙱𝙾𝚃
🌹⃝━❮ 𝓹𝓻𝓸𝓶𝓾𝓽 𝓹𝓪𝓻 𝓳𝓮𝓷𝓲𝓯𝓮𝓻 𝔁𝓶
__________________________________
👀 Hey @${mentioned.split('@')[0]} i am happy ❤️‍🩹 thank you 💟
__________________________________
`;

      await client.sendMessage(message.from, {
        image: { url: botImage },
        caption: caption,
        mentions: [mentioned] // pour que la personne soit vraiment mentionnée
      });
    } catch (err) {
      console.error('Erreur dans happy.js:', err);
      return { text: '❌ Impossible d’envoyer le message happy.' };
    }
  }
};
