// commands/date.js
module.exports = {
  name: 'date',
  description: 'Affiche la date, le jour et l\'heure actuelle',
  async execute({ client, message }) {
    try {
      const botImage = 'https://files.catbox.moe/jvuqi0.jpg'; // image du bot
      const mentioned = message.mentionedJid?.[0] || message.sender;

      // Récupération date et heure
      const now = new Date();
      const optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
      const optionsDay = { weekday: 'long' };
      const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit' };

      const date = now.toLocaleDateString('fr-FR', optionsDate);
      const day = now.toLocaleDateString('fr-FR', optionsDay);
      const time = now.toLocaleTimeString('fr-FR', optionsTime);

      const caption = `
┌───────────────────
│ 🅥︎🅐︎🅜︎🅟︎🅘︎🅡︎🅔︎  Ⓜ︎Ⓓ︎
└───────────────────
🌐𝐕𝐄𝐑𝐒𝐈𝐎𝐍 : *1.0*
🖊️𝚃𝚈𝙿𝙴 : 𝙼𝙸𝙽𝙸-𝙱𝙾𝚃
🌹⃝━❮ 𝓹𝓻𝓸𝓶𝓾𝓽 𝓹𝓪𝓻 𝓳𝓮𝓷𝓲𝓯𝓮𝓻 𝔁𝓶
__________________________________
📅 Date : ${date}
📆 Jour : ${day}
🕒 Heure : ${time}
__________________________________
`;

      await client.sendMessage(message.from, {
        image: { url: botImage },
        caption: caption,
        mentions: [mentioned]
      });
    } catch (err) {
      console.error('Erreur dans date.js:', err);
      return { text: '❌ Impossible d’afficher la date et l’heure.' };
    }
  }
};
