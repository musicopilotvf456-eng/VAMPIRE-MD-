// commands/demote.js
module.exports = {
  name: 'demote',
  description: 'Révoquer les droits administrateur d’un membre',
  async execute({ client, message }) {
    try {
      if (!message.isGroup) {
        return client.sendMessage(message.from, { text: '❌ Cette commande fonctionne uniquement dans les groupes.' });
      }

      const groupMetadata = await client.groupMetadata(message.from);
      const isBotAdmin = groupMetadata.participants.find(p => p.id === client.user.id && p.admin);
      if (!isBotAdmin) {
        return client.sendMessage(message.from, { text: '❌ Je dois être admin pour révoquer les droits de quelqu’un.' });
      }

      const isUserAdmin = groupMetadata.participants.find(p => p.id === message.sender && p.admin);
      if (!isUserAdmin) {
        return client.sendMessage(message.from, { text: '❌ Seuls les administrateurs peuvent révoquer un admin.' });
      }

      if (!message.quoted) {
        return client.sendMessage(message.from, { text: '⚠️ Réponds au message de l’administrateur que tu veux révoquer.' });
      }

      const demotee = message.quoted.sender;
      await client.groupParticipantsUpdate(message.from, [demotee], 'demote');

      const botImage = 'https://files.catbox.moe/jvuqi0.jpg';

      const caption = `
┌───────────────────
│ 🅥︎🅐︎🅜︎🅟︎🅘︎🅡︎🅔︎  Ⓜ︎Ⓓ︎
└───────────────────
🌐𝐕𝐄𝐑𝐒𝐈𝐎𝐍 : *1.0*
🖊️𝚃𝚈𝙿𝙴 : 𝙼𝙸𝙽𝙸-𝙱𝙾𝚃
🌹⃝━❮ 𝓹𝓻𝓸𝓶𝓾𝓽 𝓹𝓪𝓻 𝓳𝓮𝓷𝓲𝓯𝓮𝓻 𝔁𝓶
__________________________________
👀 @${demotee.split('@')[0]} demot @${message.sender.split('@')[0]}
❤️‍🩹
__________________________________
`;

      await client.sendMessage(message.from, {
        image: { url: botImage },
        caption,
        mentions: [demotee, message.sender]
      });

    } catch (err) {
      console.error('Erreur demote.js:', err);
      client.sendMessage(message.from, { text: '❌ Erreur lors de la révocation de cet administrateur.' });
    }
  }
};
