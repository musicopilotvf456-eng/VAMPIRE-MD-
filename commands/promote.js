// commands/promote.js
module.exports = {
  name: 'promote',
  description: 'Promouvoir un membre en administrateur du groupe',
  async execute({ client, message }) {
    try {
      if (!message.isGroup) {
        return client.sendMessage(message.from, { text: '❌ Cette commande fonctionne uniquement dans les groupes.' });
      }

      const groupMetadata = await client.groupMetadata(message.from);
      const isBotAdmin = groupMetadata.participants.find(p => p.id === client.user.id && p.admin);
      if (!isBotAdmin) {
        return client.sendMessage(message.from, { text: '❌ Je dois être admin pour promouvoir quelqu’un.' });
      }

      const isUserAdmin = groupMetadata.participants.find(p => p.id === message.sender && p.admin);
      if (!isUserAdmin) {
        return client.sendMessage(message.from, { text: '❌ Seuls les administrateurs peuvent promouvoir quelqu’un.' });
      }

      if (!message.quoted) {
        return client.sendMessage(message.from, { text: '⚠️ Réponds au message de la personne que tu veux promouvoir.' });
      }

      const promotee = message.quoted.sender;
      await client.groupParticipantsUpdate(message.from, [promotee], 'promote');

      const botImage = 'https://files.catbox.moe/jvuqi0.jpg';

      const caption = `
┌───────────────────
│ 🅥︎🅐︎🅜︎🅟︎🅘︎🅡︎🅔︎  Ⓜ︎Ⓓ︎
└───────────────────
🌐𝐕𝐄𝐑𝐒𝐈𝐎𝐍 : *1.0*
🖊️𝚃𝚈𝙿𝙴 : 𝙼𝙸𝙽𝙸-𝙱𝙾𝚃
🌹⃝━❮ 𝓹𝓻𝓸𝓶𝓾𝓽 𝓹𝓪𝓻 𝓳𝓮𝓷𝓲𝓯𝓮𝓻 𝔁𝓶
__________________________________
🎊 @${promotee.split('@')[0]} was promot by @${message.sender.split('@')[0]}
__________________________________
`;

      await client.sendMessage(message.from, {
        image: { url: botImage },
        caption,
        mentions: [promotee, message.sender]
      });

    } catch (err) {
      console.error('Erreur promote.js:', err);
      client.sendMessage(message.from, { text: '❌ Erreur lors de la promotion de ce membre.' });
    }
  }
};
